// ============================================================
// SINGLETON DESIGN PATTERN
// ============================================================

// ─── DEFINITION ─────────────────────────────────────────────
// Singleton ensures a class has only ONE instance and provides
// a global access point to it.
// Key idea: private constructor + static instance variable.

// ─── USE CASE ───────────────────────────────────────────────
// 1. Database connection pool (one shared connection)
// 2. Logger service (single log writer across the app)
// 3. Configuration manager (one global config object)
// 4. Redux/Vuex store (single source of truth)

// ─── EXAMPLE ────────────────────────────────────────────────

class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private connectionString: string;

  // ✅ Private constructor — prevents direct `new DatabaseConnection()`
  private constructor(connectionString: string) {
    this.connectionString = connectionString;
    console.log(`✅ DB connected: ${this.connectionString}`);
  }

  // ✅ Global access point
  public static getInstance(connectionString: string): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(connectionString);
    }
    return DatabaseConnection.instance;
  }

  public query(sql: string): string {
    return `Running: "${sql}" on ${this.connectionString}`;
  }
}

// Usage
const db1 = DatabaseConnection.getInstance("mongodb://localhost:27017/mydb");
const db2 = DatabaseConnection.getInstance("mongodb://localhost:27017/other"); // reuses db1

console.log(db1 === db2); // true — same instance
console.log(db1.query("SELECT * FROM users"));

// ─── MEMORY TRICK ────────────────────────────────────────────
// Think of Singleton like a President — there's only ONE at a time,
// and everyone talks to the same person (global access point).
