let beforeFunctions = [];

function before(object, method, func) {
  if (object.prototype) {
    // FOR STATIC METHODS
    //const oldFunction = object[method];
    //object[method] = (...args) => {
      //oldFunction.bind(object)(...args);
      //beforeFunction.bind(object)(...args);
    //};
  } else {
    beforeFunctions.push({ method, func });
  }
}

function defineBeforeFunctions() {
  beforeFunctions.forEach(override => {
    const oldFunction = this[override.method];
    this[override.method] = (...args) => {
      override.func.bind(this)(...args);
      oldFunction.bind(this)(...args);
    };
  });
  beforeFunctions = [];
}

export default before;
export { defineBeforeFunctions };
