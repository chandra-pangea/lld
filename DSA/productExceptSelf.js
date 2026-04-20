/**
 * PROBLEM EXPLANATION:
 * Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.
 */

function productExceptSelf(nums) {
    let n = nums.length;
    let res = new Array(n).fill(1);

    // Step 1: compute prefix product
    let prefix = 1;
    for (let i = 0; i < n; i++) {
        res[i] = prefix;
        prefix *= nums[i];
    }

    let suffix = 1;
    for (let i = n - 1; i >= 0; i--) {
        res[i] *= suffix;
        suffix *= nums[i];
    }

    return res;
}

console.log(productExceptSelf([1,2,3,4])); 