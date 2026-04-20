/**
 * ============================================================
 * 6. PROTOTYPAL INHERITANCE & ES6 CLASSES
 * ============================================================
 * JS uses Prototype-based inheritance, not Class-based inheritance.
 * The `class` keyword from ES6 is just syntactic sugar.
 */

// --- 1. The old way (ES5 Constructor Functions) ---
function Animal(name) {
    this.name = name;
}
// Adding methods to the prototype (Memory efficient! All instances share this single function)
Animal.prototype.speak = function() {
    console.log(`${this.name} makes a noise.`);
};

function Dog(name, breed) {
    // Calling super constructor to inherit properties
    Animal.call(this, name); 
    this.breed = breed;
}

// Inherit the prototype chain!
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // Fix the constructor reference

Dog.prototype.bark = function() {
    console.log(`${this.name} barks!`);
};

const myDog = new Dog("Rex", "German Shepherd");
myDog.speak(); // Output: Rex makes a noise.
myDog.bark();  // Output: Rex barks!

// --- 2. The ES6 way (Under the hood, it's doing EXACTLY what is written above) ---
class Cat extends Animal {
    constructor(name, color) {
        super(name); // Same as Animal.call(this, name)
        this.color = color;
    }
    
    meow() {
        console.log(`${this.name} meows!`); // Same as Cat.prototype.meow = function() {}
    }
}

// --- Trick: Prototypal Chain Interview Question ---
console.log(myDog.__proto__ === Dog.prototype);        // true (Instance __proto__ points to constructor's prototype)
console.log(Dog.prototype.__proto__ === Animal.prototype); // true (Inheritance hookup)
console.log(Animal.prototype.__proto__ === Object.prototype); // true (Everything stems from Object)
console.log(Object.prototype.__proto__ === null);      // true (The end of the chain!)

// Interviewer: "How do you create an object without a prototype?"
// Answer: 
const pureObject = Object.create(null);
// pureObject.toString() will throw an error since it has no prototype to inherit toString from!
