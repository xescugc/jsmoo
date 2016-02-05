function typeValidation(value, expectedType) {
  let foundType = typeof value;
  if (typeof expectedType === 'function') return expectedType(value);
  if (Array.isArray(value)) foundType = 'array';
  if (value === null) foundType = 'null';
  if ((value === null || value === undefined) || (foundType !== expectedType && value.constructor.name !== expectedType)) {
    throw new TypeError(`Invalid type for the attribute name, it must be '${expectedType}' found '${foundType}'`);
  }
  return true;
}

function executeDefault(attr) {
  const defaultValue = this._jsmoo_._has_[attr].default;
  const value = typeof defaultValue === 'function' ? defaultValue.bind(this)() : defaultValue;
  if (this._jsmoo_._has_[attr].isa) {
    typeValidation(value, this._jsmoo_._has_[attr].isa);
  }
  return value;
}

// 'this' context = { klass: this.prototype, opts, attr }
function defineSetter(newValue) {
  if (this.opts.isa) typeValidation(newValue, this.opts.isa);
  if (this.opts.is === 'ro') throw new TypeError(`Can not set to a RO attribute ${this.attr}`);
  this.klass._jsmoo_[this.attr] = newValue;
}

// 'this' context = { klass: this.prototype, opts, attr }
function defineGetter() {
  let value = this.klass._jsmoo_[this.attr];
  if (value === undefined && this.opts.lazy && Object.keys(this.opts).indexOf('default') >= 0) {
    value = executeDefault.bind(this.klass)(this.attr);
    this.klass._jsmoo_[this.attr] = value;
  }
  return value;
}

function defineAttribute(attr, opts) {
  if (!opts || !opts.is) throw new TypeError("'is' key is required");
  const context = { klass: this.prototype, opts, attr };
  this.prototype._jsmoo_._has_[attr] = opts;
  if (Object.getPrototypeOf(this).name === 'Role') return;
  Object.defineProperty(this.prototype, attr, {
    configurable: true,
    enumerable:   true,
    get:          defineGetter.bind(context),
    set:          defineSetter.bind(context),
  });
}

function requireValidation() {
  Object.keys(this._jsmoo_._has_).forEach(attr => {
    if (this._jsmoo_._has_[attr].required && (this._jsmoo_[attr] === undefined || this._jsmoo_[attr] === null)) {
      throw new TypeError(`The attribute '${attr}' is required`);
    }
  });
}

function has(attrs) {
  if (!this.prototype._jsmoo_) this.prototype._jsmoo_ = { _has_: {} };
  Object.keys(attrs).forEach(attr => defineAttribute.bind(this, attr, attrs[attr])());
}

export default has;

export { defineAttribute };
export { requireValidation };
export { typeValidation };
export { executeDefault };
