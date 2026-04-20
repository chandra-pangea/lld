/**
 * PROBLEM EXPLANATION:
 * Given n nodes and a list of undirected edges, find the number of connected components in the graph.
 */

// adjacency list
const graph = {
    0: [1, 2],
    1: [0, 2],
    2: [0, 1],
    3: [4],
    4: [3]
};
  

function connectedComponents(graph) {
    const visited = new Set();
    let count = 0;
  
    function dfs(node) {
      visited.add(node);
      for (let nei of graph[node]) {
        if (!visited.has(nei)) {
          dfs(nei);
        }
      }
    }
  
    for (let node in graph) {
      if (!visited.has(node)) {
        dfs(node);
        count++;
      }
    }
  
    return count;
  }
  
  console.log(connectedComponents(graph))