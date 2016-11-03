import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createObjectWith } from './utils';

describe('Test HAS with { CLEARER } option', () => {
  describe('must have the function clearName', () => {
    it('if it does not start with _', () => {
      const obj = createObjectWith('value', 'name', { is: 'rw', clearer: true });
      expect(obj).to.have.property('clearName');
    });
    it('if it starts with _', () => {
      const obj = createObjectWith('value', '_name', { is: 'rw', clearer: true });
      expect(obj).to.have.property('_clearName');
    });
  });
  it('must set the attribute to undefined by removing it from the attributes', () => {
    const obj = createObjectWith('value', 'name', { is: 'rw', clearer: true });
    expect(obj).to.have.property('name').to.equal('value');
    obj.clearName();
    expect(obj.getAttributes()).to.not.have.property('name');
    expect(obj).to.have.property('name').to.equal(undefined);
  });
  it('must attribute but still usable with defaults', () => {
    const defFunc = function () { return 'pepita'; };
    const obj = createObjectWith('value', 'name', { is: 'ro', lazy: true, clearer: true, default: defFunc });
    expect(obj).to.have.property('name').to.equal('value');
    obj.clearName();
    expect(obj.getAttributes()).to.not.have.property('name');
    expect(obj).to.have.property('name').to.equal('pepita');
  });
});
