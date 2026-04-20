// ============================================================
// VISITOR DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Visitor lets you separate algorithms from the objects on which they operate.
// Instead of adding `exportJSON()` to every single shape class, you create
// a `JsonExportVisitor` that knows how to visit each type of shape.
// Double Dispatch allows the execution of different logic based on object type.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Document Export (Exporting Tree to PDF, JSON, XML without bloating Tree models)
// 2. Syntax Tree parsers (Walking AST during compilation)
// 3. Tax calculators (Calculating tax for Liquor, Tobacco, Bread - diff formulas)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Element Interface (Must accept a visitor)
interface FileElement {
  accept(v: Visitor): void;
}

// Step 2: Concrete Elements
class DocumentFile implements FileElement {
  // Element doesn't know WHAT the visitor does, it just welcomes it.
  accept(v: Visitor): void {
    v.visitDocument(this); 
  }
  getText() { return "Dear John, attached is the contract..."; }
}

class ImageFile implements FileElement {
  accept(v: Visitor): void {
    v.visitImage(this);
  }
  getPixels() { return "[Binary Pixel Data]"; }
}

// Step 3: Visitor Interface (Declares a visit method for EVERY element type)
interface Visitor {
  visitDocument(doc: DocumentFile): void;
  visitImage(img: ImageFile): void;
}

// Step 4: Concrete Visitors (The separated logic)
class SizeCalculatorVisitor implements Visitor {
  visitDocument(doc: DocumentFile): void {
    console.log(`📏 Calculated Document text length: ${doc.getText().length} chars`);
  }
  visitImage(img: ImageFile): void {
    console.log(`📏 Calculated Image pixel count: ${img.getPixels().length} bytes`);
  }
}

class ZipExportVisitor implements Visitor {
  visitDocument(doc: DocumentFile): void {
    console.log(`🗜 Zipping text data: ${doc.getText()}`);
  }
  visitImage(img: ImageFile): void {
    console.log(`🗜 Compressing image pixels...`);
  }
}

// Step 5: Client Code
const elements: FileElement[] = [new DocumentFile(), new ImageFile()];

const sizeCalc = new SizeCalculatorVisitor();
const zipExport = new ZipExportVisitor();

// We iterate over elements, and ask them to accept a behaviour.
console.log("--- Calculating Sizes ---");
for (const el of elements) {
  el.accept(sizeCalc); 
}

console.log("\n--- Exporting to Zip ---");
for (const el of elements) {
  el.accept(zipExport);
}

// ─── MEMORY TRICK ────────────────────────────────────────────
// Visitor = TAXI DRIVER.
// A person (Element) says to the Taxi Driver (Visitor): "Accept me!"
// The Taxi Driver then asks: "Are you a VIP (Document) or Normal (Image)?"
// Based on who you are, the Driver executes different route logic (visit doc vs visit img).
