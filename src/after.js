let afterFunctions = [];

function after(object, method, func) {
  if (object.prototype) {
    // FOR STATIC METHODS
    //const oldFunction = object[method];
    //object[method] = (...args) => {
      //oldFunction.bind(object)(...args);
      //afterFunction.bind(object)(...args);
    //};
  } else {
    afterFunctions.push({ method, func });
  }
}

function defineAfterFunctions() {
  afterFunctions.forEach(override => {
    const oldFunction = this[override.method];
    this[override.method] = (...args) => {
      oldFunction.bind(this)(...args);
      override.func.bind(this)(...args);
    };
  });
  afterFunctions = [];
}

export default after;
export { defineAfterFunctions };
