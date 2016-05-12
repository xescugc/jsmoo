import has, { hasOption, typeValidation, executeCoerce, executeTrigger, requireValidation, executeDefault, executeBuilder } from './has';
import withRoles from './with';

function initializeAttribute(attr, value) {
  let newValue = value;
  if (!this._jsmoo_) throw new TypeError(`The attribute ${attr} is not defined`);
  newValue = executeCoerce.bind(this)(attr, newValue);
  typeValidation.bind(this)(attr, newValue);
  executeTrigger.bind(this)(attr, newValue, undefined);
  this._attributes_[attr] = newValue;
}


class Jsmoo {
  constructor(attrs = {}) {
    if (!this._jsmoo_) return;
    let newAttrs = attrs;
    if (typeof this.beforeInitialize === 'function') newAttrs = this.beforeInitialize(attrs);
    const hasAttr = Object.keys(this._jsmoo_._has_);
    const initializedAttr = Object.keys(newAttrs).filter(k => hasAttr.indexOf(k) >= 0 ? true : false);
    initializedAttr.forEach(attr => initializeAttribute.bind(this)(attr, newAttrs[attr]));
    requireValidation.bind(this)();
    hasAttr.filter(attr => initializedAttr.indexOf(attr) < 0).forEach(attr => {
      let value;
      if (hasOption.bind(this)(attr, 'default') && !this._jsmoo_._has_[attr].lazy) {
        value = executeDefault.bind(this)(attr);
      } else if (hasOption.bind(this)(attr, 'builder') && !this._jsmoo_._has_[attr].lazy) {
        value = executeBuilder.bind(this)(attr);
      }
      this._attributes_[attr] = executeCoerce.bind(this)(attr, value);
    });
    if (typeof this.afterInitialize === 'function') this.afterInitialize();
  }
}

Jsmoo.has = has;
Jsmoo.with = withRoles;

export default Jsmoo;
