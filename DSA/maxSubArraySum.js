/**
 * PROBLEM EXPLANATION:
 * Given an integer array `nums`, find the subarray with the largest sum, and return its sum (Kadane's Algorithm).
 */

function maxSubarraySum(arr) {
    let currentSum = arr[0];
    let maxSum = arr[0];

    for (let i = 1; i < arr.length; i++) {
        currentSum = Math.max(arr[i], currentSum + arr[i]);
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}
console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6


function maxSubarray(arr) {
    let maxSum = arr[0];
    let currentSum = arr[0];
    let start = 0, end = 0, tempStart = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > currentSum + arr[i]) {
            currentSum = arr[i];
            tempStart = i;
        } else {
            currentSum += arr[i];
        }

        if (currentSum > maxSum) {
            maxSum = currentSum;
            start = tempStart;
            end = i;
        }
    }

    return { maxSum, subarray: arr.slice(start, end + 1) };
}

console.log(maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));

