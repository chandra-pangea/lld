// ============================================================
// COMPOSITE DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Composite lets you compose objects into tree structures to represent 
// part-whole hierarchies. It lets clients treat individual objects and 
// compositions of objects uniformly.

// ─── USE CASE ───────────────────────────────────────────────
// 1. File system (Directories containing Files and other Directories)
// 2. UI components (A Window contains Panels, Panels contain Buttons)
// 3. Organization charts (Manager contains Employees and other Managers)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Component Interface (Uniform interface for both leaf and composite)
interface FileSystemNode {
  getSize(): number;
  getName(): string;
}

// Step 2: Leaf (Individual object with no children)
class FileNode implements FileSystemNode {
  constructor(private name: string, private size: number) {}

  getName() { return this.name; }
  getSize() { return this.size; }
}

// Step 3: Composite (Container object with children)
class DirectoryNode implements FileSystemNode {
  private children: FileSystemNode[] = [];
  
  constructor(private name: string) {}

  add(node: FileSystemNode) {
    this.children.push(node);
  }

  getName() { return this.name; }
  
  // ✅ Recursive behavior
  getSize() { 
    let totalSize = 0;
    for (const child of this.children) {
      totalSize += child.getSize();
    }
    return totalSize;
  }
}

// Step 4: Client Code
const file1 = new FileNode("video.mp4", 100);
const file2 = new FileNode("script.js", 5);

const folder1 = new DirectoryNode("My Project");
folder1.add(file2);

const rootFolder = new DirectoryNode("Desktop");
rootFolder.add(file1);
rootFolder.add(folder1);

console.log(`Root Size: ${rootFolder.getSize()}MB`); 
// Output: Root Size: 105MB (Automatically drills down)

// ─── MEMORY TRICK ────────────────────────────────────────────
// Composite = MATRYOSHKA DOLLS / FOLDER SYSTEM.
// The outside container looks and acts exactly like what's inside.
// You just call `.getSize()` on the top, and it magically cascades down.
