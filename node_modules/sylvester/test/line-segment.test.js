import { expect } from 'chai';
import { Line } from '../src';

describe('line segment', () => {
  it('should create', () => {
    const lineSegment = Line.Segment.create([1, 2], [5, 6]);
    expect(lineSegment.line.anchor).to.vector.equal([1, 2, 0]);
  });
});
