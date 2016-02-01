import Jsmoo, { Role } from '../../src';

function buildObject() {
  class BasicObject extends Jsmoo {}

  return BasicObject;
}

function createObjectWith(value, name, attrOpts, opts = {}) {
  const BasicObject = buildObject();

  if (opts.multi) {
    BasicObject.has({
      test: { is: 'rw', default: 'default' },
    });
  }

  BasicObject.has({
    name: attrOpts,
  });

  if (value !== undefined || opts.forceSet) return new BasicObject({ name: value });
  return new BasicObject();
}

function buildRoleWith() {
  class TestRole extends Role {}

  return TestRole;
}

export { createObjectWith };
export { buildRoleWith };
export { buildObject };
