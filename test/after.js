import { expect } from 'chai';
import { describe, it } from 'mocha';
import { after } from '../src';
import { buildObject } from './utils';

describe("Test 'after'", () => {
  it('it must be called after the function', () => {
    const Obj = buildObject();
    const order = [];
    Obj.prototype.save = function (name) {
      order.push('func');
    };
    let afterParams;
    after(Obj.prototype, 'save', function (param) {
      afterParams = param;
      order.push('after');
    });

    const obj = new Obj();

    obj.save('test');

    expect(afterParams).to.equal('test');
    expect(order).to.eql(['func', 'after']);
  });
});
