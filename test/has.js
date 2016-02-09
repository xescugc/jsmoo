import { describe, it } from 'mocha';
import { expect } from 'chai';
import { buildRoleWith, createObjectWith, buildObject } from './utils';
import Jsmoo from '../src';

describe("Test 'has'", () => {
  it('must have fuction has', () => {
    expect(Jsmoo).to.have.property('has');
  });
  describe('with options', () => {
    it('beeing undefined', () => {
      expect(() => createObjectWith('test', 'name', undefined)).to.throw(TypeError);
    });
    it("without 'is' key", () => {
      expect(() => createObjectWith('test', 'name', {})).to.throw(TypeError);
    });
  });
  it('must ignore no defined attributes', () => {
    const BasicObject = buildObject();
    BasicObject.has({
      name: { is: 'rw', isa: 'string' },
    });
    const basicObj = new BasicObject({ name: 'pepe', surname: 'pepa' });
    expect(basicObj).not.to.have.property('surname');
    expect(basicObj).to.have.property('name').to.equal('pepe');
  });
  describe('with overriding', () => {
    describe('Role override Jsmoo', () => {
      it('must have them on the class if the attribute has a "+" on the role', () => {
        const Obj = buildObject();
        const Role = buildRoleWith();
        Obj.has({ name: { is: 'rw', default: 'object' } });
        Role.has({ '+name': { default: 'role' } });
        Obj.with(Role);
        const obj = new Obj();
        expect(obj).to.have.property('name').to.equal('role');
      });
      it('must throw error if the override is not on the main class', () => {
        const Obj = buildObject();
        const Role = buildRoleWith();
        Obj.has({ name: { is: 'rw', default: 'object' } });
        Role.has({ '+pepe': { default: 'role' } });
        expect(() => {
          Obj.with(Role);
        }).to.throw(TypeError, "Can't override an unexistent attribute 'pepe'");
      });
    });
    describe('Jsmoo oberriding Role', () => {
      it('must be overrided by the main class', () => {
        const Obj = buildObject();
        const Role = buildRoleWith();
        Role.has({ name: { is: 'rw', default: 'role' } });
        Obj.with(Role);
        Obj.has({ '+name': { default: 'object' } });
        const obj = new Obj();
        expect(obj).to.have.property('name').to.equal('object');
      });
      it('must throw error if the override is not on the main class', () => {
        const Obj = buildObject();
        const Role = buildRoleWith();
        Role.has({ pepe: { is: 'rw', default: 'role' } });
        Obj.with(Role);
        expect(() => {
          Obj.has({ '+name': { default: 'object' } });
        }).to.throw(TypeError, "Can't override an unexistent attribute 'name'");
      });
    });
  });
  it('with { COERCE } option');
  it('with { TRIGGER } option');
  it('with { READER } option');
  it('with { WRITTER } option');
});
