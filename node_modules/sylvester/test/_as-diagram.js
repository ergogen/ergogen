import fs from 'fs';
import { expect } from 'chai';

const examples = {};

function getAllPropertyNames(instance, seen = []) {
  if (!instance || seen.indexOf(instance) !== -1) {
    return [];
  }

  seen.push(instance); // we can purposely mutate seen, no reason to revisit nodes again

  let names = Object.getOwnPropertyNames(instance);
  if (instance.prototype) {
    names = names.concat(getAllPropertyNames(instance.prototype, seen));
  }
  if (instance.constructor) {
    names = names.concat(getAllPropertyNames(instance.constructor.prototype, seen));
  }

  return names;
}

class Interceptor {
  constructor(instance) {
    this._instance = instance;
  }

  intercept(callback) {
    this._callback = callback;
    this._attach();
  }

  _attach() {
    const original = this._original = [];
    const inst = this._instance;

    getAllPropertyNames(inst).forEach(method => {
      if (typeof inst[method] !== 'function') {
        return;
      }

      original.push(method);
      inst[method] = (...args) => this._catchCall(method, args);
    });
  }

  _detach() {
    this._original.forEach(key => {
      delete this._instance[key];
    });
  }

  _catchCall(method, args) {
    // detach before calling the underyling method to make sure we only get the first call
    this._detach();
    const retValue = this._instance[method].apply(this._instance, args);
    this._callback(method, args, retValue);
    return expect(retValue);
  }
}

/**
 * Magical function that can intercept method calls and stick them in a JSON
 * for the LaTeX renderer to pull.
 * @example
 * asDiagram('Vector.toUnitVector').it('should calculate unit vector', expectCall => {
 *   expectCall(x).toUnitVector().to.vector.equal([0.6, 0.8]);
 *   expectCall(new Vector([0, 0])).toUnitVector().to.vector.equal([0, 0]);
 * });
 * @param  {String} name identifier of the diagram
 */
export function asDiagram(name) { // yes, this is very magic, but it makes our tests clean
  function expectCall(instance) {
    new Interceptor(instance).intercept((method, args, retValue) => {
      const record = { callee: instance, args, method, retValue };
      if (name in examples) {
        examples[name].push(record);
      } else {
        examples[name] = [record];
      }
    });

    return instance;
  }

  return {
    it(tname, handler) {
      if (handler === undefined) {
        [handler, tname] = [tname, name];
      }

      it(tname, () => handler(expectCall));
    }
  };
}

after(() =>
  fs.writeFileSync(
    `${__dirname}/../doc/gen/examples.json`,
    JSON.stringify(examples, null, 2)
  )
);
