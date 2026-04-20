// ============================================================
// ABSTRACT FACTORY DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Abstract Factory provides an interface for creating FAMILIES
// of related objects WITHOUT specifying their concrete classes.
// It's a "factory of factories."

// ─── USE CASE ───────────────────────────────────────────────
// 1. Cross-platform UI toolkits (Light/Dark theme — matching Button + Checkbox + Modal)
// 2. Cloud providers (AWS vs GCP — matching Storage + DB + Queue services)
// 3. Game worlds (Fantasy vs SciFi — matching characters + weapons + terrain)
// 4. Document exporters (PDF vs Word — matching Header + Body + Footer)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Abstract Products (each part of the family)
interface Button {
  render(): string;
}

interface Checkbox {
  render(): string;
}

// Step 2: Concrete Products for LIGHT theme
class LightButton implements Button {
  render(): string { return "⬜ Light Button rendered"; }
}
class LightCheckbox implements Checkbox {
  render(): string { return "☐ Light Checkbox rendered"; }
}

// Step 3: Concrete Products for DARK theme
class DarkButton implements Button {
  render(): string { return "⬛ Dark Button rendered"; }
}
class DarkCheckbox implements Checkbox {
  render(): string { return "☑ Dark Checkbox rendered"; }
}

// Step 4: Abstract Factory — creates a FAMILY of related objects
interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// Step 5: Concrete Factories — each produces a consistent family
class LightThemeFactory implements UIFactory {
  createButton(): Button { return new LightButton(); }
  createCheckbox(): Checkbox { return new LightCheckbox(); }
}

class DarkThemeFactory implements UIFactory {
  createButton(): Button { return new DarkButton(); }
  createCheckbox(): Checkbox { return new DarkCheckbox(); }
}

// Step 6: Client — works only with abstract types (UIFactory, Button, Checkbox)
class Application {
  private button: Button;
  private checkbox: Checkbox;

  constructor(factory: UIFactory) {
    this.button = factory.createButton();
    this.checkbox = factory.createCheckbox();
  }

  render(): void {
    console.log(this.button.render());
    console.log(this.checkbox.render());
  }
}

// Usage — swap entire theme by changing factory
const lightApp = new Application(new LightThemeFactory());
lightApp.render();
// ⬜ Light Button rendered
// ☐ Light Checkbox rendered

const darkApp = new Application(new DarkThemeFactory());
darkApp.render();
// ⬛ Dark Button rendered
// ☑ Dark Checkbox rendered

// ─── MEMORY TRICK ────────────────────────────────────────────
// Abstract Factory = IKEA catalog.
// You pick a STYLE (factory) and get matching furniture (products).
// Mixing styles is impossible — the factory ensures consistency.

// Factory Method vs Abstract Factory:
// Factory Method → ONE product, subclass decides type
// Abstract Factory → FAMILY of products, all consistent
