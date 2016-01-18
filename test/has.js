import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createObjectWith } from './utils';
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
  it('with { COERCE } option');
  it('with { TRIGGER } option');
  it('with { PREDICATE } option');
  it('with { BUILDER } option');
  it('with { CLEARER } option');
  it('with { LAZY } option');
  it('with { READER } option');
  it('with { WRITTER } option');
});
