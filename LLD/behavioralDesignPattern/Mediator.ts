// ============================================================
// MEDIATOR DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Mediator reduces chaotic dependencies between objects. Instead of 
// components directly referring to each other, they refer ONLY to a 
// Mediator object, which handles the communication.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Chat rooms (Users don't send messages to User B directly, they send to ChatRoom)
// 2. UI Dialogs (Button click affects a dropdown and a checkbox, mediated by the Form)
// 3. Air Traffic Control (Planes don't talk to planes, they talk to the Tower)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Mediator Interface
interface ChatRoomMediator {
  showMessage(user: User, message: string): void;
}

// Step 2: Concrete Mediator
class ChatRoom implements ChatRoomMediator {
  showMessage(user: User, message: string): void {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${user.getName()}: ${message}`);
  }
}

// Step 3: Components (Colleagues)
class User {
  private name: string;
  private chatMediator: ChatRoomMediator;

  constructor(name: string, mediator: ChatRoomMediator) {
    this.name = name;
    this.chatMediator = mediator;
  }

  getName() { return this.name; }

  // Send delegates to Mediator!
  send(message: string) {
    this.chatMediator.showMessage(this, message);
  }
}

// Step 4: Client Code
const mediator = new ChatRoom();

const john = new User("John", mediator);
const jane = new User("Jane", mediator);

// Users don't know about each other specifically. They just broadcast through mediator.
john.send("Hi Jane!");
jane.send("Hey John! How are you?");

// ─── MEMORY TRICK ────────────────────────────────────────────
// Mediator = AIR TRAFFIC TOWER.
// If Plane A wants to land, it doesn't radio Plane B, C, and D to move.
// Plane A calls the Tower. The Tower tells B, C, D to move.
