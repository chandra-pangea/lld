// ============================================================
// BUILDER DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Builder separates the CONSTRUCTION of a complex object
// from its REPRESENTATION — lets you build step by step.
// Solves the "telescoping constructor" anti-pattern.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Building complex SQL / HTTP requests step by step
// 2. Creating user profiles with many optional fields
// 3. Constructing test data / mock objects in tests
// 4. Building DOM elements or report documents

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: The complex object (Product)
class Pizza {
  size: string = "";
  crust: string = "";
  sauce: string = "";
  toppings: string[] = [];

  describe(): void {
    console.log(
      `🍕 ${this.size} pizza | Crust: ${this.crust} | Sauce: ${this.sauce} | Toppings: ${this.toppings.join(", ")}`
    );
  }
}

// Step 2: Builder interface
interface PizzaBuilder {
  setSize(size: string): this;
  setCrust(crust: string): this;
  setSauce(sauce: string): this;
  addTopping(topping: string): this;
  build(): Pizza;
}

// Step 3: Concrete Builder (returns `this` for method chaining)
class CustomPizzaBuilder implements PizzaBuilder {
  private pizza: Pizza;

  constructor() {
    this.pizza = new Pizza();
  }

  setSize(size: string): this {
    this.pizza.size = size;
    return this; // enables chaining
  }

  setCrust(crust: string): this {
    this.pizza.crust = crust;
    return this;
  }

  setSauce(sauce: string): this {
    this.pizza.sauce = sauce;
    return this;
  }

  addTopping(topping: string): this {
    this.pizza.toppings.push(topping);
    return this;
  }

  build(): Pizza {
    const result = this.pizza;
    this.pizza = new Pizza(); // reset for next build
    return result;
  }
}

// Step 4 (Optional): Director — encapsulates preset recipes
class PizzaDirector {
  private builder: PizzaBuilder;

  constructor(builder: PizzaBuilder) {
    this.builder = builder;
  }

  makeMargherita(): Pizza {
    return this.builder
      .setSize("Medium")
      .setCrust("Thin")
      .setSauce("Tomato")
      .addTopping("Mozzarella")
      .addTopping("Basil")
      .build();
  }

  makeBBQChicken(): Pizza {
    return this.builder
      .setSize("Large")
      .setCrust("Thick")
      .setSauce("BBQ")
      .addTopping("Chicken")
      .addTopping("Onions")
      .addTopping("Jalapeños")
      .build();
  }
}

// Usage
const builder = new CustomPizzaBuilder();

// Direct build (no director)
const customPizza = builder
  .setSize("Small")
  .setCrust("Stuffed")
  .setSauce("Pesto")
  .addTopping("Mushrooms")
  .addTopping("Olives")
  .build();
customPizza.describe();
// 🍕 Small pizza | Crust: Stuffed | Sauce: Pesto | Toppings: Mushrooms, Olives

// Using Director for preset recipes
const director = new PizzaDirector(new CustomPizzaBuilder());
director.makeMargherita().describe();
// 🍕 Medium pizza | Crust: Thin | Sauce: Tomato | Toppings: Mozzarella, Basil

director.makeBBQChicken().describe();
// 🍕 Large pizza | Crust: Thick | Sauce: BBQ | Toppings: Chicken, Onions, Jalapeños

// ─── MEMORY TRICK ────────────────────────────────────────────
// Builder = Subway sandwich maker.
// "Choose your bread… sauce… toppings…" — step by step,
// then "build()" = wrap it up. No giant constructor needed!
