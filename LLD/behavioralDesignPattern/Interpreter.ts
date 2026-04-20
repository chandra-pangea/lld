// ============================================================
// INTERPRETER DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Interpreter implements a specialized computer language to rapidly solve 
// a specific set of problems. It defines a grammar, and an interpreter that
// uses that grammar to parse and interpret sentences/expressions.

// ─── USE CASE ───────────────────────────────────────────────
// 1. SQL query parsers
// 2. Regex evaluators
// 3. Calculator / Mathematical expression evaluation

// ─── EXAMPLE ────────────────────────────────────────────────

// Context: Holds global state/variables if needed
class Context {
  // Can hold variable bindings, e.g. { 'x': 5, 'y': 10 }
}

// Step 1: Abstract Expression
interface Expression {
  interpret(context: Context): number;
}

// Step 2: Terminal Expression (Leaf node)
class NumberExpression implements Expression {
  constructor(private number: number) {}
  
  interpret(context: Context): number {
    return this.number;
  }
}

// Step 3: Non-Terminal Expression (Tree branch)
class AddExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}

  interpret(context: Context): number {
    return this.left.interpret(context) + this.right.interpret(context);
  }
}

class SubtractExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}

  interpret(context: Context): number {
    return this.left.interpret(context) - this.right.interpret(context);
  }
}

// Step 4: Client Code
const context = new Context();

// We want to evaluate: (5 + 10) - 2
// Tree: Subtract( Add(5, 10), 2 )
const five = new NumberExpression(5);
const ten = new NumberExpression(10);
const two = new NumberExpression(2);

const additionPhase = new AddExpression(five, ten); // 15
const finalTree = new SubtractExpression(additionPhase, two); // 13

const result = finalTree.interpret(context);
console.log(`Evaluating (5 + 10) - 2 = ${result}`);

// ─── MEMORY TRICK ────────────────────────────────────────────
// Interpreter = SHEET MUSIC PLAYING.
// The Notes (Grammar) are drawn on paper (Syntax Tree).
// The Musician (Interpreter) reads the tree from left to right, 
// translating notes into sounds (Result).
