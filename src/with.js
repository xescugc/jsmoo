function mergeAttributes({ base, role, isJsmoo }) {
  Object.getOwnPropertyNames(role).concat(Object.getOwnPropertySymbols(role)).forEach((prop) => {
    if (!prop.match(/^(?:_jsmoo_|constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
      Object.defineProperty(base, prop, Object.getOwnPropertyDescriptor(role, prop));
    }
  });
  if (isJsmoo && role.prototype._jsmoo_) {
    Object.keys(role.prototype._jsmoo_._has_).forEach(attr => {
      base.has({ [attr]: role.prototype._jsmoo_._has_[attr] });
    });
  }
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
