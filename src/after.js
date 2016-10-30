// The after function importe to the global import of JSMOO
//
// object = The Ojbet on which the after funcition will search for the method to attach
// method = A string with the name of the method to attach
// func   = The function which will be called after the method
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

// Function exported to the Jsmoo.js to attach the after functions to the new object
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
