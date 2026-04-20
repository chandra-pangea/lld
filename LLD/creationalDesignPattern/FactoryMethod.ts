// ============================================================
// FACTORY METHOD DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Factory Method defines an interface for creating an object,
// but lets SUBCLASSES decide which class to instantiate.
// The creator doesn't know what exact object it creates — it delegates.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Notification service (Email / SMS / Push — same interface, different impl)
// 2. Payment gateway (Stripe, PayPal, Razorpay — same checkout flow)
// 3. Database drivers (MySQL, MongoDB, PostgreSQL)
// 4. UI buttons across platforms (Web, Android, iOS)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Define the Product interface
interface Notification {
  send(message: string): void;
}

// Step 2: Concrete Products
class EmailNotification implements Notification {
  send(message: string): void {
    console.log(`📧 Email sent: ${message}`);
  }
}

class SMSNotification implements Notification {
  send(message: string): void {
    console.log(`📱 SMS sent: ${message}`);
  }
}

class PushNotification implements Notification {
  send(message: string): void {
    console.log(`🔔 Push notification sent: ${message}`);
  }
}

// Step 3: Creator — uses Factory Method
abstract class NotificationFactory {
  // ✅ Factory Method — subclasses override this
  abstract createNotification(): Notification;

  // Business logic stays in the base class
  notify(message: string): void {
    const notification = this.createNotification();
    notification.send(message);
  }
}

// Step 4: Concrete Creators (subclasses decide the product)
class EmailFactory extends NotificationFactory {
  createNotification(): Notification {
    return new EmailNotification();
  }
}

class SMSFactory extends NotificationFactory {
  createNotification(): Notification {
    return new SMSNotification();
  }
}

class PushFactory extends NotificationFactory {
  createNotification(): Notification {
    return new PushNotification();
  }
}

// Step 5: Client code — only talks to the abstract creator
function sendAlert(factory: NotificationFactory, msg: string) {
  factory.notify(msg);
}

sendAlert(new EmailFactory(), "Your OTP is 1234");
sendAlert(new SMSFactory(), "Your OTP is 1234");
sendAlert(new PushFactory(), "New message from Chandra!");

// ─── MEMORY TRICK ────────────────────────────────────────────
// Think of Factory Method like a PIZZA FRANCHISE —
// The parent company (creator) defines "make pizza",
// but each outlet (subclass) decides what toppings to use.
