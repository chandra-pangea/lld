// ============================================================
// PROTOTYPE DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Prototype lets you clone existing objects without coupling
// your code to their classes. The object itself knows how to copy itself.
// Uses a `clone()` method to copy the object.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Duplicating game characters with presets (copy a "Warrior" template)
// 2. Cloning complex API request configurations
// 3. Copying document templates in editors (Word, Notion)
// 4. Spawning monsters/NPCs from a prototype in games

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Define a Prototype interface
interface Cloneable<T> {
  clone(): T;
}

// Step 2: Concrete Prototype
class GameCharacter implements Cloneable<GameCharacter> {
  name: string;
  level: number;
  skills: string[];
  weapon: { name: string; damage: number };

  constructor(
    name: string,
    level: number,
    skills: string[],
    weapon: { name: string; damage: number }
  ) {
    this.name = name;
    this.level = level;
    this.skills = skills;
    this.weapon = weapon;
  }

  // ✅ Deep clone — creates a new object with copied nested references
  clone(): GameCharacter {
    return new GameCharacter(
      this.name,
      this.level,
      [...this.skills],           // deep copy array
      { ...this.weapon }          // deep copy nested object
    );
  }

  describe(): void {
    console.log(
      `⚔️  ${this.name} | Lvl ${this.level} | Skills: [${this.skills.join(", ")}] | Weapon: ${this.weapon.name} (${this.weapon.damage} dmg)`
    );
  }
}

// Usage
const warriorPrototype = new GameCharacter(
  "Warrior",
  1,
  ["Slash", "Block"],
  { name: "Iron Sword", damage: 50 }
);

// Clone and customize — NO need to call the complex constructor
const warrior1 = warriorPrototype.clone();
warrior1.name = "Chandra";
warrior1.level = 10;
warrior1.skills.push("Whirlwind");

const warrior2 = warriorPrototype.clone();
warrior2.name = "Bot-Warrior";
warrior2.weapon.damage = 80; // only affects warrior2 (deep copy!)

warriorPrototype.describe();
// ⚔️  Warrior | Lvl 1 | Skills: [Slash, Block] | Weapon: Iron Sword (50 dmg)

warrior1.describe();
// ⚔️  Chandra | Lvl 10 | Skills: [Slash, Block, Whirlwind] | Weapon: Iron Sword (50 dmg)

warrior2.describe();
// ⚔️  Bot-Warrior | Lvl 1 | Skills: [Slash, Block] | Weapon: Iron Sword (80 dmg)

// ─── MEMORY TRICK ────────────────────────────────────────────
// Prototype = COOKIE CUTTER 🍪
// You have one master cookie shape (prototype), press it on dough (clone),
// then decorate each cookie differently — without remaking the cutter.

// ⚠️  KEY POINT: Shallow copy vs Deep copy
// Shallow copy → nested objects are still SHARED (reference)
// Deep copy    → nested objects are INDEPENDENT (new copy)
// Always deep-copy nested structures to avoid bugs!
