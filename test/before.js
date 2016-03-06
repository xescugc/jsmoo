import { expect } from 'chai';
import { describe, it } from 'mocha';
import { before } from '../src';
import { buildObject } from './utils';

describe("Test 'before'", () => {
  it('it must be called before the function', () => {
    const Obj = buildObject();
    let funcIn;
    Obj.prototype.save = function (name) {
      funcIn = true;
    };
    let beforeParams;
    before(Obj.prototype, 'save', function (param) {
      beforeParams = param;
    });

    const obj = new Obj();

    obj.save('test');

    expect(beforeParams).to.equal('test');
    expect(funcIn).to.be.true; //eslint-disable-line
  });
});
