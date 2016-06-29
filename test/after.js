import { expect } from 'chai';
import { describe, it } from 'mocha';
import { after } from '../src';
import { buildObject } from './utils';

describe("Test 'after'", () => {
  it('it must be called after the function', () => {
    const Obj = buildObject();
    const order = [];
    Obj.prototype.save = function (name) {
      order.push(`save-${name}`);
    };
    let afterParams;
    after(Obj.prototype, 'save', function (param) {
      afterParams = param;
      order.push('after');
    });

    const obj = new Obj();

    obj.save('test');

    expect(afterParams).to.equal('test');
    expect(order).to.eql(['save-test', 'after']);
  });
  it('must have the right context', () => {
    const Obj = buildObject();
    Obj.has({
      name: { is: 'rw' },
    });
    const order = [];
    Obj.prototype.save = function (name) {
      order.push(`save-${name}`);
    };
    let afterParams;
    after(Obj.prototype, 'save', function (param) {
      afterParams = param;
      order.push(this.name);
    });

    const obj = new Obj({ name: 'Pepito' });

    obj.save('test');

    expect(afterParams).to.equal('test');
    expect(order).to.eql(['save-test', 'Pepito']);
  });
  it('must continue to have the callbacks after the second initialization', () => {
    const Obj = buildObject();
    Obj.has({
      name: { is: 'rw' },
    });
    let order = [];
    Obj.prototype.save = function (name) {
      order.push(`save-${name}`);
    };
    let afterParams;
    after(Obj.prototype, 'save', function (param) {
      afterParams = param;
      order.push(this.name);
    });

    const obj = new Obj({ name: 'Pepito' });

    obj.save('test');

    expect(afterParams).to.equal('test');
    expect(order).to.eql(['save-test', 'Pepito']);

    order = [];

    const obj2 = new Obj({ name: 'Pepito2' });

    obj2.save('test');

    expect(afterParams).to.equal('test');
    expect(order).to.eql(['save-test', 'Pepito2']);
  });
  it('if the method does not exists');
});
