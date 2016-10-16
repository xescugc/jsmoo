import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createObjectWith, buildObject } from './utils';

describe('Test HAS with { LAZY } action', () => {
  describe('when the attribute is setted via initialization', () => {
    it('must have the initialization value on the _jsmoo_', () => {
      const obj = createObjectWith('test', 'name', { is: 'rw', lazy: 1 });
      expect(obj.getAttributes()).to.have.property('name').to.equal('test');
    });
    it('must not change value on the _jsmoo_ when access', () => {
      const obj = createObjectWith('test', 'name', { is: 'rw', lazy: 1 });
      expect(obj.name).to.equal('test');
      expect(obj.getAttributes()).to.have.property('name').to.equal('test');
    });
  });
  describe('when the attribute is setted via { DEFAULT }', () => {
    it('must not have any value on the _jsmoo_', () => {
      const obj = createObjectWith(undefined, 'name', { is: 'rw', lazy: 1, default: '2' });
      expect(obj.getAttributes().name).to.equal(undefined);
    });
    it('must change value on the _jsmoo_ when access', () => {
      const obj = createObjectWith(undefined, 'name', { is: 'rw', lazy: 1, default: '2' });
      expect(obj).to.have.property('name').to.equal('2');
      expect(obj.getAttributes()).to.have.property('name').to.equal('2');
    });
  });
  describe('when the attribute has a { BUILDER }', () => {
    it('must not have any value on the _jsmoo_', () => {
      const Obj = buildObject();
      Obj.has({ name: { is: 'rw', lazy: true, builder: true } });
      Obj.prototype.buildName = function () {
        return '2';
      };
      const obj = new Obj();
      expect(obj.getAttributes().name).to.equal(undefined);
    });
    it('must change value on the _jsmoo_ when access', () => {
      const Obj = buildObject();
      Obj.has({ name: { is: 'rw', lazy: true, builder: true } });
      Obj.prototype.buildName = function () {
        return '2';
      };
      const obj = new Obj();
      expect(obj).to.have.property('name').to.equal('2');
      expect(obj.getAttributes()).to.have.property('name').to.equal('2');
    });
  });
});
