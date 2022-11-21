import { expect } from 'chai';
import { Vector, Plane } from '../src';

describe('plane', () => {
  it('should create', () => {
    const plane = Plane.create([1, 2, 3], [5, 5, 5]);
    expect(plane.anchor).to.deep.equal(Vector.create([1, 2, 3]));
  });

  it('should create with P$', () => {
    const A = Plane.create([1, 2, 3], [5, 5, 5]);
    const B = Plane.create([1, 2, 3], [5, 5, 5]);

    expect(A).to.deep.equal(B);
  });
});
