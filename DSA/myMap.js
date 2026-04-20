/**
 * PROBLEM EXPLANATION:
 * Implement a custom `Array.prototype.map` method or a basic Hash Map structure from scratch.
 */


Array.prototype.myMap = function (callback, thisArg) {
    if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
    }

    const result = [];

    // `this` refers to the array on which myMap is called
    for (let i = 0; i < this.length; i++) {
        // check if index exists (important for sparse arrays)
        if (i in this) {
            result[i] = callback.call(thisArg, this[i], i, this);
        }
    }

    return result;
};



const arr = [1, 2, 3];

const doubled = arr.myMap(num => num * 2);

console.log(doubled); // [2, 4, 6]
