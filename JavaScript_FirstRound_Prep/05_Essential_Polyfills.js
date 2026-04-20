/**
 * ============================================================
 * 5. ESSENTIAL POLYFILLS & CUSTOM FUNCTIONS
 * ============================================================
 * You will absolutely be asked to implement one of these from scratch.
 */

// 1. Polyfill for Array.prototype.map()
Array.prototype.myMap = function(callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this));
    }
    return result;
};

// 2. Polyfill for Array.prototype.reduce()
Array.prototype.myReduce = function(callback, initialValue) {
    let accumulator = initialValue;
    let startIndex = 0;

    // If initialValue not provided, use the first array element
    if (initialValue === undefined) {
        accumulator = this[0];
        startIndex = 1;
    }

    for (let i = startIndex; i < this.length; i++) {
        accumulator = callback(accumulator, this[i], i, this);
    }
    return accumulator;
};

// 3. Polyfill for Promise.all()
// Must wait for all promises to resolve, or reject immediately if ONE rejects.
Promise.myAll = function(promises) {
    return new Promise((resolve, reject) => {
        let results = [];
        let completedCount = 0;

        if (promises.length === 0) resolve([]);

        promises.forEach((promise, index) => {
            // Promise.resolve wraps any non-promise values passed
            Promise.resolve(promise)
                .then(val => {
                    results[index] = val; // Store at correct index
                    completedCount++;
                    if (completedCount === promises.length) {
                        resolve(results);
                    }
                })
                .catch(err => {
                    reject(err); // Reject entirely if one fails
                });
        });
    });
};

// 4. Implement Debounce
// delays calling a function until after X ms have elapsed since last call
function debounce(func, delay) {
    let timerId;
    return function(...args) {
        clearTimeout(timerId); // Reset timer if called again
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// 5. Implement Throttle
// ensures a function is called at most once exactly every X ms
function throttle(func, limit) {
    let inThrottle = false;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}
