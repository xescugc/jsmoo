import { expect } from 'chai';
import { describe, it } from 'mocha';
import { before } from '../src';
import { buildObject } from './utils';

describe("Test 'before'", () => {
  it('it must be called before the function', () => {
    const Obj = buildObject();
    const order = [];
    Obj.prototype.save = function (param) {
      order.push(`save-${param}`);
    };
    let beforeParams;
    before(Obj.prototype, 'save', function (param) {
      beforeParams = param;
      order.push('before');
    });

    const obj = new Obj();

    obj.save('test');

    expect(beforeParams).to.equal('test');
    expect(order).to.eql(['before', 'save-test']);
  });
  it('must have the right context', () => {
    const Obj = buildObject();
    Obj.has({
      name: { is: 'rw' },
    });
    const order = [];
    Obj.prototype.save = function (param) {
      order.push(`save-${param}`);
    };
    let beforeParams;
    before(Obj.prototype, 'save', function (param) {
      beforeParams = param;
      order.push(this.name);
    });

    const obj = new Obj({ name: 'Pepito' });

    obj.save('test');

    expect(beforeParams).to.equal('test');
    expect(order).to.eql(['Pepito', 'save-test']);
  });
});
