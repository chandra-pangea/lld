/**
 * ============================================================
 * 1. TRICKY COERCION & TYPES (OUTPUT GUESSING)
 * ============================================================
 * Interviewers test if you deeply understand JS implicit type coercion.
 * Rule of Thumb: 
 * - Output guessing: Read carefully. Strings win in `+`, Numbers win in `- * /`.
 */

// --- Trick 1: The "typeof" quirks ---
console.log(typeof null);         // "object" (Famous JS bug)
console.log(typeof NaN);          // "number"
console.log(typeof []);           // "object" (Use Array.isArray)
console.log(typeof function(){}); // "function"

// --- Trick 2: Math with Strings ---
console.log("5" + 3);  // "53" (Because '+' concatenates if one is a string)
console.log("5" - 3);  // 2    (Because '-' triggers numeric conversion)
console.log("5" * "3"); // 15
console.log(5 + "3" + 2); // "532" (Evaluates left to right)
console.log(5 + 2 + "3"); // "73"  (5+2 evaluates first numerically, then concats "3")

// --- Trick 3: Truthy / Falsy & Loose Equality ---
// Falsy values: false, 0, -0, 0n, "", null, undefined, NaN (Everything else is truthy!)
console.log([] == ![]);    // TRUE! (Wait, what? `![]` evaluates to `false`. Then `[] == false`. `[]` coerces to `""`. `"" == false` is true!)
console.log(NaN === NaN);  // FALSE (NaN is never equal to anything, not even itself. Use Number.isNaN)
console.log(null == undefined); // TRUE (They loosely equal each other)
console.log(null === undefined); // FALSE (Different types)

// --- Trick 4: Object-to-Primitive Coercion ---
const obj = {
  valueOf() { return 10; },
  toString() { return "20"; }
};
console.log(obj + 5); // 15 (Calls valueOf first for mathematical operations)
console.log(String(obj)); // "20" (Calls toString when explicitly converting to String)

console.log({} + []); // "[object Object]"
console.log([] + {}); // "[object Object]"

// --- Trick 5: Floating Point Math ---
console.log(0.1 + 0.2 === 0.3); // FALSE! (It actually equals 0.30000000000000004 due to IEEE 754 binary floating point logic)
// Fixing it:
console.log(Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON); // TRUE
