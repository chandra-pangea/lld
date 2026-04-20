// ============================================================
// FACADE DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Facade provides a simplified interface to a complex subsystem.
// It hides the complexities and provides a single entry point.

// ─── USE CASE ───────────────────────────────────────────────
// 1. One-click order processing (Hides Inventory, Payment, Shipping steps)
// 2. Video conversion (Hides Audio extraction, Video compression, Codec setup)
// 3. Home automation (One button for "Movie Mode" that dims lights, turns on TV, lowers blinds)

// ─── EXAMPLE ────────────────────────────────────────────────

// The Complex Subsystems
class Inventory {
  checkStock(item: string) { console.log(`📦 Inventory: Checked stock for ${item}`); return true; }
}
class Payment {
  charge(amount: number) { console.log(`💳 Payment: Charged $${amount}`); return true; }
}
class Shipping {
  ship(item: string) { console.log(`🚚 Shipping: Shipped ${item}`); }
}

// ✅ The Facade
class OrderFacade {
  private inventory = new Inventory();
  private payment = new Payment();
  private shipping = new Shipping();

  // Simplified entry point for the client
  placeOrder(item: string, amount: number) {
    console.log(`🛒 --- Starting order for ${item} ---`);
    if (this.inventory.checkStock(item)) {
      if (this.payment.charge(amount)) {
        this.shipping.ship(item);
        console.log(`✅ Order complete`);
      }
    }
  }
}

// Client Code
const amazonOrder = new OrderFacade();
// The client doesn't need to know about Inventory, Payment, or Shipping
amazonOrder.placeOrder("MacBook Pro", 2000);

// ─── MEMORY TRICK ────────────────────────────────────────────
// Facade = RESTAURANT WAITER.
// You don't go to the kitchen, find the chef, measure ingredients, cook,
// and bring it back. You just tell the Waiter (Facade), and they handle
// the complex Kitchen subsystem for you!
