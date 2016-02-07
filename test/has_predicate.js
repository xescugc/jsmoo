import Jsmoo from '../src';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createObjectWith } from './utils';

describe('Test HAS with { PREDICATE } option', () => {
  describe('if it does not start with _', () => {
    it('must be true if it is defined', () => {
      const obj = createObjectWith('value', 'name', { is: 'rw', predicate: true });
      expect(obj).to.have.property('hasName').to.equal(true);
    });
    it('must be false if it is not defined', () => {
      const obj = createObjectWith(undefined, 'name', { is: 'rw', predicate: true });
      expect(obj).to.have.property('hasName').to.equal(false);
    });
  });
  describe('if it starts with _', () => {
    it('must be true if it is defined', () => {
      const obj = createObjectWith('value', '_name', { is: 'rw', predicate: true });
      expect(obj).to.have.property('_hasName').to.equal(true);
    });
    it('must be false if it is not defined', () => {
      const obj = createObjectWith(undefined, '_name', { is: 'rw', predicate: true });
      expect(obj).to.have.property('_hasName').to.equal(false);
    });
  });
  describe('must change the value if it changes', () => {
    it('to undefined', () => {
      const obj = createObjectWith('value', 'name', { is: 'rw', predicate: true });
      expect(obj).to.have.property('hasName').to.equal(true);
      obj.name = undefined;
      expect(obj).to.have.property('hasName').to.equal(false);
    });
    it('to null', () => {
      const obj = createObjectWith('value', 'name', { is: 'rw', predicate: true });
      expect(obj).to.have.property('hasName').to.equal(true);
      obj.name = null;
      expect(obj).to.have.property('hasName').to.equal(false);
    });
  });
});
