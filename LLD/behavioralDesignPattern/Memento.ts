// ============================================================
// MEMENTO DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Memento captures and externalizes an object's internal state so that 
// it can be restored later, ALL WITHOUT violating encapsulation (keeping privates private).

// ─── USE CASE ───────────────────────────────────────────────
// 1. Video game SAVE files / Checkpoints
// 2. Browser History (Back button)
// 3. Undo/Redo mechanisms (storing raw states instead of commands)

// ─── EXAMPLE ────────────────────────────────────────────────

// Step 1: Memento (The Snapshot object - should be immutable)
class EditorState {
  constructor(private readonly content: string) {}
  getContent() { return this.content; }
}

// Step 2: Originator (The Object whose state we want to save)
class TextEditor {
  private content: string = "";

  type(words: string) {
    this.content += words;
  }

  getContent() { return this.content; }

  // 📸 Save state
  save(): EditorState {
    return new EditorState(this.content);
  }

  // ⏪ Restore state
  restore(state: EditorState) {
    this.content = state.getContent();
  }
}

// Step 3: Caretaker (The History Manager - keeps track of Mementos)
class HistoryCaretaker {
  private states: EditorState[] = [];

  push(state: EditorState) {
    this.states.push(state);
  }

  pop(): EditorState | undefined {
    return this.states.pop();
  }
}

// Step 4: Client Code
const editor = new TextEditor();
const history = new HistoryCaretaker();

editor.type("Hello ");
history.push(editor.save()); // Save checkpoint 1

editor.type("World!");
console.log(editor.getContent()); // Hello World!

// Undo!
const lastState = history.pop();
if (lastState) {
  editor.restore(lastState);
}

console.log(editor.getContent()); // Hello 

// ─── MEMORY TRICK ────────────────────────────────────────────
// Memento = SCRAPBOOK POLAROID.
// You take a Polaroid (Memento) of your room (Originator). 
// Later, if the room is messy, you look at the Polaroid and put 
// everything back exactly where it was.

export {};
