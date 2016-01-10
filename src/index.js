class Jsmoo {
  static has(attrs) {
    Object.keys(attrs).forEach(attr => {
      const attrOptions = attrs[attr];
      if (!attrOptions || !attrOptions.is) throw new TypeError("'is' key is required");
      Object.defineProperty(this.prototype, attr, {
        value:      attrOptions.default,
        writable:   attrOptions.is === 'ro' ? false : true,
        enumerable: true,
      });
    });
  }
  constructor(attrs) {
    if (attrs === null || attrs === undefined) return;
    let newAttrs;
    if (typeof this.beforeInitialize === 'function') newAttrs = this.beforeInitialize(attrs);
    if (newAttrs) {
      Object.keys(newAttrs).forEach(attr => this[attr] = newAttrs[attr]);
    } else {
      Object.keys(attrs).forEach(attr => this[attr] = attrs[attr]);
    }
    if (typeof this.afterInitialize === 'function') this.afterInitialize();
  }
}

export default Jsmoo;
