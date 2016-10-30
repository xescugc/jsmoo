// The before function importe to the global import of JSMOO
//
// object = The Ojbet on which the before funcition will search for the method to attach
// method = A string with the name of the method to attach
// func   = The function which will be called before the method
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

// Function exported to the Jsmoo.js to attach the before functions to the new object
function defineBeforeFunctions() {
  if (!this._beforeFunctions_) return;

  this._beforeFunctions_.forEach(override => {
    const oldFunction = this[override.method];
    this[override.method] = (...args) => {
      override.func.bind(this)(...args);
      return oldFunction.bind(this)(...args);
    };
  });
}

export default before;
export { defineBeforeFunctions };
