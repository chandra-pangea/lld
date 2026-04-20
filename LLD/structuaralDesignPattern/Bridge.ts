// ============================================================
// BRIDGE DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Bridge lets you split a large class or a set of closely related classes
// into two separate hierarchies — abstraction and implementation — 
// which can be developed independently. Decouples "What it is" from "What it does".

// ─── USE CASE ───────────────────────────────────────────────
// 1. Cross-platform apps (UI components vs OS-specific rendering APIs)
// 2. Messaging systems (Message types: SMS, Email vs Sender Providers: AWS, Twilio)
// 3. Device remote controls (Remote types vs Device types)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Implementation Interface (The "What it does")
interface Device {
  turnOn(): void;
  turnOff(): void;
  setVolume(percent: number): void;
}

// Step 2: Concrete Implementations
class TV implements Device {
  turnOn() { console.log("📺 TV turned ON"); }
  turnOff() { console.log("📺 TV turned OFF"); }
  setVolume(p: number) { console.log(`📺 TV volume set to ${p}%`); }
}

class Radio implements Device {
  turnOn() { console.log("📻 Radio turned ON"); }
  turnOff() { console.log("📻 Radio turned OFF"); }
  setVolume(p: number) { console.log(`📻 Radio volume set to ${p}%`); }
}

// Step 3: Abstraction (The "What it is" - uses the Implementation)
class RemoteControl {
  protected device: Device; // ✅ The Bridge

  constructor(device: Device) {
    this.device = device;
  }

  togglePower(isOn: boolean) {
    isOn ? this.device.turnOn() : this.device.turnOff();
  }
}

// Step 4: Refined Abstraction
class AdvancedRemoteControl extends RemoteControl {
  mute() {
    console.log("🔇 Advanced Remote: Muting device");
    this.device.setVolume(0);
  }
}

// Step 5: Client Code
const myTV = new TV();
const basicRemote = new RemoteControl(myTV);
basicRemote.togglePower(true);

const myRadio = new Radio();
const advancedRemote = new AdvancedRemoteControl(myRadio);
advancedRemote.togglePower(true);
advancedRemote.mute();

// ─── MEMORY TRICK ────────────────────────────────────────────
// Bridge = CARTESIAN PRODUCT KILLER.
// Instead of 2 Remotes x 3 Devices = 6 classes (TvBasicRemote, RadioAdvancedRemote, etc.),
// You have 2 Remotes + 3 Devices = 5 classes. 
// Composition over inheritance!
