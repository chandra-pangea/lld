// ============================================================
// ADAPTER DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Adapter allows classes with incompatible interfaces to work together.
// It wraps an existing class with a new interface so that it becomes
// compatible with the client's code.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Integrating a 3rd party library where the data format differs (e.g. XML to JSON)
// 2. Wrapping legacy code to match a modern interface
// 3. Different payment gateways (Stripe vs Razorpay) adapted into one uniform `pay()` method

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Target Interface (What the client expects)
interface ModernPaymentGateway {
  payInDollars(amount: number): void;
}

// Step 2: The Adaptee (Legacy or 3rd party class with unmatching interface)
class OldIndianBankAPI {
  processPaymentInRupees(amountInRupees: number): void {
    console.log(`🏦 Old API: Processed ₹${amountInRupees}`);
  }
}

// Step 3: The Adapter (Maps the target interface to the adaptee's interface)
class PaymentAdapter implements ModernPaymentGateway {
  private oldAPI: OldIndianBankAPI;
  private readonly USD_TO_INR = 80; // Conversion rate

  constructor(oldAPI: OldIndianBankAPI) {
    this.oldAPI = oldAPI;
  }

  // ✅ Maps `payInDollars` directly to `processPaymentInRupees`
  payInDollars(amount: number): void {
    console.log(`🔄 Adapter: Converting $${amount} to INR...`);
    const equivalentRupees = amount * this.USD_TO_INR;
    this.oldAPI.processPaymentInRupees(equivalentRupees);
  }
}

// Step 4: Client Code
function checkout(gateway: ModernPaymentGateway) {
  // Client only knows about payInDollars
  gateway.payInDollars(100); 
}

const legacyAPI = new OldIndianBankAPI();
const adapter = new PaymentAdapter(legacyAPI);

checkout(adapter);
// 🔄 Adapter: Converting $100 to INR...
// 🏦 Old API: Processed ₹8000

// ─── MEMORY TRICK ────────────────────────────────────────────
// Adapter = TRAVEL POWER PLUG ADAPTER.
// You have a US laptop plug (Target), but you're in India (Adaptee plug).
// The Adapter connects the two without breaking either side.
