import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createObjectWith } from './utils';

describe("Test 'has' with { REQUIRED } option", () => {
  describe('with a true value', () => {
    it('must be valid', () => {
      let obj;
      expect(() => {
        obj = createObjectWith('test', 'name', { is: 'rw', required: true });
      }).not.to.throw(TypeError, "The attribute 'name' is required");
      expect(obj).to.have.property('name').to.equal('test');
    });
    it('must not be valid', () => {
      expect(() => {
        createObjectWith(undefined, 'name', { is: 'rw', required: true });
      }).to.throw(TypeError, "The attribute 'name' is required");
    });
  });
  describe('with a false value', () => {
    it('must be valid', () => {
      const obj = createObjectWith('test', 'name', { is: 'rw', required: false });
      expect(obj).to.have.property('name').to.equal('test');
    });
    it('must also be valid', () => {
      let obj;
      expect(() => {
        obj = createObjectWith('test', 'name', { is: 'rw', required: false });
      }).not.to.throw(TypeError, "The attribute 'name' is required");
      expect(obj).to.have.property('name').to.equal('test');
    });
  });
});
