/**
 * ============================================================
 * 4. CONTEXT (`this`), ARROW FUNCTIONS, CALL, APPLY, BIND
 * ============================================================
 */

const user = {
    name: "Chandra",
    
    // Regular function: `this` points to the object calling it (user)
    regularFunc: function() {
        console.log("Regular:", this.name);
    },
    
    // Arrow function: captures `this` lexically from the surrounding scope (usually window/global object)
    arrowFunc: () => {
        console.log("Arrow:", this.name); // undefined
    },

    // Tricky nested:
    nestedRegular: function() {
        const arrowInside = () => {
            // Inherits `this` from the regular function parent!
            console.log("Nested Arrow:", this.name); 
        };
        arrowInside();

        function regularInside() {
            // `this` is lost! Points to window/global
            console.log("Nested Regular:", this.name);
        }
        regularInside();
    }
};

user.regularFunc();       // "Regular: Chandra"
user.arrowFunc();         // "Arrow: undefined"
user.nestedRegular();     // "Nested Arrow: Chandra" | "Nested Regular: undefined"

// --- Trick 2: Extracting a method loses `this` ---
// How do you fix it? Use `.bind()`!
const unbound = user.regularFunc;
unbound(); // "Regular: undefined" (Because it's called as standalone, not `user.unbound`)

const bound = user.regularFunc.bind(user);
bound(); // "Regular: Chandra"


// ==========================================
// POLYFILLING .bind(), .call(), .apply()
// ==========================================

// Custom Bind
Function.prototype.myBind = function(context, ...args) {
    const fn = this; // 'this' points to the original function
    return function(...newArgs) {
        return fn.apply(context, [...args, ...newArgs]);
    };
};

const myBoundFunc = user.regularFunc.myBind({ name: "CustomBind" });
myBoundFunc(); // "Regular: CustomBind"

// Custom Call
Function.prototype.myCall = function(context, ...args) {
    context = context || globalThis;
    const uniqueKey = Symbol(); // use symbol to avoid property collision
    context[uniqueKey] = this;  
    
    const result = context[uniqueKey](...args); // Call it with context
    delete context[uniqueKey]; // Cleanup
    return result;
};
