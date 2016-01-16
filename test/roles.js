import { describe, it } from 'mocha';
import { expect } from 'chai';
import { buildRoleWith } from './utils';

describe('Creation of ROLE', () => {
  it("can't be initialized", () => {
    const Role = buildRoleWith();
    expect(() => {
      new Role();
    }).to.throw(TypeError, "Roles can't be initialized");
  });
});
