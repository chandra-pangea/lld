// ============================================================
// OBSERVER DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Observer defines a one-to-many dependency so that when one object 
// changes state, all its dependents (observers) are notified and updated automatically.
// The core of the Publish-Subscribe system.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Mailing lists / Newsletters (Subscribers get notified on new issues)
// 2. React / Vue UI reactivity (State changes, Component re-renders)
// 3. Event listeners in DOM (`button.addEventListener('click', handler)`)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Observer Interface (The Subscriber)
interface Observer {
  update(temperature: number): void;
}

// Step 2: Subject Interface (The Publisher)
interface Subject {
  subscribe(ob: Observer): void;
  unsubscribe(ob: Observer): void;
  notify(): void;
}

// Step 3: Concrete Subject
class WeatherStation implements Subject {
  private observers: Observer[] = [];
  private temperature: number = 0;

  subscribe(ob: Observer): void {
    this.observers.push(ob);
  }

  unsubscribe(ob: Observer): void {
    this.observers = this.observers.filter((o) => o !== ob);
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.temperature);
    }
  }

  // When state changes, we automatically notify everyone!
  setTemperature(temp: number) {
    console.log(`\n⛅ WeatherStation: New temperature is ${temp}°C`);
    this.temperature = temp;
    this.notify();
  }
}

// Step 4: Concrete Observers
class PhoneDisplay implements Observer {
  update(temperature: number): void {
    console.log(`📱 Phone: Temp is now ${temperature}°C`);
  }
}

class WindowDisplay implements Observer {
  update(temperature: number): void {
    console.log(`🪟 Window LED: It's ${temperature}°C outside`);
  }
}

// Step 5: Client Code
const station = new WeatherStation();

const myPhone = new PhoneDisplay();
const myWindow = new WindowDisplay();

// Subscribing
station.subscribe(myPhone);
station.subscribe(myWindow);

// Simulate change
station.setTemperature(25);
// Phone and Window instantly react!

// Someone un-subscribes
station.unsubscribe(myWindow);
station.setTemperature(30); 
// Only Phone reacts

// ─── MEMORY TRICK ────────────────────────────────────────────
// Observer = YOUTUBE SUBSCRIBERS.
// Channel (Subject) uploads video -> Clicks "Notify All".
// You, me, and John (Observers) instantly get a push notification.
