/**
 * PROBLEM EXPLANATION:
 * Find the shortest path from a source node to a destination node in an unweighted/weighted graph.
 */

const grid = [
    [0, 0, 0, 1],
    [1, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 0, 0]
  ]
  
const start = (0, 0)
const end   = (3, 3)
  
function shortestPath(grid, start, end) {
    const rows = grid.length;
    const cols = grid[0].length;
  
    const [sr, sc] = start;
    const [er, ec] = end;
  
    // Edge cases
    if (grid[sr][sc] === 1 || grid[er][ec] === 1) return -1;
  
    const directions = [
      [1, 0],  // down
      [-1, 0], // up
      [0, 1],  // right
      [0, -1]  // left
    ];
  
    const visited = Array.from({ length: rows }, () =>
      Array(cols).fill(false)
    );
  
    const queue = [];
    queue.push([sr, sc, 0]);
    visited[sr][sc] = true;
  
    while (queue.length) {
      const [r, c, dist] = queue.shift();
  
      if (r === er && c === ec) {
        return dist;
      }
  
      for (let [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
  
        if (
          nr >= 0 && nr < rows &&
          nc >= 0 && nc < cols &&
          grid[nr][nc] === 0 &&
          !visited[nr][nc]
        ) {
          visited[nr][nc] = true;
          queue.push([nr, nc, dist + 1]);
        }
      }
    }
  
    return -1; // no path found
  }
  



console.log(shortestPath(grid, [0, 0], [3, 3]));
  