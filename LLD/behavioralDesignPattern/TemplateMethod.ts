// ============================================================
// TEMPLATE METHOD DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Template Method defines the SKELETON of an algorithm in a superclass 
// but lets subclasses override specific steps without changing 
// the algorithm's overall structure.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Data Mining (Parse CSV or XML, but Analyzing and Reporting happens same way)
// 2. UI rendering lifecycles (`componentDidMount`, `render`)
// 3. Building construction (Dig foundation -> Build Walls -> Paint; painting differs per house)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Abstract Class (The Skeleton)
abstract class BeverageMaker {
  // ✅ The Template Method (Marked final in languages like Java, 
  // here we just don't override it in typescript conventions)
  prepareRecipe(): void {
    this.boilWater();
    this.brew();           // Abstract: subclass decides
    this.pourInCup();
    this.addCondiments();  // Abstract: subclass decides
    console.log("----- Drink is Ready -----");
  }

  // Mandatory identical steps (implemented here)
  private boilWater() { console.log("🔥 Boiling water"); }
  private pourInCup() { console.log("☕ Pouring into cup"); }

  // Steps that MUST be implemented by subclass
  protected abstract brew(): void;
  protected abstract addCondiments(): void;
}

// Step 2: Concrete Classes
class TeaMaker extends BeverageMaker {
  protected brew(): void {
    console.log("🌿 Steeping the tea leaves");
  }
  protected addCondiments(): void {
    console.log("🍋 Adding Lemon");
  }
}

class CoffeeMaker extends BeverageMaker {
  protected brew(): void {
    console.log("🪵 Dripping coffee through filter");
  }
  protected addCondiments(): void {
    console.log("🥛 Adding Sugar and Milk");
  }
}

// Step 3: Client Code
console.log("Making Tea:");
const tea = new TeaMaker();
tea.prepareRecipe(); 
// Boiling -> Steeping -> Pouring -> Adding Lemon

console.log("\nMaking Coffee:");
const coffee = new CoffeeMaker();
coffee.prepareRecipe();
// Boiling -> Dripping -> Pouring -> Adding Sugar/Milk

// ─── MEMORY TRICK ────────────────────────────────────────────
// Template Method = MAD LIBS PRE-WRITTEN STORY.
// The flow of the story is locked. "The [ADJ] dog ran to the [NOUN]."
// The subclasses just fill in the blank words, but they CAN'T rewrite 
// the whole sentence structure!
