import { describe, it } from 'mocha';
import Jsmoo from '../src';
import { expect } from 'chai';

function createObjectWith(value, name, opts) {
  class BasicObject extends Jsmoo {}

  BasicObject.has({
    name: opts,
  });

  if (value) return new BasicObject({ name: value });
  return new BasicObject();
}

function makeTest(testNumber, value, opts) {
  describe(`[${testNumber}] Test with options`, () => {
    if (!opts || !opts.is) {
      it('options is undefined', () => {
        expect(() => {
          createObjectWith(value, 'name', opts);
        }).to.throw(TypeError);
      });
    } else {
      let basicObject;
      if (opts.is !== 'ro') {
        basicObject = createObjectWith(value, 'name', opts);
        it('must have the right value', () => {
          expect(basicObject)
            .to.have.property('name')
            .to.equal(value);
        });
      }
      const newName = `${value}a`;
      if (opts.is === 'rw') {
        it(`#is = ${opts.is}`, () => {
          basicObject = createObjectWith(value, 'name', opts);
          basicObject.name = newName;
          expect(basicObject)
            .to.have.property('name')
            .to.equal(newName);
        });
      } else if (opts.is === 'ro') {
        describe(`#is = ${opts.is}`, () => {
          it('must fail if triyng to assign a new value', () => {
            expect(() => {
              createObjectWith(value, 'name', opts);
            }).to.throw(TypeError);
          });
        });
      } else {
        it('#is = default[rw]', () => {
          basicObject = createObjectWith(value, 'name', opts);
          basicObject.name = newName;
          expect(basicObject)
            .to.have.property('name')
            .to.equal(newName);
        });
      }
      it('must have the default value', () => {
        let defaultValue;
        if (opts.default) {
          defaultValue = typeof opts.default === 'function' ?
            value : opts.default;
        }
        basicObject = createObjectWith(undefined, 'name', opts);
        expect(basicObject)
          .to.have.property('name')
          .to.equal(defaultValue);
      });
    }
  });
}

makeTest(1, 'test');
makeTest(2, 'test', { asdf: 'not valid' });
makeTest(3, 'test', { is: 'rw' });
makeTest(4, 'test', { is: 'ro' });
makeTest(5, 'test', { is: 'ro', default: 'test' });
makeTest(6, 'test', { is: 'ro', default() {return 'test';} });
