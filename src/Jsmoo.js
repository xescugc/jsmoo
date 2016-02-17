import has, { mountMethods, typeValidation, requireValidation, executeDefault, executeBuilder } from './has';
import withRoles from './with';

function initializeAttribute(attr, value) {
  if (!this._jsmoo_) throw new TypeError(`The attribute ${attr} is not defined`);
  if (this._jsmoo_._has_[attr].isa) typeValidation(value, this._jsmoo_._has_[attr].isa);
  this._attributes_[attr] = value;
}


class Jsmoo {
  constructor(attrs = {}) {
    if (!this._jsmoo_) return;
    if (!this._attributes_) this._attributes_ = {};
    mountMethods.bind(this)();
    let newAttrs = attrs;
    if (typeof this.beforeInitialize === 'function') newAttrs = this.beforeInitialize(attrs);
    const hasAttr = Object.keys(this._jsmoo_._has_);
    const initializedAttr = Object.keys(newAttrs).filter(k => hasAttr.indexOf(k) >= 0 ? true : false);
    initializedAttr.forEach(attr => initializeAttribute.bind(this, attr, newAttrs[attr])());
    requireValidation.bind(this)();
    hasAttr.filter(attr => initializedAttr.indexOf(attr) < 0).forEach(attr => {
      if (Object.keys(this._jsmoo_._has_[attr]).indexOf('default') >= 0 && !this._jsmoo_._has_[attr].lazy) {
        this[attr] = executeDefault.bind(this)(attr);
      } else if (Object.keys(this._jsmoo_._has_[attr]).indexOf('builder') >= 0 && !this._jsmoo_._has_[attr].lazy) {
        this[attr] = executeBuilder.bind(this)(attr);
      }
    });
    if (typeof this.afterInitialize === 'function') this.afterInitialize();
  }
}

Jsmoo.has = has;
Jsmoo.with = withRoles;

export default Jsmoo;
