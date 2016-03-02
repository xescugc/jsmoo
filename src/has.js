function defineFunctionNameFromAttribute(prefix, attr) {
  if (attr.match(/^_/)) {
    return `_${prefix}${attr[1].toUpperCase()}${attr.substring(2)}`;
  }
  return `${prefix}${attr[0].toUpperCase()}${attr.substring(1)}`;
}

function typeValidation(attr, value, expectedType) {
  let foundType = typeof value;
  if (typeof expectedType === 'function') return expectedType(value);
  if (Array.isArray(value)) foundType = 'array';
  if (value === null) foundType = 'null';
  if ((value === null || value === undefined) || (foundType !== expectedType && value.constructor.name !== expectedType)) {
    throw new TypeError(`Invalid type for the attribute ${attr}, it must be '${expectedType}' found '${foundType}'`);
  }
  return true;
}

function executeDefault(attr) {
  const defaultValue = this._jsmoo_._has_[attr].default;
  const value = typeof defaultValue === 'function' ? defaultValue.bind(this)() : defaultValue;
  if (this._jsmoo_._has_[attr].isa) {
    typeValidation(attr, value, this._jsmoo_._has_[attr].isa);
  }
  return value;
}

function executeBuilder(attr) {
  const defaultValue = this._jsmoo_._has_[attr].builder;
  let value;
  if (typeof defaultValue === 'string') {
    if (!this[defaultValue]) throw new TypeError(`The builder function '${defaultValue}' is not defined`);
    value = this[defaultValue]();
  } else {
    const builderFunction = defineFunctionNameFromAttribute('build', attr);
    if (!this[builderFunction]) throw new TypeError(`The builder function '${builderFunction}' is not defined`);
    value = this[builderFunction]();
  }
  if (this._jsmoo_._has_[attr].isa) {
    typeValidation(attr, value, this._jsmoo_._has_[attr].isa);
  }
  return value;
}

function executeTrigger(attr, newValue, oldValue) {
  const triggerValue = this._jsmoo_._has_[attr].trigger;
  if (typeof triggerValue === 'function') {
    triggerValue.bind(this)(newValue, oldValue);
  } else {
    const triggerFunction = defineFunctionNameFromAttribute('trigger', attr);
    this[triggerFunction](newValue, oldValue);
  }
}

// 'this' context = { klass: this.prototype, opts, attr }
function defineSetter(newValue) {
  if (this.opts.isa) typeValidation(this.attr, newValue, this.opts.isa);
  if (this.opts.is === 'ro') throw new TypeError(`Can not set to a RO attribute ${this.attr}`);
  if (this.opts.trigger) executeTrigger.bind(this.klass)(this.attr, newValue, this.klass._attributes_[this.attr]);
  this.klass._attributes_[this.attr] = newValue;
}

// 'this' context = { klass: this.prototype, opts, attr }
function defineGetter() {
  let value = this.klass._attributes_[this.attr];
  if (value === undefined && this.opts.lazy && Object.keys(this.opts).indexOf('default') >= 0) {
    value = executeDefault.bind(this.klass)(this.attr);
    this.klass._attributes_[this.attr] = value;
  } else if (value === undefined && this.opts.lazy && Object.keys(this.opts).indexOf('builder') >= 0) {
    value = executeBuilder.bind(this.klass)(this.attr);
    this.klass._attributes_[this.attr] = value;
  }
  return value;
}

// 'this' context = { klass: this.prototype, opts, attr }
function definePredicate() {
  const predicateName = defineFunctionNameFromAttribute('has', this.attr);
  Object.defineProperty(this.klass, predicateName, {
    configurable: true,
    enumerable:   true,
    get:          () => {
      return (this.klass._attributes_[this.attr] !== undefined) && (this.klass._attributes_[this.attr] !== null);
    },
  });
}

// 'this' context = { klass: this.prototype, opts, attr }
function defineClearer() {
  const clearerName = defineFunctionNameFromAttribute('clear', this.attr);
  this.klass[clearerName] = () => this.klass._attributes_[this.attr] = undefined;
}

function defineAttribute(attr, opts) {
  if (this.prototype._jsmoo_._has_[attr]) return;
  let newAttr = attr;
  let newOpts = opts;
  const isOverride = !!newAttr.match(/^\+/);
  if (isOverride) newAttr = attr.replace(/^\+/, '');

  if (!isOverride && (!newOpts || !newOpts.is)) throw new TypeError("'is' key is required");
  if (isOverride && this.prototype._jsmoo_._has_[newAttr]) {
    // TODO: Remove the old property?
    const beforeHas = this.prototype._jsmoo_._has_[newAttr];
    newOpts = Object.assign({}, beforeHas, opts);
  }
  if (Object.getPrototypeOf(this).name === 'Role') {
    this.prototype._jsmoo_._has_[attr] = opts;
    return;
  }
  if (isOverride && !this.prototype._jsmoo_._has_[newAttr]) throw new TypeError(`Can't override an unexistent attribute '${newAttr}'`);
  this.prototype._jsmoo_._has_[newAttr] = newOpts;
}

function mountMethods() {
  Object.keys(this._jsmoo_._has_).forEach(attr => {
    const opts = this._jsmoo_._has_[attr];
    const context = { klass: this, opts, attr };
    if (opts.predicate) definePredicate.bind(context)();
    if (opts.clearer) defineClearer.bind(context)();
    Object.defineProperty(this, attr, {
      configurable: true,
      enumerable:   true,
      get:          defineGetter.bind(context),
      set:          defineSetter.bind(context),
    });
  });
}

function requireValidation() {
  Object.keys(this._jsmoo_._has_).forEach(attr => {
    if (this._jsmoo_._has_[attr].required && (this._attributes_[attr] === undefined || this._attributes_[attr] === null)) {
      throw new TypeError(`The attribute '${attr}' is required`);
    }
  });
}

function has(attrs) {
  if (!this.prototype._jsmoo_) this.prototype._jsmoo_ = { _has_: {} };
  Object.keys(attrs).forEach(attr => defineAttribute.bind(this)(attr, attrs[attr]));
}

export default has;

export { defineAttribute };
export { requireValidation };
export { typeValidation };
export { executeDefault };
export { executeBuilder };
export { executeTrigger };
export { mountMethods };
