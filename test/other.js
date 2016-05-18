import { describe, it } from 'mocha';
import { expect } from 'chai';
import { buildObject } from './utils';

describe('Beeing able to create more than one Objet form the same class', () => {
  it('must create 2 different objects', () => {
    const Obj = buildObject();

    Obj.has({
      name: { is: 'rw' },
    });

    const obj1 = new Obj({ name: 'test1' });
    expect(obj1).to.have.property('name').to.equal('test1');

    const obj2 = new Obj({ name: 'test2' });
    expect(obj1).to.have.property('name').to.equal('test1');
    expect(obj2).to.have.property('name').to.equal('test2');
  });
});
