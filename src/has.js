function hasOption(attr, option) { return Object.keys(this._has_[attr]).indexOf(option) >= 0; }
function hasOptionsFor(attr) { return this._has_[attr]; }
function getOption(attr, option) { return this._has_[attr][option]; }
function setOption(attr, value) { this._has_[attr] = value; }
function getAllOptions() { return this._has_; }

function getAttribute(attr) { return this._attributes_[attr]; }
function setAttribute(attr, value) { this._attributes_[attr] = value; }
function deleteAttribute(attr) { delete this._attributes_[attr]; }
function getAttributes() { return this._attributes_; }

function defineFunctionNameFromAttribute(prefix, attr) {
  if (attr.match(/^_/)) {
    return `_${prefix}${attr[1].toUpperCase()}${attr.substring(2)}`;
  }
  return `${prefix}${attr[0].toUpperCase()}${attr.substring(1)}`;
}

function typeValidation(attr, value) {
  if (!hasOption.bind(this)(attr, 'isa')) return true;
  let isMaybe = false;
  let expectedType = getOption.bind(this)(attr, 'isa');
  if (typeof expectedType === 'function') return expectedType(value);
  let foundType = typeof value;
  const match = expectedType.match(/Maybe\[(.*)\]/);
  if (match) {
    expectedType = match[1];
    isMaybe = true;
  }
  if (Array.isArray(value)) foundType = 'array';
  if (value === null) foundType = 'null';
  if ((value === null || value === undefined) && isMaybe) return true;
  if (((value === null || value === undefined) && !isMaybe) || (foundType !== expectedType && value.constructor.name !== expectedType)) {
    throw new TypeError(`Invalid type for the attribute ${attr}, it must be '${expectedType}' found '${foundType}'`);
  }
  return true;
}

function executeCoerce(attr, value) {
  if (!hasOption.bind(this)(attr, 'coerce')) return value;
  const coerceValue = getOption.bind(this)(attr, 'coerce');
  if (typeof coerceValue !== 'function') throw new TypeError(`Invalid type of Coerce on '${attr}'`);

  return coerceValue(value);
}

function executeDefault(attr) {
  const defaultValue = getOption.bind(this)(attr, 'default');
  let value = typeof defaultValue === 'function' ? defaultValue.bind(this)() : defaultValue;
  value = executeCoerce.bind(this)(attr, value);
  typeValidation.bind(this)(attr, value);
  return value;
}

function executeBuilder(attr) {
  const defaultValue = getOption.bind(this)(attr, 'builder');
  let value;
  if (typeof defaultValue === 'string') {
    if (!this[defaultValue]) throw new TypeError(`The builder function '${defaultValue}' is not defined`);
    value = this[defaultValue]();
  } else {
    const builderFunction = defineFunctionNameFromAttribute('build', attr);
    if (!this[builderFunction]) throw new TypeError(`The builder function '${builderFunction}' is not defined`);
    value = this[builderFunction]();
  }
  value = executeCoerce.bind(this)(attr, value);
  typeValidation.bind(this)(attr, value);
  return value;
}

function executeTrigger(attr, newValue, oldValue) {
  if (!hasOption.bind(this)(attr, 'trigger')) return true;
  const triggerValue = getOption.bind(this)(attr, 'trigger');
  if (typeof triggerValue === 'function') {
    triggerValue.bind(this)(newValue, oldValue);
  } else {
    const triggerFunction = defineFunctionNameFromAttribute('trigger', attr);
    this[triggerFunction](newValue, oldValue);
  }
}

function defineSetter(attr, value) {
  let newValue = value;
  newValue = executeCoerce.bind(this)(attr, newValue);
  typeValidation.bind(this)(attr, newValue);
  if (getOption.bind(this)(attr, 'is') === 'ro') throw new TypeError(`Can not set to a RO attribute ${attr}`);
  executeTrigger.bind(this)(attr, newValue, getAttribute.bind(this)(attr));
  setAttribute.bind(this)(attr, newValue);
}

function defineGetter(attr) {
  let value = getAttribute.bind(this)(attr);
  const isLazy = hasOption.bind(this)(attr, 'lazy');
  if (value === undefined && isLazy && hasOption.bind(this)(attr, 'default')) {
    value = executeDefault.bind(this)(attr);
    value = executeCoerce.bind(this)(attr, value);
    setAttribute.bind(this)(attr, value);
  } else if (value === undefined && isLazy && hasOption.bind(this)(attr, 'builder')) {
    value = executeBuilder.bind(this)(attr);
    value = executeCoerce.bind(this)(attr, value);
    setAttribute.bind(this)(attr, value);
  }
  return value;
}

function definePredicate(attr) {
  if (!hasOption.bind(this)(attr, 'predicate')) return;
  const predicateName = defineFunctionNameFromAttribute('has', attr);
  this[predicateName] = () => {
    const attributeValue = getAttribute.bind(this)(attr);
    return (attributeValue !== undefined) && (attributeValue !== null);
  };
}

function defineClearer(attr) {
  if (!hasOption.bind(this)(attr, 'clearer')) return;
  const clearerName = defineFunctionNameFromAttribute('clear', attr);
  this[clearerName] = deleteAttribute.bind(this, attr);
}

function defineAttribute(attr, opts) {
  if (hasOptionsFor.bind(this.prototype)(attr)) return;
  let newAttr = attr;
  let newOpts = opts;
  const isOverride = !!newAttr.match(/^\+/);
  if (isOverride) newAttr = attr.replace(/^\+/, '');

  if (!isOverride && (!newOpts || !newOpts.is)) throw new TypeError("'is' key is required");

  if (isOverride && hasOptionsFor.bind(this.prototype)(newAttr)) {
    // TODO: Remove the old property? if something was created
    const beforeHas = hasOptionsFor.bind(this.prototype)(newAttr);
    newOpts = Object.assign({}, beforeHas, opts);
  }
  if (Object.getPrototypeOf(this).name === 'Role') {
    setOption.bind(this.prototype)(attr, opts);
    return;
  }
  if (isOverride && !hasOptionsFor.bind(this.prototype)(newAttr)) throw new TypeError(`Can't override an unexistent attribute '${newAttr}'`);
  setOption.bind(this.prototype)(newAttr, newOpts);
}

function mountGettersSetters() {
  Object.keys(getAllOptions.bind(this)()).forEach(attr => {
    definePredicate.bind(this)(attr);
    defineClearer.bind(this)(attr);

    Object.defineProperty(this, attr, {
      configurable: true,
      enumerable:   true,
      get:          defineGetter.bind(this, attr),
      set:          defineSetter.bind(this, attr),
    });
  });
}

function requireValidation() {
  Object.keys(getAllOptions.bind(this)()).forEach(attr => {
    if (getOption.bind(this)(attr, 'required') && (getAttribute.bind(this)(attr) === undefined || getAttribute.bind(this)(attr) === null)) {
      throw new TypeError(`The attribute '${attr}' is required`);
    }
  });
}

function has(attrs) {
  if (!this.prototype._has_) this.prototype._has_ = { };
  Object.keys(attrs).forEach(attr => defineAttribute.bind(this)(attr, attrs[attr]));
}

export default has;

export { requireValidation };
export { typeValidation };
export { executeDefault };
export { executeBuilder };
export { executeTrigger };
export { executeCoerce };
export { hasOption };
export { setAttribute };
export { getAllOptions };
export { mountGettersSetters };
export { hasOptionsFor };
export { getAttributes };
