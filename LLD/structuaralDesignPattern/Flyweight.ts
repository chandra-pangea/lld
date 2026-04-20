// ============================================================
// FLYWEIGHT DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Flyweight aims to minimize RAM usage by sharing common parts of state 
// among multiple objects instead of keeping all data in each object.
// Shared state = Intrinsic. Unique state = Extrinsic.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Rendering forests in games (Millions of trees sharing the same 3D mesh and texture)
// 2. Text editors (Millions of characters sharing font/glyph data)
// 3. Caching icon/image assets in UI lists

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Intrinsic State (Shared, Immutable)
class TreeType {
  constructor(public name: string, public color: string, public texture: string) {}
  
  draw(canvas: string, x: number, y: number) {
    console.log(`🌲 Drawing ${this.name} (${this.color}) at [${x}, ${y}]`);
  }
}

// Step 2: Flyweight Factory (Manages shared state instances)
class TreeFactory {
  private static treeTypes: { [key: string]: TreeType } = {};

  static getTreeType(name: string, color: string, texture: string): TreeType {
    const key = `${name}-${color}-${texture}`;
    if (!this.treeTypes[key]) {
      this.treeTypes[key] = new TreeType(name, color, texture);
      console.log(`✨ Created new TreeType: ${key}`);
    }
    return this.treeTypes[key];
  }
}

// Step 3: Extrinsic State (Context - not shared, stored outside)
class Tree {
  // Tree instance only stores coords, + a REFERENCE to the shared type
  constructor(public x: number, public y: number, public type: TreeType) {}

  draw(canvas: string) {
    this.type.draw(canvas, this.x, this.y);
  }
}

// Step 4: Client Code
class Forest {
  private trees: Tree[] = [];

  plantTree(x: number, y: number, name: string, color: string, texture: string) {
    // Factory determines if we reuse or create
    const type = TreeFactory.getTreeType(name, color, texture);
    const tree = new Tree(x, y, type);
    this.trees.push(tree);
  }

  draw() {
    for (const tree of this.trees) { tree.draw("Screen"); }
  }
}

const forest = new Forest();
forest.plantTree(10, 20, "Oak", "Green", "OakTx"); // Creates Oak
forest.plantTree(50, 60, "Oak", "Green", "OakTx"); // Reuses Oak
forest.plantTree(30, 40, "Pine", "DarkGreen", "PineTx"); // Creates Pine

// ─── MEMORY TRICK ────────────────────────────────────────────
// Flyweight = APARTMENT WIFI.
// Instead of 100 residents buying 100 individual routers (heavy RAM),
// the building buys 1 powerful router (Shared Intrinsic State) 
// and 100 people just have their own unique passwords (Extrinsic State).
