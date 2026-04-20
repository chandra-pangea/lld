// ============================================================
// CHAIN OF RESPONSIBILITY DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Chain of Responsibility passes requests along a chain of handlers.
// Upon receiving a request, each handler decides either to process it
// or to pass it to the next handler in the chain.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Express.js / Node.js Middleware (Auth -> Logging -> Parsing -> Route)
// 2. Error handling (Fallthrough catching)
// 3. Tech Support levels (Level 1 -> Level 2 -> Level 3 -> Manager)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Base Handler Interface
interface SupportHandler {
  setNext(handler: SupportHandler): SupportHandler;
  handleRequest(issueSeverity: number): string | null;
}

// Step 2: Abstract Base Handler (helps with boilerplate `setNext`)
abstract class AbstractSupportHandler implements SupportHandler {
  private nextHandler: SupportHandler | null = null;

  setNext(handler: SupportHandler): SupportHandler {
    this.nextHandler = handler;
    return handler; // Returning handler allows chaining: a.setNext(b).setNext(c)
  }

  handleRequest(issueSeverity: number): string | null {
    if (this.nextHandler) {
      return this.nextHandler.handleRequest(issueSeverity);
    }
    return null; // End of chain, unhandled
  }
}

// Step 3: Concrete Handlers
class Level1Support extends AbstractSupportHandler {
  handleRequest(severity: number): string | null {
    if (severity === 1) return "✅ L1 Agent resolved the basic issue.";
    return super.handleRequest(severity); // Pass to next
  }
}

class Level2Support extends AbstractSupportHandler {
  handleRequest(severity: number): string | null {
    if (severity === 2) return "🔧 L2 Agent resolved the advanced issue.";
    return super.handleRequest(severity); // Pass to next
  }
}

class ManagerSupport extends AbstractSupportHandler {
  handleRequest(severity: number): string | null {
    if (severity >= 3) return "🚨 Manager stepped in and resolved the critical issue.";
    return super.handleRequest(severity);
  }
}

// Step 4: Client Code
const l1 = new Level1Support();
const l2 = new Level2Support();
const manager = new ManagerSupport();

// Build the chain: L1 -> L2 -> Manager
l1.setNext(l2).setNext(manager);

console.log(l1.handleRequest(1)); // Handled by L1
console.log(l1.handleRequest(2)); // Handled by L2
console.log(l1.handleRequest(5)); // Handled by Manager

// ─── MEMORY TRICK ────────────────────────────────────────────
// Chain of Responsibility = HOT POTATO.
// The request is the hot potato. You check if you can eat it.
// If not, pass it to the person next to you.
