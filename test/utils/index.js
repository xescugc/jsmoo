import Jsmoo from '../../src';

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

export { createObjectWith };
