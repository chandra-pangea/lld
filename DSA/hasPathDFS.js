/**
 * PROBLEM EXPLANATION:
 * Given a graph and two vertexes, return true if there is a path from the first node to the second node using DFS.
 */

function hasPathDFS(maze, start, end) {
    const rows = maze.length;
    const cols = maze[0].length;
  
    const [sr, sc] = start;
    const [er, ec] = end;
  
    if (maze[sr][sc] === 1 || maze[er][ec] === 1) return false;
  
    const visited = Array.from({ length: rows }, () =>
      Array(cols).fill(false)
    );
  
    const directions = [
      [1, 0],  // down
      [-1, 0], // up
      [0, 1],  // right
      [0, -1]  // left
    ];
  
    function dfs(r, c) {
      if (r === er && c === ec) return true;
  
      visited[r][c] = true;
  
      for (let [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
  
        if (
          nr >= 0 && nr < rows &&
          nc >= 0 && nc < cols &&
          maze[nr][nc] === 0 &&
          !visited[nr][nc]
        ) {
          if (dfs(nr, nc)) return true;
        }
      }
      return false;
    }
  
    return dfs(sr, sc);
  }
  const maze = [
    [0, 1, 0],
    [0, 0, 0],
    [1, 0, 0]
  ];
  
  console.log(hasPathDFS(maze, [0, 0], [2, 2]));  