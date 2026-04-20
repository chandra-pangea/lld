/**
 * PROBLEM EXPLANATION:
 * Given two strings, find the length of their Longest Common Subsequence (LCS).
 */

function lcsLength(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    res=""
    const memo = Array.from({ length: m }, () => Array(n).fill(-1));
  
    function dfs(i, j) {
      if (i === m || j === n) return 0;
  
      if (memo[i][j] !== -1) return memo[i][j];
  
        if (text1[i] === text2[j]) {
          res+=text1[i]
        memo[i][j] = 1 + dfs(i + 1, j + 1);
      } else {
        memo[i][j] = Math.max(
          dfs(i + 1, j),
          dfs(i, j + 1)
        );
      }
  
      return memo[i][j];
    }
    dfs(0, 0);
    return res
  }
  
console.log(lcsLength("abcde", "ace")); // "ace"
  