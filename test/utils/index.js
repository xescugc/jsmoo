import Jsmoo, { Role } from '../../src';

function createObjectWith(value, name, attrOpts, opts = {}) {
  class BasicObject extends Jsmoo {}

  if (opts.multi) {
    BasicObject.has({
      test: { is: 'rw', default: 'default' },
    });
  }

  BasicObject.has({
    name: attrOpts,
  });

  if (value !== undefined) return new BasicObject({ name: value });
  return new BasicObject();
}

function buildRoleWith() {
  class TestRole extends Role {}

  return TestRole;
}

export { createObjectWith };
export { buildRoleWith };
