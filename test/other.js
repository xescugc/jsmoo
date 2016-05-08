import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createObjectWith } from './utils';

describe('Beeing able to create more than one Objet form the same class', () => {
  it('must create 2 different objects', () => {
    const obj1 = createObjectWith('test1', 'name', { is: 'rw' });
    expect(obj1).to.have.property('name').to.equal('test1');

    const obj2 = createObjectWith('test2', 'name', { is: 'rw' });
    expect(obj1).to.have.property('name').to.equal('test1');
    expect(obj2).to.have.property('name').to.equal('test2');
  });
});
