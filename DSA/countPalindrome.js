/**
 * PROBLEM EXPLANATION:
 * Given a string s, return the number of palindromic substrings in it.
 */

function countSubstrings(s) {
    let count = 0;
    const n = s.length;
  
    function expand(left, right) {
      while (left >= 0 && right < n && s[left] === s[right]) {
        count++;
        left--;
        right++;
      }
    }
  
    for (let i = 0; i < n; i++) {
      expand(i, i);     // odd length
      expand(i, i + 1); // even length
    }
  
    return count;
  }
  