/**
 * ============================================================
 * 3. CLOSURES AND SCOPE
 * ============================================================
 * Closure: A function remembers its lexical scope even when executed outside that scope.
 */

// --- Trick 1: The infamous SetTimeout inside a Loop ---
// They will ask: "What does this print and how do you fix it?"
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log("var i:", i), 100);
}
// OUTPUT: 3, 3, 3 (Because `var` is function-scoped. By the time setTimeout runs 100ms later, the loop is done and `i` is 3).

// FIX 1: Use `let` (Block-scoped, creates a new binding for each iteration)
for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log("let j:", j), 100);
} // Output: 0, 1, 2

// FIX 2: Use an IIFE (Immediately Invoked Function Expression) to capture the state
for (var k = 0; k < 3; k++) {
    (function(capturedK) {
        setTimeout(() => console.log("IIFE k:", capturedK), 100);
    })(k);
}

// --- Trick 2: Data Privacy using Closures ---
function createBankAcc(initialBal) {
    let balance = initialBal; // Cannot be accessed directly from outside
    return {
        deposit: (amount) => { balance += amount; },
        getBalance: () => balance
    };
}
const myAcc = createBankAcc(100);
console.log(myAcc.balance); // undefined
myAcc.deposit(50);
console.log(myAcc.getBalance()); // 150

// --- Trick 3: Tricky Scope Question ---
var x = 10;
function test() {
    // There is "hoisting" happening here. `var x` is hoisted to the top of `test()` as `var x = undefined`.
    console.log("x inside:", x); // undefined
    var x = 20;
}
test();
