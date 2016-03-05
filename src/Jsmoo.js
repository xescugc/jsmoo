import has, { mountMethods, typeValidation, executeCoerce, executeTrigger, requireValidation, executeDefault, executeBuilder } from './has';
import withRoles from './with';

function initializeAttribute(attr, value) {
  let newValue = value;
  if (!this._jsmoo_) throw new TypeError(`The attribute ${attr} is not defined`);
  if (this._jsmoo_._has_[attr].coerce) newValue = executeCoerce.bind(this)(attr, newValue);
  if (this._jsmoo_._has_[attr].isa) typeValidation(attr, newValue, this._jsmoo_._has_[attr].isa);
  if (this._jsmoo_._has_[attr].trigger) executeTrigger.bind(this)(attr, newValue, undefined);
  this._attributes_[attr] = newValue;
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
    initializedAttr.forEach(attr => initializeAttribute.bind(this)(attr, newAttrs[attr]));
    requireValidation.bind(this)();
    hasAttr.filter(attr => initializedAttr.indexOf(attr) < 0).forEach(attr => {
      if (Object.keys(this._jsmoo_._has_[attr]).indexOf('default') >= 0 && !this._jsmoo_._has_[attr].lazy) {
        this._attributes_[attr] = executeDefault.bind(this)(attr);
      } else if (Object.keys(this._jsmoo_._has_[attr]).indexOf('builder') >= 0 && !this._jsmoo_._has_[attr].lazy) {
        this._attributes_[attr] = executeBuilder.bind(this)(attr);
      }
      if (Object.keys(this._jsmoo_._has_[attr]).indexOf('coerce') >= 0) this._attributes_[attr] = executeCoerce.bind(this)(attr);
    });
    if (typeof this.afterInitialize === 'function') this.afterInitialize();
  }
}

Jsmoo.has = has;
Jsmoo.with = withRoles;

export default Jsmoo;
