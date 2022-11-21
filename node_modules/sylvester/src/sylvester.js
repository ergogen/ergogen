/**
 * Default Sylvester configurations.
 * @type {Object}
 */
export const Sylvester = {
  precision: 1e-6,
  approxPrecision: 1e-5
};

/**
 * A DimensionalityMismatchError is thrown when an operation is run on two
 * units which should share a certain dimensional relationship, but fail it.
 */
export class DimensionalityMismatchError extends Error {}
