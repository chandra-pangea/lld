/**
 * ============================================================
 * 7. ADVANCED PROMISES & ASYNC PATTERNS
 * ============================================================
 * Beyond `Promise.all`, interviewers test if you can manipulate asynchronously.
 */

// --- 1. Execute an Array of Promises SEQUENTIALLY (One by One) ---
// Note: Promise.all runs them in parallel. If we need to wait for task A before task B:

const asyncTask = (time, label) => new Promise(resolve => setTimeout(() => {
    console.log(`Task ${label} completed!`);
    resolve(label);
}, time));

const tasks = [
    () => asyncTask(1000, "1"),
    () => asyncTask(500, "2"),
    () => asyncTask(300, "3")
];

// Approach A: Using Async/Await (Modern & Easy)
async function executeSequentiallyAsync(promiseFunctions) {
    for (const fn of promiseFunctions) {
        await fn(); 
    }
}

// Approach B: Using Array.reduce (The classic tricky interview answer!)
function executeSequentiallyReduce(promiseFunctions) {
    return promiseFunctions.reduce((promiseChain, currentFunction) => {
        return promiseChain.then(currentFunction);
    }, Promise.resolve());
}


// --- 2. Implement an auto-retry Promise function ---
// "Write a function that tries to execute a promise, and if it fails, retries up to N times."

function fetchWithRetry(fetcher, retries = 3) {
    return new Promise((resolve, reject) => {
        
        function attempt(retriesLeft) {
            fetcher()
                .then(resolve) // If it works, we immediately resolve
                .catch(error => {
                    if (retriesLeft === 0) {
                        reject(new Error("Max retries reached: " + error.message));
                    } else {
                        console.log(`Retrying... (${retriesLeft} left)`);
                        attempt(retriesLeft - 1);
                    }
                });
        }
        
        attempt(retries); // Start first attempt
    });
}

// --- 3. Implement a generic Sleep function ---
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Usage: await sleep(2000);


// --- 4. Custom Promise.any (Polyfill) ---
// `Promise.any` resolves as soon as ANY ONE promise resolves. 
// It ONLY rejects if ALL promises reject.
Promise.myAny = function(promises) {
    return new Promise((resolve, reject) => {
        let errors = [];
        let rejectedCount = 0;

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(resolve) // The moment one succeeds, we resolve the whole thing
                .catch(err => {
                    errors[index] = err;
                    rejectedCount++;
                    if (rejectedCount === promises.length) {
                        // If all of them fail, then we reject with all errors.
                        reject(new AggregateError(errors, "All promises were rejected"));
                    }
                });
        });
    });
};
