import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createObjectWith, buildObject } from './utils';
import Jsmoo from '../src';

describe("Test 'has'", () => {
  it('must have fuction has', () => {
    expect(Jsmoo).to.have.property('has');
  });
  describe('with options', () => {
    it('beeing undefined', () => {
      expect(() => createObjectWith('test', 'name', undefined)).to.throw(TypeError);
    });
    it("without 'is' key", () => {
      expect(() => createObjectWith('test', 'name', {})).to.throw(TypeError);
    });
  });
  it('must ignore no defined attributes', () => {
    const BasicObject = buildObject();
    BasicObject.has({
      name: { is: 'rw', isa: 'string' },
    });
    const basicObj = new BasicObject({ name: 'pepe', surname: 'pepa' });
    expect(basicObj).not.to.have.property('surname');
    expect(basicObj).to.have.property('name').to.equal('pepe');
  });
  it('with { COERCE } option');
  it('with { TRIGGER } option');
  it('with { PREDICATE } option');
  it('with { BUILDER } option');
  it('with { CLEARER } option');
  it('with { LAZY } option');
  it('with { READER } option');
  it('with { WRITTER } option');
});
