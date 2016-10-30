// Merges all the attributes from the role to the base (which can be a Role or a Jsmoo class)
// it does not coppy functions defined on the Role and in the Base in favor of the Base and also the internal functions
function mergeAttributes({ base, role, isJsmoo }) {
  //TODO: See if some one has another work arround for Symbols
  //Object.getOwnPropertyNames(role).concat(Object.getOwnPropertySymbols(role)).forEach((prop) => {
  Object.getOwnPropertyNames(role).forEach((prop) => {
    if (!prop.match(/^(?:_has_|_attributes_|constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/) && !base[prop]) {
      Object.defineProperty(base, prop, Object.getOwnPropertyDescriptor(role, prop));
    }
  });
  if (isJsmoo && role.prototype._has_) {
    Object.keys(role.prototype._has_).forEach(attr => {
      base.has({ [attr]: role.prototype._has_[attr] });
    });
  }
}

// Validates that the Role is infact a Role and if the THIS object is a Jsmoo class
function composeRole(role) {
  if (Object.getPrototypeOf(role).name !== 'Role') throw new TypeError('Only Roles can be composed');

  const isJsmoo = Object.getPrototypeOf(this).name === 'Jsmoo';
  [{ base: this, role, isJsmoo }, { base: this.prototype, role: role.prototype }].forEach(proto => mergeAttributes(proto));
}

// The function exported to Jsmoo.js habilitate the Role composition
function does(...roles) {
  roles.forEach(r => composeRole.bind(this, r)());
}

export default does;
