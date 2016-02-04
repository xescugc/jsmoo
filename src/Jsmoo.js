import Role from './Role';

function _typeValidation(value, expectedType) {
  let foundType = typeof value;
  if (typeof expectedType === 'function') return expectedType(value);
  if (Array.isArray(value)) foundType = 'array';
  if (value === null) foundType = 'null';
  if ((value === null || value === undefined) || (foundType !== expectedType && value.constructor.name !== expectedType)) {
    throw new TypeError(`Invalid type for the attribute name, it must be '${expectedType}' found '${foundType}'`);
  }
  return true;
}

function _requireValidation() {
  Object.keys(this._jsmoo_._has_).forEach(attr => {
    if (this._jsmoo_._has_[attr].required && (this._jsmoo_[attr] === undefined || this._jsmoo_[attr] === null)) {
      throw new TypeError(`The attribute '${attr}' is required`);
    }
  });
}

function _executeDefault(attr) {
  const defaultValue = this._jsmoo_._has_[attr].default;
  const value = typeof defaultValue === 'function' ? defaultValue.bind(this)() : defaultValue;
  if (this._jsmoo_._has_[attr].isa) {
    _typeValidation(value, this._jsmoo_._has_[attr].isa);
  }
  return value;
}

// 'this' context = { klass: this.prototype, opts, attr }
function _defineSetter(newValue) {
  if (this.opts.isa) _typeValidation(newValue, this.opts.isa);
  if (this.opts.is === 'ro') throw new TypeError(`Can not set to a RO attribute ${this.attr}`);
  this.klass._jsmoo_[this.attr] = newValue;
}

// 'this' context = { klass: this.prototype, opts, attr }
function _defineGetter() {
  let value = this.klass._jsmoo_[this.attr];
  if (value === undefined && this.opts.lazy && Object.keys(this.opts).indexOf('default') >= 0) {
    value = _executeDefault.bind(this.klass)(this.attr);
    this.klass._jsmoo_[this.attr] = value;
  }
  return value;
}

function _defineAttribute(attr, opts) {
  if (!opts || !opts.is) throw new TypeError("'is' key is required");
  const context = { klass: this.prototype, opts, attr };
  this.prototype._jsmoo_._has_[attr] = opts;
  Object.defineProperty(this.prototype, attr, {
    configurable: true,
    enumerable:   true,
    get:          _defineGetter.bind(context),
    set:          _defineSetter.bind(context),
  });
}

function _initializeAttribute(attr, value) {
  if (!this._jsmoo_) throw new TypeError(`The attribute ${attr} is not defined`);
  if (this._jsmoo_._has_[attr].isa) _typeValidation(value, this._jsmoo_._has_[attr].isa);
  this._jsmoo_[attr] = value;
}

function _composeRole(role) {
  if (Object.getPrototypeOf(role) !== Role) throw new TypeError('Only Roles can be composed');

  [{ base: this, role }, { base: this.prototype, role: role.prototype }].forEach(proto => {
    Object.getOwnPropertyNames(proto.role).concat(Object.getOwnPropertySymbols(proto.role)).forEach((prop) => {
      if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) return;
      Object.defineProperty(proto.base, prop, Object.getOwnPropertyDescriptor(proto.role, prop));
    });
  });
}

class Jsmoo {
  static has(attrs) {
    if (!this.prototype._jsmoo_) this.prototype._jsmoo_ = { _has_: {} };
    Object.keys(attrs).forEach(attr => _defineAttribute.bind(this, attr, attrs[attr])());
  }
  static with(...roles) {
    roles.forEach(r => _composeRole.bind(this, r)());
  }
  constructor(attrs = {}) {
    if (!this._jsmoo_) return;
    let newAttrs = attrs;
    if (typeof this.beforeInitialize === 'function') newAttrs = this.beforeInitialize(attrs);
    const hasAttr = Object.keys(this._jsmoo_._has_);
    const initializedAttr = Object.keys(newAttrs).filter(k => hasAttr.indexOf(k) >= 0 ? true : false);
    initializedAttr.forEach(attr => _initializeAttribute.bind(this, attr, newAttrs[attr])());
    _requireValidation.bind(this)();
    hasAttr.filter(attr => initializedAttr.indexOf(attr) < 0).forEach(attr => {
      if (Object.keys(this._jsmoo_._has_[attr]).indexOf('default') >= 0 && !this._jsmoo_._has_[attr].lazy) this._jsmoo_[attr] = _executeDefault.bind(this, attr)();
    });
    if (typeof this.afterInitialize === 'function') this.afterInitialize.bind(this)();
  }
}

export default Jsmoo;
