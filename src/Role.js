import has from './has';
//import does from './does';

class Role {
  constructor() {
    throw new TypeError("Roles can't be initialized");
  }
}

Role.has = has;
//Role.does = does;

export default Role;
