/**
 * PROBLEM EXPLANATION:
 * Implement a function to perform a shallow merge of two or more objects.
 */

function shallowMerge(obj1, obj2) {
    const result = {};
  
    for (let key in obj1) {
      result[key] = obj1[key];
    }
  
    for (let key in obj2) {
      result[key] = obj2[key];
    }
  
    return result;
  }
  
  
  const a = { x: 1, y: { nested: 10 } };
  const b = { y: { nested: 20 }, z: 3 };
  
  const merged = shallowMerge(a, b);
  console.log(merged);
  
  console.log(merged.y === b.y);
  console.log(a.y === merged.y);
  