import { factory } from '../../utils/factory.js';
import { errorTransform } from './utils/errorTransform.js';
import { createSubset } from '../../function/matrix/subset.js';
var name = 'subset';
var dependencies = ['typed', 'matrix'];
export var createSubsetTransform = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed,
    matrix
  } = _ref;
  var subset = createSubset({
    typed,
    matrix
  });
  /**
   * Attach a transform function to math.subset
   * Adds a property transform containing the transform function.
   *
   * This transform creates a range which includes the end value
   */

  return typed('subset', {
    '...any': function any(args) {
      try {
        return subset.apply(null, args);
      } catch (err) {
        throw errorTransform(err);
      }
    }
  });
}, {
  isTransformFunction: true
});