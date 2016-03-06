function before(object, method, beforeFunction) {
  const oldFunction = object[method];
  object[method] = (...args) => {
    beforeFunction.bind(object)(...args);
    oldFunction.bind(object)(...args);
  };
}

export default before;
