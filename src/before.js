function before(object, method, func) {
  if (object.prototype) {
    //TODO: FOR STATIC METHODS
    //const oldFunction = object[method];
    //object[method] = (...args) => {
      //oldFunction.bind(object)(...args);
      //beforeFunction.bind(object)(...args);
    //};
  } else {
    if (!object._beforeFunctions_) object._beforeFunctions_ = [];
    object._beforeFunctions_.push({ method, func });
  }
}

function defineBeforeFunctions() {
  if (!this._beforeFunctions_) return;

  this._beforeFunctions_.forEach(override => {
    const oldFunction = this[override.method];
    this[override.method] = (...args) => {
      override.func.bind(this)(...args);
      oldFunction.bind(this)(...args);
    };
  });
}

export default before;
export { defineBeforeFunctions };
