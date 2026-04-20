/**
 * PROBLEM EXPLANATION:
 * Given an integer array `nums`, return the length of the longest strictly increasing subsequence.
 */

function lengthOfLIS(nums) {
    if (nums.length === 0) return 0;

    // dp[i] = LIS ending at index i
    const dp = new Array(nums.length).fill(1); 

    for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }

    return Math.max(...dp);
}
