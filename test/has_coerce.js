import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createObjectWith } from './utils';
import { buildObject } from './utils';

const toNumber = value => {
  if (typeof value === 'string') {
    return value * 1;
  }
  return value;
};
describe('Test HAS with { COERCE } option', () => {
  describe('must coerce the attributes', () => {
    describe('diferent implementations', () => {
      it('with inline function', () => {
        const obj = createObjectWith('1', 'number', { is: 'rw', isa: 'number', coerce(value) { //eslint-disable-line
          return toNumber(value);
        } });
        expect(obj).to.have.property('number').to.equal(1);
      });
      it('with function', () => {
        const obj = createObjectWith('1', 'number', { is: 'rw', isa: 'number', coerce: toNumber });
        expect(obj).to.have.property('number').to.equal(1);
      });
    });
    it('when are setted after initialization', () => {
      const obj = createObjectWith(undefined, 'number', { is: 'rw', isa: 'number', coerce: toNumber });
      obj.number = '1';
      expect(obj).to.have.property('number').to.equal(1);
    });
    it('when the attribute is setted via DEFAULT', () => {
      const obj = createObjectWith(undefined, 'number', { is: 'rw', isa: 'number', default: '1', coerce: toNumber });
      obj.number = '1';
      expect(obj).to.have.property('number').to.equal(1);
    });
    it('when the attribute is setted via BUILDER', () => {
      const Obj = buildObject();
      Obj.prototype.buildNumber = function () { return '1'; };
      Obj.has({ number: { is: 'rw', isa: 'number', builder: 1, coerce: toNumber } });
      const obj = new Obj();
      obj.number = '1';
      expect(obj).to.have.property('number').to.equal(1);
    });
    it('must throw error if the coerce value is not a function', () => {
      expect(() => {
        createObjectWith(undefined, 'number', { is: 'rw', isa: 'number', default: '1', coerce: 'pepe' });
      }).to.throw(TypeError, "Invalid type of Coerce on 'number'");
    });
  });
});
