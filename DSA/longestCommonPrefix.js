/**
 * PROBLEM EXPLANATION:
 * Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.
 */

function longestCommonPrefix(strs) {
    if (strs.length === 0) return "";
  
    // Loop over characters of the first string
    for (let i = 0; i < strs[0].length; i++) {
      const char = strs[0][i];  // character to compare
  
      // Compare with same position in other strings
      for (let j = 1; j < strs.length; j++) {
        // If mismatch or string is shorter → return prefix up to i
        if (i >= strs[j].length || strs[j][i] !== char) {
          return strs[0].slice(0, i);
        }
      }
    }
  
    // All characters matched → whole first string is prefix
    return strs[0];
  }
  const words = ["flower", "flow", "flight"];
console.log(longestCommonPrefix(words)); // Output: "fl"
