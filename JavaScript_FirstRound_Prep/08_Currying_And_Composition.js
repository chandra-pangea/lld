/**
 * ============================================================
 * 8. CURRYING, PARTIAL APPLICATION, & COMPOSITION
 * ============================================================
 * "Functions inside Functions" - highly requested by FAANG interviewers.
 */

// --- 1. Basic Currying ---
// Transforming a function of multiple arguments `f(a,b,c)` into `f(a)(b)(c)`
function sum(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        }
    }
}
console.log(sum(1)(2)(3)); // 6


// --- 2. Advanced: Infinite Currying ---
// Write a function that allows: add(1)(2)(3)(4)...() 
// Notice the empty `()` at the end, which triggers the sum result.

function infiniteAdd(a) {
    return function(b) {
        if (b === undefined) { 
            return a; // Signal to execute and return the accumulated sum
        }
        return infiniteAdd(a + b); // Otherwise, keep currying
    }
}

console.log(infiniteAdd(5)(10)(15)()); // 30
console.log(infiniteAdd(2)(2)());      // 4


// --- 3. Polyfill: Generic Curry Wrapper ---
// Turn ANY normal function into a curried function!
function curry(fn) {
    return function curried(...args) {
        // If the number of passed arguments equals or exceeds the function's expected inputs
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            // Otherwise, return a function that waits for the rest of the arguments
            return function(...nextArgs) {
                return curried.apply(this, [...args, ...nextArgs]);
            }
        }
    }
}

function multiplyThreeNums(a, b, c) { return a * b * c; }
const curriedMultiply = curry(multiplyThreeNums);
console.log(curriedMultiply(2)(3)(4)); // 24
console.log(curriedMultiply(2, 3)(4)); // 24


// --- 4. Function Composition (Compose & Pipe) ---
// Passing the result of one function directly into another sequentially.

const add5 = (x) => x + 5;
const double = (x) => x * 2;
const subtract2 = (x) => x - 2;

// PIPE: Executes Left to Right (First add5, then double, then subtract2)
// This is exactly what Redux uses!
const pipe = (...functions) => (initialValue) => {
    return functions.reduce((acc, currentFunc) => {
        return currentFunc(acc);
    }, initialValue);
};

const pipeline = pipe(add5, double, subtract2);
console.log(pipeline(10)); // (10 + 5) * 2 - 2 = 28

// COMPOSE: Executes Right to Left (First subtract2, then double, then add5)
const compose = (...functions) => (initialValue) => {
    return functions.reduceRight((acc, currentFunc) => {
        return currentFunc(acc);
    }, initialValue);
};

const composed = compose(add5, double, subtract2);
console.log(composed(10)); // (10 - 2) * 2 + 5 = 21
