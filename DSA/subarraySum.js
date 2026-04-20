/**
 * PROBLEM EXPLANATION:
 * Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals to `k`.
 */

function subarraySum(nums, k) {
    const map = new Map();
    map.set(0, 1); // base case
  
    let count = 0;
    let sum = 0;
  
    for (let num of nums) {
      sum += num;
  
      if (map.has(sum - k)) {
        count += map.get(sum - k);
      }
  
      map.set(sum, (map.get(sum) || 0) + 1);
    }
  
    return count;
  }
  