import { expect } from 'chai';
import { Line } from '../src';

describe('line', () => {
  it('should create', () => {
    const line = Line.create([1, 2], [5, 6]);
    expect(line.anchor).to.vector.equal([1, 2, 0]);
  });
});
