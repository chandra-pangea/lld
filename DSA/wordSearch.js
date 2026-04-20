/**
 * PROBLEM EXPLANATION:
 * Given an `m x n` grid of characters `board` and a string `word`, return true if `word` exists in the grid.
 */

function exist(board, word) {

    const rows = board.length;
    const cols = board[0].length;

    // DFS function to try matching characters
    function dfs(r, c, index) {

        // If we matched all characters, word exists
        if (index === word.length) return true;

        // Out of bounds / mismatch case
        if (
            r < 0 || r >= rows ||
            c < 0 || c >= cols ||
            board[r][c] !== word[index]
        ) {
            return false;
        }

        // Temporarily mark visited
        const temp = board[r][c];
        board[r][c] = '#';

        // Explore 4 directions
        const found =
            dfs(r + 1, c, index + 1) ||
            dfs(r - 1, c, index + 1) ||
            dfs(r, c + 1, index + 1) ||
            dfs(r, c - 1, index + 1);

        // Restore original value (backtrack)
        board[r][c] = temp;

        return found;
    }

    // Try starting DFS from every cell
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (dfs(r, c, 0)) return true;
        }
    }

    return false;
}
const board = [
    ['A','B','C','E'],
    ['S','F','C','S'],
    ['A','D','E','E']
];

console.log(exist(board, "ABCCED")); // true
console.log(exist(board, "SEE"));    // true
console.log(exist(board, "ABCB"));   // false
