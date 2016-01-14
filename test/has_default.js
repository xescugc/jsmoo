import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createObjectWith } from './utils';

describe('Test HAS with { DEFAULT } option', () => {
  describe('without initializing the object', () => {
    it('beeing a simple value', () => {
      const obj = createObjectWith(undefined, 'name', { is: 'rw', default: 'test' });
      expect(obj).to.have.property('name').to.equal('test');
    });
    describe('beeing a function', () => {
      it('returning a value', () => {
        const obj = createObjectWith(undefined, 'name', { is: 'rw', default() {return 'test';} });
        expect(obj).to.have.property('name').to.equal('test');
      });
      it('returning a value from this', () => {
        const obj = createObjectWith(
          undefined, 'name',
          { is: 'rw', default() {return this.test;} }, { multi: true }
        );
        expect(obj).to.have.property('name').to.equal('default');
      });
    });
  });
  describe('initializing the object', () => {
    it('beeing a simple value', () => {
      const obj = createObjectWith('no test', 'name', { is: 'rw', default: 'test' });
      expect(obj).to.have.property('name').to.equal('no test');
    });
    describe('beeing a function', () => {
      it('returning a value', () => {
        const obj = createObjectWith('no test', 'name', { is: 'rw', default() {return 'test';} });
        expect(obj).to.have.property('name').to.equal('no test');
      });
      it('returning a value from this', () => {
        const obj = createObjectWith(
          'no test', 'name',
          { is: 'rw', default() {return this.test;} }, { multi: true }
        );
        expect(obj).to.have.property('name').to.equal('no test');
      });
    });
  });
});
