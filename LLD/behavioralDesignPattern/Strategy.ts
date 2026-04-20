// ============================================================
// STRATEGY DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Strategy lets you define a family of algorithms, put each of them 
// into a separate class, and make their objects interchangeable AT RUNTIME.
// It isolates the logic from the context using it.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Payment Methods (Pay with CreditCard, PayPal, or Crypto)
// 2. Navigation / Maps (Route via Car, Walk, or Public Transit)
// 3. Sorting Algorithms (Sort by Quicksort vs Mergesort depending on array size)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Strategy Interface
interface RouteStrategy {
  buildRoute(A: string, B: string): string;
}

// Step 2: Concrete Strategies
class CarRoute implements RouteStrategy {
  buildRoute(A: string, B: string): string {
    return `🚗 Highway tracking from ${A} to ${B} (10 mins)`;
  }
}

class WalkRoute implements RouteStrategy {
  buildRoute(A: string, B: string): string {
    return `🚶 Use pedestrian paths from ${A} to ${B} (45 mins)`;
  }
}

class BikeRoute implements RouteStrategy {
  buildRoute(A: string, B: string): string {
    return `🚲 Using bike lanes from ${A} to ${B} (20 mins)`;
  }
}

// Step 3: Context
class NavigatorApp {
  private strategy: RouteStrategy;

  constructor(strategy: RouteStrategy) {
    this.strategy = strategy;
  }

  // ✅ Change strategy AT RUNTIME
  setStrategy(strategy: RouteStrategy) {
    this.strategy = strategy;
  }

  calculate(A: string, B: string) {
    const route = this.strategy.buildRoute(A, B);
    console.log(route);
  }
}

// Step 4: Client Code
const nav = new NavigatorApp(new CarRoute()); // Default is Car
nav.calculate("Home", "Park"); // 🚗

console.log("Switching to Walk...");
nav.setStrategy(new WalkRoute()); // Changed dynamically
nav.calculate("Home", "Park"); // 🚶

// ─── MEMORY TRICK ────────────────────────────────────────────
// Strategy = GOING TO THE AIRPORT.
// The GOAL (Context) is to reach the airport.
// The HOW (Strategy) can be Uber, Bus, or Driving. 
// You can swap the 'HOW' right before you leave, the goal is the same!

// Difference from State: 
// State changes internally on its own (Machine dispensing coin -> reset).
// Strategy is changed EXTERNALLY by the user.
