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
  it('must set the attribute to undefined', () => {
    const obj = createObjectWith('value', 'name', { is: 'rw', clearer: true });
    expect(obj).to.have.property('name').to.equal('value');
    obj.clearName();
    expect(obj._attributes_).to.not.have.property('name');
    expect(obj).to.have.property('name').to.equal(undefined);
  });
});
