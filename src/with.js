function mergeAttributes({ base, role, isJsmoo }) {
  Object.getOwnPropertyNames(role).concat(Object.getOwnPropertySymbols(role)).forEach((prop) => {
    if (!prop.match(/^(?:_jsmoo_|constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
      Object.defineProperty(base, prop, Object.getOwnPropertyDescriptor(role, prop));
    }
    if (isJsmoo && role.prototype._jsmoo_) {
      Object.keys(role.prototype._jsmoo_._has_).forEach(attr => {
        let roleAttr = attr;
        const isOverride = roleAttr.match(/^\+/);
        if (isOverride) roleAttr = attr.replace(/^\+/, '');
        //TODO: Refactor this to use the same on has
        if (!base.prototype._jsmoo_) base.prototype._jsmoo_ = { _has_: {} };
        if (isOverride && !base.prototype._jsmoo_._has_[roleAttr]) throw new TypeError(`Can't override an unexistent attribute '${roleAttr}'`);
        if (isOverride && base.prototype._jsmoo_._has_[roleAttr]) {
          const beforeHas = base.prototype._jsmoo_._has_[roleAttr];
          const newHas = Object.assign({}, beforeHas, role.prototype._jsmoo_._has_[attr]);
          base.has({ [roleAttr]: newHas });
        }
        if (!base.prototype._jsmoo_._has_[roleAttr]) {
          base.has({ [roleAttr]: role.prototype._jsmoo_._has_[attr] });
        }
      });
    }
  });
}

function composeRole(role) {
  if (Object.getPrototypeOf(role).name !== 'Role') throw new TypeError('Only Roles can be composed');

  const isJsmoo = Object.getPrototypeOf(this).name === 'Jsmoo';
  [{ base: this, role, isJsmoo }, { base: this.prototype, role: role.prototype }].forEach(proto => mergeAttributes(proto));
}

function withRoles(...roles) {
  roles.forEach(r => composeRole.bind(this, r)());
}

export default withRoles;
