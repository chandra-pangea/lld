/**
 * ============================================================
 * 2. EVENT LOOP, MACROTASKS vs MICROTASKS
 * ============================================================
 * THIS IS THE #1 ASKED TOPIC for Sr. Frontend / JS roles.
 * Priority: Sync Code -> Microtasks (Promises/process.nextTick) -> Macrotasks (setTimeout/setInterval)
 */

console.log("1. Start"); // Sync

setTimeout(() => {
    console.log("2. setTimeout 1"); // Macrotask
    Promise.resolve().then(() => console.log("3. Promise inside setTimeout")); // Micro inside Macro
}, 0);

Promise.resolve().then(() => {
    console.log("4. Promise 1"); // Microtask
    setTimeout(() => {
        console.log("5. setTimeout inside Promise"); // Macro inside Micro
    }, 0);
}).then(() => {
    console.log("6. Promise 2 (Chained)"); // Microtask queued after Promise 1 finishes
});

console.log("7. End"); // Sync

/*
    EXPECTED OUTPUT ORDER:
    "1. Start"
    "7. End"
    "4. Promise 1"
    "6. Promise 2 (Chained)"
    "2. setTimeout 1"
    "3. Promise inside setTimeout"
    "5. setTimeout inside Promise"
*/

// --- Trick 2: Async Await blocking ---
async function asyncFunc() {
    console.log("A"); 
    await Promise.resolve(); // Everything AFTER await is pushed to the Microtask queue!
    console.log("B"); 
}

console.log("C");
asyncFunc();
console.log("D");

/* 
    EXPECTED OUTPUT ORDER:
    "C"
    "A"  <- (Execution goes into the async func synchronously until the first `await`)
    "D"
    "B"  <- (Microtask executes after synchronous stack clears)
*/
