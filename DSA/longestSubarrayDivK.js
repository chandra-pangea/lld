/**
 * PROBLEM EXPLANATION:
 * Given an integer array `nums` and an integer `k`, return the length of the longest subarray whose sum is divisible by `k`.
 */

function longestSubarrayDivByK(arr, k) {
    const map = new Map(); // remainder -> first index
    let prefixSum = 0;
    let maxLen = 0;

    // Base case: remainder 0 at index -1
    map.set(0, -1);

    for (let i = 0; i < arr.length; i++) {
        prefixSum += arr[i];

        // Normalize remainder to handle negatives
        let remainder = ((prefixSum % k) + k) % k;

        if (map.has(remainder)) {
            // Subarray found
            let prevIndex = map.get(remainder);
            maxLen = Math.max(maxLen, i - prevIndex);
        } else {
            // Store first occurrence only
            map.set(remainder, i);
        }
    }

    return maxLen;
}

let arr = [2, 7, 6, 1, 4, 5];
let k = 3;

console.log(longestSubarrayDivByK(arr, k)); // Output: 4
