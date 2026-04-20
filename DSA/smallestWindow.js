/**
 * PROBLEM EXPLANATION:
 * Given two strings `s` and `t`, return the minimum window substring of `s` such that every character in `t` is included in the window.
 */

function minWindow(s, t) {
    // If target string is longer than source, no valid window possible
    if (t.length > s.length) return "";

    // Frequency map of characters needed from string t
    const need = new Map();
    for (let ch of t) {
        need.set(ch, (need.get(ch) || 0) + 1);
    }

    // Left pointer of sliding window
    let left = 0;

    // Count of characters that currently satisfy required frequency
    let have = 0;

    // Number of unique characters needed
    let needCount = need.size;

    // Frequency map for current window
    const window = new Map();

    // Store result window indices [start, end]
    let res = [-1, -1];

    // Track minimum window length found so far
    let minLen = Infinity;

    // Expand window using right pointer
    for (let right = 0; right < s.length; right++) {
        let ch = s[right];

        // Add current character to window frequency
        window.set(ch, (window.get(ch) || 0) + 1);

        // If character is needed and its frequency matches requirement
        if (need.has(ch) && window.get(ch) === need.get(ch)) {
            have++;
        }

        // When all required characters are satisfied, try shrinking window
        while (have === needCount) {

            // Update result if current window is smaller
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                res = [left, right];
            }

            // Remove the leftmost character from window
            let leftChar = s[left];
            window.set(leftChar, window.get(leftChar) - 1);

            // If removing this character breaks the required frequency
            if (need.has(leftChar) && window.get(leftChar) < need.get(leftChar)) {
                have--;
            }

            // Move left pointer to shrink window
            left++;
        }
    }

    // If no valid window found, return empty string
    return minLen === Infinity ? "" : s.slice(res[0], res[1] + 1);
}
