function _executeDefault(defaultValue) {
  return typeof defaultValue === 'function' ? defaultValue.bind(this)() : defaultValue;
}

//function _typeValidation(value, expectedType) {
  //let foundType = typeof value;
  //if (Array.isArray(value)) foundType = 'array';
  //if (foundType !== expectedType) {
    //throw new TypeError(`Invalid type definition ${expectedType} and found ${foundType}`);
  //}
  //return true;
//}

function _defineSetter(newValue) {
  if (this.opts.is === 'ro') throw new TypeError(`Can not set to a RO attribute ${this.attr}`);
  this.klass._jsmoo_[this.attr] = newValue;
}

function _defineGetter() {
  return this.klass._jsmoo_[this.attr];
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
  this._jsmoo_[attr] = value;
}

class Jsmoo {
  static has(attrs) {
    if (!this.prototype._jsmoo_) this.prototype._jsmoo_ = { _has_: {} };
    Object.keys(attrs).forEach(attr => _defineAttribute.bind(this, attr, attrs[attr])());
  }
  constructor(attrs = {}) {
    if (!this._jsmoo_) return;
    let newAttrs = attrs;
    if (typeof this.beforeInitialize === 'function') newAttrs = this.beforeInitialize(attrs);
    const initializedAttr = Object.keys(newAttrs);
    initializedAttr.forEach(attr => _initializeAttribute.bind(this, attr, newAttrs[attr])());
    Object.keys(this._jsmoo_._has_).filter(attr => initializedAttr.indexOf(attr) < 0).forEach(attr => {
      if (this._jsmoo_._has_[attr].default) this._jsmoo_[attr] = _executeDefault.bind(this, this._jsmoo_._has_[attr].default)();
    });
    if (typeof this.afterInitialize === 'function') this.afterInitialize.bind(this)();
  }
}

export default Jsmoo;
