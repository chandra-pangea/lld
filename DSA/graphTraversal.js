/**
 * PROBLEM EXPLANATION:
 * Implement standard graph traversal algorithms (Breadth-First Search and Depth-First Search).
 */

const graph = {
    A: ["B", "C"],
    B: ["D", "E"],
    C: ["F"],
    D: [],
    E: ["F"],
    F: []
};

function dfs(graph, node, visited = new Set()) {
    if (visited.has(node)) return;
    
    console.log(node);  // process node
    visited.add(node);

    for (let neighbor of graph[node]) {
        dfs(graph, neighbor, visited);
    }
}

function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];

    visited.add(start);

    while (queue.length) {
        const node = queue.shift();
        console.log(node);

        for (let neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
}


console.log("DFS:");
dfs(graph, "A");

console.log("BFS:");
bfs(graph, "A");
