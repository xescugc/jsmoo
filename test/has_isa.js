import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createObjectWith } from './utils';

function makeTypeTest(validType, validExample, invalidType, invalidExample) {
  describe('initializing the object with the attribute', () => {
    it('with valid type', () => {
      const obj = createObjectWith(validExample, 'name', { is: 'rw', isa: validType });
      expect(obj).to.have.property('name').to.equal(validExample);
    });
    it('with invalid type', () => {
      expect(() => {
        createObjectWith(invalidExample, 'name', { is: 'rw', isa: validType });
      }).to.throw(TypeError, `Invalid type for the attribute name, it must be '${validType}' found '${invalidType}'`);
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
      }).to.throw(TypeError, `Invalid type for the attribute name, it must be '${validType}' found '${invalidType}'`);
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
      }).to.throw(TypeError, `Invalid type for the attribute name, it must be '${validType}' found '${invalidType}'`);
    });
  });
}

describe('Test HAS with { ISA } option', () => {
  describe('of type ARRAY', () => {
    makeTypeTest('array', [], 'string', '');
  });
  describe('of type STRING', () => {
    makeTypeTest('string', '', 'array', []);
  });
  describe('of type NUMBER', () => {
    makeTypeTest('number', 1, 'string', '');
  });
  describe('of type OBJECT', () => {
    makeTypeTest('object', {}, 'string', '');
  });
  describe('of type BOOLEAN', () => {
    makeTypeTest('boolean', true, 'string', '');
  });
  it('of type FUNCTION');
});
