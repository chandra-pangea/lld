// ============================================================
// COMMAND DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Command turns a request into a stand-alone object containing all info
// about the request. This lets you parameterize methods with diff requests,
// delay or queue a request's execution, and support UNDOable operations.

// ─── USE CASE ───────────────────────────────────────────────
// 1. UI Buttons / Menus (Clicking a button wraps the action into a Command)
// 2. Undo / Redo functionality in text editors
// 3. Task Queuing / Background jobs (Queueing commands to execute later)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Command Interface
interface Command {
  execute(): void;
  undo(): void;
}

// Step 2: The Receiver (Actual business logic)
class SmartBulb {
  turnOn() { console.log("💡 Bulb is ON"); }
  turnOff() { console.log("⬛ Bulb is OFF"); }
}

// Step 3: Concrete Commands
class TurnOnCommand implements Command {
  constructor(private bulb: SmartBulb) {}
  execute() { this.bulb.turnOn(); }
  undo() { this.bulb.turnOff(); }
}

class TurnOffCommand implements Command {
  constructor(private bulb: SmartBulb) {}
  execute() { this.bulb.turnOff(); }
  undo() { this.bulb.turnOn(); }
}

// Step 4: The Invoker (Stores and triggers commands)
class RemoteControl {
  private history: Command[] = [];

  executeCommand(command: Command) {
    command.execute();
    this.history.push(command); // Save for undo
  }

  undoButton() {
    const command = this.history.pop();
    if (command) {
      console.log("⏪ Undoing last action:");
      command.undo();
    } else {
      console.log("No actions to undo.");
    }
  }
}

// Step 5: Client Code
const bulb = new SmartBulb();
const onCommand = new TurnOnCommand(bulb);
const offCommand = new TurnOffCommand(bulb);

const remote = new RemoteControl();

remote.executeCommand(onCommand);  // 💡 ON
remote.executeCommand(offCommand); // ⬛ OFF
remote.undoButton();               // 💡 ON (Undo off means on!)

// ─── MEMORY TRICK ────────────────────────────────────────────
// Command = RESTAURANT ORDER SLIP.
// Waiter writes your order on a slip (Command Object), puts it on a wheel.
// Chef (Receiver) reads the slip later. Waiter doesn't cook, 
// just transfers the "Order Object".
