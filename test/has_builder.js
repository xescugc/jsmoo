import { describe, it } from 'mocha';
import { expect } from 'chai';
import { buildObject } from './utils';

describe('Test HAS with { BUILDER } option', () => {
  describe('without initializing the object', () => {
    describe('with boolean value', () => {
      it('without _', () => {
        const Obj = buildObject();
        Obj.has({ name: { is: 'rw', builder: true } });
        Obj.prototype.buildName = function () {
          return 'build value';
        };
        const obj = new Obj();
        expect(obj).to.have.property('name').to.equal('build value');
      });
      it('with _', () => {
        const Obj = buildObject();
        Obj.has({ _name: { is: 'rw', builder: true } });
        Obj.prototype._buildName = function () {
          return 'build value';
        };
        const obj = new Obj();
        expect(obj).to.have.property('_name').to.equal('build value');
      });
    });
    it('with string value', () => {
      const Obj = buildObject();
      Obj.has({ name: { is: 'rw', builder: 'builderNameFunction' } });
      Obj.prototype.builderNameFunction = function () {
        return 'build value';
      };
      const obj = new Obj();
      expect(obj).to.have.property('name').to.equal('build value');
    });
  });
  describe('initializing the object', () => {
    describe('with boolean value', () => {
      it('without _', () => {
        const Obj = buildObject();
        Obj.has({ name: { is: 'rw', builder: true } });
        Obj.prototype.buildName = function () {
          return 'build value';
        };
        const obj = new Obj({ name: 'initialized value' });
        expect(obj).to.have.property('name').to.equal('initialized value');
      });
      it('with _', () => {
        const Obj = buildObject();
        Obj.has({ _name: { is: 'rw', builder: true } });
        Obj.prototype._buildName = function () {
          return 'build value';
        };
        const obj = new Obj({ _name: 'initialized value' });
        expect(obj).to.have.property('_name').to.equal('initialized value');
      });
    });
    it('with string value', () => {
      const Obj = buildObject();
      Obj.has({ name: { is: 'rw', builder: 'builderNameFunction' } });
      Obj.prototype.builderNameFunction = function () {
        return 'build value';
      };
      const obj = new Obj({ name: 'initialized value' });
      expect(obj).to.have.property('name').to.equal('initialized value');
    });
  });
  describe('if the function is not present', () => {
    it('with string', () => {
      const Obj = buildObject();
      Obj.has({ name: { is: 'rw', builder: 'builderNameFunction' } });
      expect(() => {
        new Obj();
      }).to.throw(TypeError, "The builder function 'builderNameFunction' is not defined");
    });
    it('with boolean', () => {
      const Obj = buildObject();
      Obj.has({ name: { is: 'rw', builder: 1 } });
      expect(() => {
        new Obj();
      }).to.throw(TypeError, "The builder function 'buildName' is not defined");
    });
  });
});
it('test for builder and default present');
it('test builder with function');
