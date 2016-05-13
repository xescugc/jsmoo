import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createObjectWith } from './utils';

describe('Test HAS with { LAZY } action', () => {
  describe('when the attribute is setted via initialization', () => {
    it('must have the initialization value on the _jsmoo_', () => {
      const obj = createObjectWith('test', 'name', { is: 'rw', lazy: 1 });
      expect(obj._jsmoo_._attributes_).to.have.property('name').to.equal('test');
    });
    it('must not change value on the _jsmoo_ when access', () => {
      const obj = createObjectWith('test', 'name', { is: 'rw', lazy: 1 });
      expect(obj.name).to.equal('test');
      expect(obj._jsmoo_._attributes_).to.have.property('name').to.equal('test');
    });
  });
  describe('when the attribute is setted via { DEFAULT }', () => {
    it('must not have any value on the _jsmoo_', () => {
      const obj = createObjectWith(undefined, 'name', { is: 'rw', lazy: 1, default: '2' });
      expect(obj._jsmoo_._attributes_.name).to.equal(undefined);
    });
    it('must change value on the _jsmoo_ when access', () => {
      const obj = createObjectWith(undefined, 'name', { is: 'rw', lazy: 1, default: '2' });
      expect(obj).to.have.property('name').to.equal('2');
      expect(obj._jsmoo_._attributes_).to.have.property('name').to.equal('2');
    });
  });
  describe('when the attribute has a { BUILDER }', () => {
    it('must not have any value on the _jsmoo_');
    it('must change value on the _jsmoo_ when access');
  });
});
