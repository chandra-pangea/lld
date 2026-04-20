/**
 * PROBLEM EXPLANATION:
 * Given a string `s` and an integer `k`, you can choose any character of the string and change it to any other uppercase English character at most `k` times. Return the length of the longest substring containing the same letter you can get.
 */

function longestSubstring(s) {
    let left = 0;
    let set = new Set();
    let maxLen = 0;
  
    for (let right = 0; right < s.length; right++) {
      let char = s[right]; // or s.charAt(right)
  
      // If char already in window, shrink left pointer
      while (set.has(char)) {
        set.delete(s[left]);
        left++;
      }
  
      // Add new character to window
      set.add(char);
  
      // Update answer
      maxLen = Math.max(maxLen, right - left + 1);
    }
  
    return maxLen;
  }

  
  function longestSubstring(s) {
    let left = 0;
    let set = new Set();
  
    let maxLen = 0;
    let startIndex = 0;  // stores start index of best substring
  
    for (let right = 0; right < s.length; right++) {
      let char = s[right];
  
      // Shrink window if duplicate found
      while (set.has(char)) {
        set.delete(s[left]);
        left++;
      }
  
      // Add current char to the window
      set.add(char);
  
      // Check if this is new longest window
      if (right - left + 1 > maxLen) {
        maxLen = right - left + 1;
        startIndex = left;
      }
    }
  
    // Return the substring
    return s.substring(startIndex, startIndex + maxLen);
  }
  