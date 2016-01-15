import { describe, it } from 'mocha';
import Jsmoo from '../src';
import { expect } from 'chai';


function createObject(type, options) {
  class BasicObject extends Jsmoo {}
  switch (type) {
    case 'normal':
      break;
    case 'has':
      BasicObject.has({ name: { is: 'rw' } });
      break;
    case 'before':
      BasicObject.has({ name: { is: 'rw' } });
      BasicObject.prototype.beforeInitialize = function (attrs) {
        const newAttrs = {};
        if (attrs.name === 'test') {
          newAttrs.name = 'done';
          return newAttrs;
        }
        return attrs;
      };
      break;
    case 'after':
      BasicObject.has({ name: { is: 'rw' } });
      BasicObject.prototype.afterInitialize = function () {
        if (this.name === 'test') this.name = 'done';
      };
      break;
    default:
      throw new Error('No option provided');
  }
  return new BasicObject(options);
}

describe('Initializing a new object', () => {
  describe('just extending', () => {
    it('without values', () => {
      const basicObject = createObject('normal');
      expect(basicObject)
        .to.eql({});
    });
    describe('with values', () => {
      it("without any 'has'");
      it("with a 'has'", () => {
        const basicObject = createObject('has', { name: 'test' });
        expect(basicObject)
          .to.have.property('name')
          .to.equal('test');
      });
    });
  });
  describe('Overriding initializer hooks', () => {
    it('#beforeInitialize', () => {
      const basicObject = createObject('before', { name: 'test' });
      expect(basicObject)
        .to.have.property('name')
        .to.equal('done');
      const basicObject2 = createObject('before', { name: 'no test' });
      expect(basicObject2)
        .to.have.property('name')
        .to.equal('no test');
    });
    it('#afterInitialize', () => {
      const basicObject = createObject('after', { name: 'test' });
      expect(basicObject)
        .to.have.property('name')
        .to.equal('done');
      const basicObject2 = createObject('after', { name: 'no test' });
      expect(basicObject2)
        .to.have.property('name')
        .to.equal('no test');
    });
  });
});