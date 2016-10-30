import has from './has';
//import does from './does';

// This is the Role class exported on the global JSMOO, can not be initialized, it can defined attributes with HAS
class Role {
  constructor() {
    throw new TypeError("Roles can't be initialized");
  }
}

Role.has = has;
//Role.does = does;

export default Role;
