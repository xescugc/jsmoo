import { describe, it } from 'mocha';
import { expect } from 'chai';
import { buildObject } from './utils';

describe('Test HAS with { TRIGGER } option', () => {
  describe('when initializing', () => {
    describe('as a boolean value', () => {
      it('with underscore value', () => {
        const Obj = buildObject();
        let expectedNew;
        let expectedOld;
        Obj.prototype._triggerName = function (newValue, oldValue) {
          expectedOld = oldValue;
          expectedNew = newValue;
        };
        Obj.has({ _name: { is: 'rw', trigger: 1 } });
        const obj = new Obj({ _name: 'name' });
        expect(expectedNew).to.equal('name');
        expect(expectedOld).to.equal(undefined);
      });
      it('without underscore value', () => {
        const Obj = buildObject();
        let expectedNew;
        let expectedOld;
        Obj.prototype.triggerName = function (newValue, oldValue) {
          expectedOld = oldValue;
          expectedNew = newValue;
        };
        Obj.has({ name: { is: 'rw', trigger: 1 } });
        const obj = new Obj({ name: 'name' });
        expect(expectedNew).to.equal('name');
        expect(expectedOld).to.equal(undefined);
      });
      it('changing other attributes', () => {
        const Obj = buildObject();
        let expectedNew;
        let expectedOld;
        Obj.prototype.triggerName = function (newValue, oldValue) {
          expectedOld = oldValue;
          expectedNew = newValue;
          this.n = true;
        };
        Obj.has({
          name: { is: 'rw', trigger: 1 },
          n:    { is: 'rw' },
        });
        const obj = new Obj({ name: 'name' });
        expect(expectedNew).to.equal('name');
        expect(expectedOld).to.equal(undefined);
        expect(obj.n).to.equal(true);
      });
    });
    it('as a function value', () => {
      const Obj = buildObject();
      let expectedNew;
      let expectedOld;
      Obj.has({ name: { is: 'rw', trigger(newValue, oldValue) {
        expectedOld = oldValue;
        expectedNew = newValue;
      } } });
      const obj = new Obj({ name: 'name' });
      expect(expectedNew).to.equal('name');
      expect(expectedOld).to.equal(undefined);
    });
    it('as external function', () => {
      const Obj = buildObject();
      let expectedNew;
      let expectedOld;
      function triggerNameFunction(newValue, oldValue) {
        expectedOld = oldValue;
        expectedNew = newValue;
      }
      Obj.has({ name: { is: 'rw', trigger: triggerNameFunction } });
      const obj = new Obj({ name: 'name' });
      expect(expectedNew).to.equal('name');
      expect(expectedOld).to.equal(undefined);
    });
  });
  it('when setting the attribute manually', () => {
    const Obj = buildObject();
    let expectedNew;
    let expectedOld;
    Obj.has({ name: { is: 'rw', trigger(newValue, oldValue) {
      expectedOld = oldValue;
      expectedNew = newValue;
    } } });
    const obj = new Obj();
    obj.name = 'cesc';
    expect(expectedNew).to.equal('cesc');
    expect(expectedOld).to.equal(undefined);
  });
  it('when changing it 2 times', () => {
    const Obj = buildObject();
    let expectedNew;
    let expectedOld;
    Obj.has({ name: { is: 'rw', trigger(newValue, oldValue) {
      expectedOld = oldValue;
      expectedNew = newValue;
    } } });
    const obj = new Obj({ name: 'name' });
    expect(expectedNew).to.equal('name');
    expect(expectedOld).to.equal(undefined);
    obj.name = 'cesc';
    expect(expectedNew).to.equal('cesc');
    expect(expectedOld).to.equal('name');
  });
  describe('should not trigger', () => {
    it('when the value is initialized with a BUILDER', () => {
      const Obj = buildObject();
      let expectedNew;
      let expectedOld;
      Obj.prototype.buildName = function () { return 'name'; };
      Obj.has({ name: { is: 'rw', builder: 1, trigger(newValue, oldValue) { //eslint-disable-line
        expectedOld = oldValue;
        expectedNew = newValue;
      } } });
      const obj = new Obj();
      expect(obj.name).to.equal('name');
      expect(expectedNew).to.equal(undefined);
      expect(expectedOld).to.equal(undefined);
    });
    it('when the value is initialized with a DEFAULT', () => {
      const Obj = buildObject();
      let expectedNew;
      let expectedOld;
      Obj.has({ name: { is: 'rw', default: 'name', trigger(newValue, oldValue) { //eslint-disable-line
        expectedOld = oldValue;
        expectedNew = newValue;
      } } });
      const obj = new Obj();
      expect(obj.name).to.equal('name');
      expect(expectedNew).to.equal(undefined);
      expect(expectedOld).to.equal(undefined);
    });
  });
});
