import { describe, it } from 'mocha';
import { expect } from 'chai';
import { buildObject, buildRoleWith } from './utils';
import Jsmoo from '../src';

describe("Role composition with 'DOES'", () => {
  it("must have the function 'DOES'", () => {
    expect(Jsmoo).to.have.property('does');
  });
  it("normal objects can't be composed", () => {
    const Obj = buildObject();
    const NoRole = buildObject();
    expect(() => {
      Obj.does(NoRole);
    }).to.throw(TypeError, 'Only Roles can be composed');
  });
  it('only Roles can be composed', () => {
    const Obj = buildObject();
    const Role = buildRoleWith();
    expect(() => {
      Obj.does(Role);
    }).not.to.throw(TypeError, 'Only Roles can be composed');
  });
  describe('must merge the ROLE to the Class', () => {
    describe('instance function', () => {
      it('is not defined on the Class it must be copyed', () => {
        const Obj = buildObject();
        const Role = buildRoleWith();
        Role.prototype.testFunction = () => { return 'from role'; };
        Obj.does(Role);
        const newObj = new Obj();
        expect(newObj).to.respondTo('testFunction');
        expect(newObj.testFunction()).to.equal('from role');
      });
      it('is defined on the Class it must not be copyed', () => {
        const Obj = buildObject();
        const Role = buildRoleWith();
        Role.prototype.testFunction = () => { return 'from role'; };
        Obj.prototype.testFunction = () => { return 'from object'; };
        Obj.does(Role);
        const newObj = new Obj();
        expect(newObj).to.respondTo('testFunction');
        expect(newObj.testFunction()).to.equal('from object');
      });
    });
    describe('class function', () => {
      it('is not defined on the Class it must be copyed', () => {
        const Obj = buildObject();
        const Role = buildRoleWith();
        Role.testFunction = () => { return 'from role'; };
        Obj.does(Role);
        expect(Obj).itself.to.respondTo('testFunction');
        expect(Obj.testFunction()).to.equal('from role');
      });
      it('is defined on the Class it must not be copyed', () => {
        const Obj = buildObject();
        const Role = buildRoleWith();
        Role.testFunction = () => { return 'from role'; };
        Obj.testFunction = () => { return 'from object'; };
        Obj.does(Role);
        expect(Obj).itself.to.respondTo('testFunction');
        expect(Obj.testFunction()).to.equal('from object');
      });
    });
    describe('{ HAS } attributes', () => {
      it('must have them on the class', () => {
        const Obj = buildObject();
        const Role = buildRoleWith();
        Role.has({ name: { is: 'rw', default: 'role' } });
        Obj.does(Role);
        const obj = new Obj();
        expect(obj).to.have.property('name').to.equal('role');
      });
      it('must not have them on the class if they are defined on it', () => {
        const Obj = buildObject();
        const Role = buildRoleWith();
        Obj.has({ name: { is: 'rw', default: 'object' } });
        Role.has({ name: { is: 'rw', default: 'role' } });
        Obj.does(Role);
        const obj = new Obj();
        expect(obj).to.have.property('name').to.equal('object');
      });
    });
  });
});
