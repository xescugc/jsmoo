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

function makeTest(value, opts) {
  describe('Test with options', () => {
    if (!opts || !opts.is) {
      it('options is undefined', () => {
        expect(() => {
          createObjectWith(value, 'name', opts);
        }).to.throw(TypeError);
      });
    } else {
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
        } else if (opts.is === 'ro') {
          describe(`#is = ${opts.is}`, () => {
            it('must fail if triyng to assign a new value', () => {
              expect(() => {
                createObjectWith(value, 'name', opts);
              }).to.throw(TypeError);
            });
            it('must have the default value', () => {
              basicObject = createObjectWith(undefined, 'name', opts);
              expect(basicObject)
                .to.have.property('name')
                .to.equal(opts.default);
            });
          });
        } else {
          it('#is = default[rw]', () => {
            basicObject.name = newName;
            expect(basicObject)
              .to.have.property('name')
              .to.equal(newName);
          });
        }
      }
    }
  });
}

makeTest('test');
makeTest('test', { asdf: 'not valid' });
makeTest('test', { is: 'rw' });
makeTest('test', { is: 'ro' });
makeTest('test', { is: 'ro', default: 'test' });
