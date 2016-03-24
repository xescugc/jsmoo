import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createObjectWith } from './utils';

function makeTypeTest(validType, validExample, invalidType, invalidExample, opts = {}) {
  const messageError = opts.error ? opts.error : `Invalid type for the attribute name, it must be '${validType}' found '${invalidType}'`;
  describe('initializing the object with the attribute', () => {
    it('with valid type', () => {
      const obj = createObjectWith(validExample, 'name', { is: 'rw', isa: validType });
      expect(obj).to.have.property('name').to.equal(validExample);
    });
    it('with invalid type', () => {
      expect(() => {
        createObjectWith(invalidExample, 'name', { is: 'rw', isa: validType }, { forceSet: true });
      }).to.throw(TypeError, messageError);
    });
  });
  describe('setting it after the initialization', () => {
    it('with valid type', () => {
      const obj = createObjectWith(undefined, 'name', { is: 'rw', isa: validType });
      obj.name = validExample;
      expect(obj).to.have.property('name').to.equal(validExample);
    });
    it('with invalid type', () => {
      const obj = createObjectWith(undefined, 'name', { is: 'rw', isa: validType });
      expect(() => {
        obj.name = invalidExample;
      }).to.throw(TypeError, messageError);
    });
  });
  describe('setting it for default', () => {
    it('with valid type', () => {
      const obj = createObjectWith(undefined, 'name', { is: 'rw', isa: validType, default: validExample });
      expect(obj).to.have.property('name').to.equal(validExample);
    });
    it('with invalid type', () => {
      expect(() => {
        createObjectWith(undefined, 'name', { is: 'rw', isa: validType, default: invalidExample });
      }).to.throw(TypeError, messageError);
    });
  });
}

describe('Test HAS with { ISA } option', () => {
  describe('of type ARRAY', () => {
    makeTypeTest('array', [], 'string', '');
    makeTypeTest('Array', [], 'string', '');
  });
  describe('of type STRING', () => {
    makeTypeTest('string', '', 'array', []);
    makeTypeTest('String', '', 'array', []);
  });
  describe('of type NUMBER', () => {
    makeTypeTest('number', 1, 'string', '');
    makeTypeTest('Number', 1, 'string', '');
  });
  describe('of type OBJECT', () => {
    makeTypeTest('object', {}, 'string', '');
    makeTypeTest('Object', {}, 'string', '');
  });
  describe('of type BOOLEAN', () => {
    makeTypeTest('boolean', true, 'string', '');
    makeTypeTest('Boolean', true, 'string', '');
  });
  describe('of type DATE', () => {
    makeTypeTest('Date', new Date, 'string', '');
  });
  describe('with a undefined value', () => {
    makeTypeTest('String', '', 'undefined', undefined);
  });
  describe('with a null value', () => {
    makeTypeTest('String', '', 'null', null);
  });
  describe('of custom type', () => {
    class TestClassType {}
    const testClasType = new TestClassType();
    makeTypeTest('TestClassType', testClasType, 'string', '');
  });
  describe('of type FUNCTION (custom validation)', () => {
    makeTypeTest((value) => {
      if (value % 2 !== 0) throw new TypeError('Custom Error');
    }, 2, undefined, 3, { error: 'Custom Error' });
  });
  describe('of type MAYBE[type]', () => {
    makeTypeTest('Maybe[boolean]', undefined, 'string', '', { error: "Invalid type for the attribute name, it must be 'boolean' found 'string'" });
    makeTypeTest('Maybe[boolean]', true, 'string', '', { error: "Invalid type for the attribute name, it must be 'boolean' found 'string'" });
  });
  it('of type DATE');
  it('of enum');
  it('of Maybe');
});
