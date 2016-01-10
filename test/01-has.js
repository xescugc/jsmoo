import { describe, it } from 'mocha';
import Jsmoo from '../src';
import { expect } from 'chai';

function createObjectWith(value, name, opts) {
  class BasicObject extends Jsmoo {}

  BasicObject.has({
    name: opts,
  });

  return new BasicObject({ name: value });
}

function makeTest(value, opts) {
  describe('Test with options', () => {
    let basicObject;
    if (!(opts.is && opts.is === 'ro')) {
      basicObject = createObjectWith(value, 'name', opts);
      it('must have the right value', () => {
        expect(basicObject)
        .to.have.property('name')
        .to.equal(value);
      });
    }
    if (opts.is) {
      const newName = `${value}a`;
      if (opts.is === 'rw') {
        it(`#is = ${opts.is}`, () => {
          basicObject.name = newName;
          expect(basicObject)
            .to.have.property('name')
            .to.equal(newName);
        });
      }
      if (opts.is === 'ro') {
        it(`#is = ${opts.is}`, () => {
          expect(() => {
            createObjectWith(value, 'name', opts);
          }).to.throw(TypeError);
        });
      }
    }
  });
}

makeTest('test', { is: 'rw' });
makeTest('test', { is: 'ro' });
