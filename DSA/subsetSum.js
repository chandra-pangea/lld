/**
 * PROBLEM EXPLANATION:
 * Given a set of non-negative integers and a value `sum`, determine if there is a subset of the given set with sum equal to given `sum`.
 */

function subsetSum(arr, sum) {
    const n = arr.length;
  
    // dp[i][j] = can we form sum j using first i elements
    const dp = Array.from({ length: n + 1 }, () =>
      Array(sum + 1).fill(false)
    );
  
    // Sum 0 is always possible (empty subset)
    for (let i = 0; i <= n; i++) {
      dp[i][0] = true;
    }
  
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= sum; j++) {
        if (arr[i - 1] <= j) {
          dp[i][j] =
            dp[i - 1][j] ||
            dp[i - 1][j - arr[i - 1]];
        } else {
          dp[i][j] = dp[i - 1][j];
        }
      }
    }
  
    return dp[n][sum];
}
  
console.log(subsetSum([3, 34, 4, 12, 5, 2], 9)) // true
