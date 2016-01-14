import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createObjectWith } from './utils';

describe('Test HAS with { IS } action', () => {
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
