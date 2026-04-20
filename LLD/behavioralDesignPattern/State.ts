// ============================================================
// STATE DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// State allows an object to alter its behavior when its internal state changes.
// The object will appear to change its class.
// It replaces massive `if/else` or `switch` statements for state-dependent logic.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Media Player (Play button acts diff if status is Playing vs Paused)
// 2. Document workflow (Draft -> Review -> Published)
// 3. Vending Machines (NoCoinState -> HasCoinState -> DispensingState)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: State Interface
interface VendingMachineState {
  insertCoin(): void;
  ejectCoin(): void;
  dispense(): void;
}

// Step 2: Context (The Vending Machine itself)
class VendingMachine {
  public defaultState = new NoCoinState(this);
  public hasCoinState = new HasCoinState(this);
  
  private currentState: VendingMachineState;

  constructor() {
    this.currentState = this.defaultState; // Initial Start State
  }

  setState(state: VendingMachineState) {
    this.currentState = state;
  }

  // Delegate actions to the current State class
  insertCoin() { this.currentState.insertCoin(); }
  ejectCoin() { this.currentState.ejectCoin(); }
  dispense() { this.currentState.dispense(); }
}

// Step 3: Concrete States
class NoCoinState implements VendingMachineState {
  constructor(private machine: VendingMachine) {}

  insertCoin(): void {
    console.log("🪙 Coin inserted.");
    this.machine.setState(this.machine.hasCoinState);
  }
  ejectCoin(): void { console.log("⚠️ No coin to eject."); }
  dispense(): void { console.log("⚠️ Please insert a coin first."); }
}

class HasCoinState implements VendingMachineState {
  constructor(private machine: VendingMachine) {}

  insertCoin(): void { console.log("⚠️ Already has a coin."); }
  ejectCoin(): void {
    console.log("🪙 Coin ejected.");
    this.machine.setState(this.machine.defaultState);
  }
  dispense(): void {
    console.log("🥤 Dispensing soda...");
    this.machine.setState(this.machine.defaultState); // Reset to empty
  }
}

// Step 4: Client Code
const machine = new VendingMachine();

machine.dispense();   // ⚠️ Please insert a coin first.
machine.insertCoin(); // 🪙 Coin inserted. (State changes!)
machine.insertCoin(); // ⚠️ Already has a coin.
machine.dispense();   // 🥤 Dispensing soda... (State resets)

// ─── MEMORY TRICK ────────────────────────────────────────────
// State = SMARTPHONE MODES.
// The "Volume Up" button behaves differently based on mode (state):
// - Ringer Mode: Increases ring volume
// - Media Mode: Increases video volume
// - Silent Mode: Does nothing at all
// Behavior changes based on State, without massive IF statements!
