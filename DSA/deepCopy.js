/**
 * PROBLEM EXPLANATION:
 * Write a deep clone function to make a deep copy of a highly nested object or array.
 */

function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
  
    let clone = Array.isArray(obj) ? [] : {};
  
    for (let key in obj) {
      clone[key] = deepClone(obj[key]);
    }
  
    return clone;
  }
  const original = { a: 1, b: { c: 2 } };
  const copy = deepClone(original);
  
  console.log(copy);
  console.log(copy.b !== original.b);