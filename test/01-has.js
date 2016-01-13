import { describe, it } from 'mocha';
import Jsmoo from '../src';
import { expect } from 'chai';

function createObjectWith(value, name, attrOpts, opts = {}) {
  class BasicObject extends Jsmoo {}

  if (opts.multi) {
    BasicObject.has({
      test: { is: 'rw', default: 'default' },
    });
  }

  BasicObject.has({
    name: attrOpts,
  });

  if (value) return new BasicObject({ name: value });
  return new BasicObject();
}

describe("Test 'has'", () => {
  describe('with options', () => {
    it('beeing undefined', () => {
      expect(() => createObjectWith('test', 'name', undefined)).to.throw(TypeError);
    });
    it("without 'is' key", () => {
      expect(() => createObjectWith('test', 'name', {})).to.throw(TypeError);
    });
  });
  describe('with { IS } action', () => {
    describe('beeing RW', () => {
      it('must have the right value afetr initialize', () => {
        const obj = createObjectWith('test', 'name', { is: 'rw' });
        expect(obj).to.have.property('name').to.equal('test');
      });
      it('can be changed', () => {
        const obj = createObjectWith('test', 'name', { is: 'rw' });
        expect(() => obj.name = 'new name').to.not.throw(TypeError, 'Can not set to a RO attribute name');
        expect(obj.name).to.equal('new name');
      });
    });
    describe('beeing RO', () => {
      it("cant't be setted with another value", () => {
        const obj = createObjectWith('test', 'name', { is: 'ro' });
        expect(() => obj.name = 'new name').to.throw(TypeError, 'Can not set to a RO attribute name');
      });
      it('can be initialized with a value', () => {
        const obj = createObjectWith('test', 'name', { is: 'ro' });
        expect(obj).to.have.property('name').to.equal('test');
      });
    });
  });
  describe('with { DEFAULT } option', () => {
    describe('without initializing the object', () => {
      it('beeing a simple value', () => {
        const obj = createObjectWith(undefined, 'name', { is: 'rw', default: 'test' });
        expect(obj).to.have.property('name').to.equal('test');
      });
      describe('beeing a function', () => {
        it('returning a value', () => {
          const obj = createObjectWith(undefined, 'name', { is: 'rw', default() {return 'test';} });
          expect(obj).to.have.property('name').to.equal('test');
        });
        it('returning a value from this', () => {
          const obj = createObjectWith(
            undefined, 'name',
            { is: 'rw', default() {return this.test;} }, { multi: true }
          );
          expect(obj).to.have.property('name').to.equal('default');
        });
      });
    });
    describe('initializing the object', () => {
      it('beeing a simple value', () => {
        const obj = createObjectWith('no test', 'name', { is: 'rw', default: 'test' });
        expect(obj).to.have.property('name').to.equal('no test');
      });
      describe('beeing a function', () => {
        it('returning a value', () => {
          const obj = createObjectWith('no test', 'name', { is: 'rw', default() {return 'test';} });
          expect(obj).to.have.property('name').to.equal('no test');
        });
        it('returning a value from this', () => {
          const obj = createObjectWith(
            'no test', 'name',
            { is: 'rw', default() {return this.test;} }, { multi: true }
          );
          expect(obj).to.have.property('name').to.equal('no test');
        });
      });
    });
  });
});

////makeTest(1, 'test');
////makeTest(2, 'test', { asdf: 'not valid' });
////makeTest(3, 'test', { is: 'rw' });
//makeTest(4, 'test', { is: 'ro' });
//makeTest(5, 'test', { is: 'rw', default: 'test' });
//makeTest(6, 'test', { is: 'rw', default() { return this.test; } }, { multi: true });
//makeTest(7, 'test', { is: 'ro', default: 'test' });
//makeTest(8, 'test', { is: 'ro', default() { return 'test'; } });
//makeTest(9, 'test', { is: 'ro', default() { return this.test; } }, { multi: true });
//makeTest(10, 'test', { is: 'rw', isa: 'string' });
