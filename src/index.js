class Jsmoo {
  static has(attrs) {
    Object.keys(attrs).forEach( attr => {
      Object.defineProperty(this.prototype, attr, {
        value:      attrs[attr].default,
        writable:   attrs[attr].is === 'ro' ? false : true,
        enumerable: true
      })
    })
  }
  constructor(attrs) {
    if (typeof this.beforeInitialize === 'function') attrs = this.beforeInitialize(attrs);
    Object.keys(attrs).forEach( attr => this[attr] = attrs[attr] )
    if (typeof this.afterInitialize === 'function') this.afterInitialize();
  }
}

export default Jsmoo;
