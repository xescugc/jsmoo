import has from './has';
//import withRoles from './with';

class Role {
  constructor() {
    throw new TypeError("Roles can't be initialized");
  }
}

Role.has = has;
//Role.with = withRoles;

export default Role;
