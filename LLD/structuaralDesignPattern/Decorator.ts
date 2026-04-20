// ============================================================
// DECORATOR DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Decorator lets you attach new behaviors to objects dynamically 
// by placing these objects inside special wrapper objects that contain the behaviors.
// Provides a flexible alternative to subclassing.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Additions in Coffee Shop (Milk, Sugar addons wrapped around base Coffee)
// 2. Data streams (Compression → Encryption → Base Data stream)
// 3. UI extensions (ScrollbarDecorator wrapping a TextView)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Component Interface
interface Coffee {
  cost(): number;
  description(): string;
}

// Step 2: Concrete Component
class SimpleCoffee implements Coffee {
  cost() { return 5; }
  description() { return "Simple Coffee"; }
}

// Step 3: Base Decorator
abstract class CoffeeDecorator implements Coffee {
  protected coffeeObj: Coffee;

  constructor(coffee: Coffee) {
    this.coffeeObj = coffee;
  }

  cost() { return this.coffeeObj.cost(); }
  description() { return this.coffeeObj.description(); }
}

// Step 4: Concrete Decorators
class MilkDecorator extends CoffeeDecorator {
  cost() { return super.cost() + 1.5; }
  description() { return super.description() + ", Milk"; }
}

class CaramelDecorator extends CoffeeDecorator {
  cost() { return super.cost() + 2; }
  description() { return super.description() + ", Caramel"; }
}

// Step 5: Client Code
let myCoffee: Coffee = new SimpleCoffee();
console.log(`${myCoffee.description()} $${myCoffee.cost()}`); // Simple Coffee $5

// Wrap with Milk
myCoffee = new MilkDecorator(myCoffee);
// Wrap with Caramel
myCoffee = new CaramelDecorator(myCoffee);

console.log(`${myCoffee.description()} $${myCoffee.cost()}`);
// Simple Coffee, Milk, Caramel $8.5

// ─── MEMORY TRICK ────────────────────────────────────────────
// Decorator = CLOTHING LAYERS.
// Base object is naked you. Milk = T-Shirt. Caramel = Jacket.
// Each added layer provides a bit more feature to the original object
// without touching the original base code.
