function after(object, method, func) {
  if (object.prototype) {
    //TODO: FOR STATIC METHODS
    //const oldFunction = object[method];
    //object[method] = (...args) => {
      //oldFunction.bind(object)(...args);
      //afterFunction.bind(object)(...args);
    //};
  } else {
    if (!object._afterFunctions_) object._afterFunctions_ = [];
    object._afterFunctions_.push({ method, func });
  }
}

function defineAfterFunctions() {
  if (!this._afterFunctions_) return;

  this._afterFunctions_.forEach(override => {
    const oldFunction = this[override.method];
    this[override.method] = (...args) => {
      oldFunction.bind(this)(...args);
      return override.func.bind(this)(...args);
    };
  });
}

export default after;
export { defineAfterFunctions };
