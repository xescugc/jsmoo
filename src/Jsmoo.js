import has, { getAttributes, hasOptionsFor, mountGettersSetters, getAllOptions, setAttribute, hasOption, typeValidation, executeCoerce, executeTrigger, requireValidation, executeDefault, executeBuilder } from './has';
import does from './does';
import { defineAfterFunctions } from './after';
import { defineBeforeFunctions } from './before';

function initializeAttribute(attr, value) {
  let newValue = value;
  if (!hasOptionsFor.bind(this)(attr)) throw new TypeError(`The attribute ${attr} is not defined`);
  newValue = executeCoerce.bind(this)(attr, newValue);
  typeValidation.bind(this)(attr, newValue);
  executeTrigger.bind(this)(attr, newValue, undefined);
  setAttribute.bind(this)(attr, newValue);
}


class Jsmoo {
  constructor(attrs = {}) {
    defineAfterFunctions.bind(this)();
    defineBeforeFunctions.bind(this)();
    if (!this._has_) return;
    this._attributes_ = {};
    this.getAttributes = getAttributes.bind(this);
    mountGettersSetters.bind(this)();
    let newAttrs = attrs;
    if (typeof this.beforeInitialize === 'function') newAttrs = this.beforeInitialize(attrs);
    const hasAttr = Object.keys(getAllOptions.bind(this)());
    const initializedAttr = Object.keys(newAttrs).filter(k => hasAttr.indexOf(k) >= 0 ? true : false);
    initializedAttr.forEach(attr => initializeAttribute.bind(this)(attr, newAttrs[attr]));
    requireValidation.bind(this)();
    hasAttr.filter(attr => initializedAttr.indexOf(attr) < 0).forEach(attr => {
      let value;
      if (hasOption.bind(this)(attr, 'default') && !hasOption.bind(this)(attr, 'lazy')) {
        value = executeDefault.bind(this)(attr);
      } else if (hasOption.bind(this)(attr, 'builder') && !hasOption.bind(this)(attr, 'lazy')) {
        value = executeBuilder.bind(this)(attr);
      }
      value = executeCoerce.bind(this)(attr, value);
      setAttribute.bind(this)(attr, value);
    });
    if (typeof this.afterInitialize === 'function') this.afterInitialize();
  }
}

Jsmoo.has = has;
Jsmoo.does = does;

export default Jsmoo;
