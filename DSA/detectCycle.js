/**
 * PROBLEM EXPLANATION:
 * Given a directed/undirected graph, determine if it contains any cycle. Additionally, find the cyclic path if required.
 */

// ---------------------------
// Graph Class (Adjacency List)
// ---------------------------
class Graph {
    constructor(vertices, directed = false) {
        this.V = vertices;
        this.directed = directed;
        this.adj = Array.from({ length: vertices }, () => []);
    }

    addEdge(u, v) {
        this.adj[u].push(v);
        if (!this.directed) {
            this.adj[v].push(u);
        }
    }

    // ---------------------------
    // Cycle Detection for Undirected Graph
    // ---------------------------
    hasCycleUndirected() {
        const visited = new Array(this.V).fill(false);

        const dfs = (v, parent) => {
            visited[v] = true;
            for (const neighbor of this.adj[v]) {
                if (!visited[neighbor]) {
                    if (dfs(neighbor, v)) return true;
                } else if (neighbor !== parent) {
                    return true; // cycle found
                }
            }
            return false;
        };

        for (let i = 0; i < this.V; i++) {
            if (!visited[i] && dfs(i, -1)) return true;
        }

        return false;
    }

    // ---------------------------
    // Cycle Detection for Directed Graph
    // ---------------------------
    hasCycleDirected() {
        const visited = new Array(this.V).fill(false);
        const recStack = new Array(this.V).fill(false);

        const dfs = (v) => {
            visited[v] = true;
            recStack[v] = true;

            for (const neighbor of this.adj[v]) {
                if (!visited[neighbor]) {
                    if (dfs(neighbor)) return true;
                } else if (recStack[neighbor]) {
                    return true; // cycle found
                }
            }

            recStack[v] = false;
            return false;
        };

        for (let i = 0; i < this.V; i++) {
            if (!visited[i] && dfs(i)) return true;
        }

        return false;
    }
}

// ---------------------------
// TEST CASES
// ---------------------------

// Undirected Graph Example
const g1 = new Graph(5, false);
g1.addEdge(0, 1);
g1.addEdge(1, 2);
g1.addEdge(2, 3);
g1.addEdge(3, 4);
g1.addEdge(4, 1); // cycle

console.log("Undirected Graph has cycle:", g1.hasCycleUndirected()); // true

// Directed Graph Example
const g2 = new Graph(4, true);
g2.addEdge(0, 1);
g2.addEdge(1, 2);
g2.addEdge(2, 3);
g2.addEdge(3, 1); // cycle

console.log("Directed Graph has cycle:", g2.hasCycleDirected()); // true

// DAG Example
const g3 = new Graph(4, true);
g3.addEdge(0, 1);
g3.addEdge(1, 2);
g3.addEdge(2, 3);

console.log("Directed Graph (DAG) has cycle:", g3.hasCycleDirected()); // false
