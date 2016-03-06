function after(object, method, afterFunction) {
  const oldFunction = object[method];
  object[method] = (...args) => {
    oldFunction.bind(object)(...args);
    afterFunction.bind(object)(...args);
  };
}

export default after;
