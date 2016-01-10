class Jsmoo {
  static has(attrs) {
    Object.keys(attrs).forEach(attr => {
      Object.defineProperty(this.prototype, attr, {
        value:      attrs[attr].default,
        writable:   attrs[attr].is === 'ro' ? false : true,
        enumerable: true,
      });
    });
  }
  constructor(attrs) {
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
