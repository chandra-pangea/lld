/**
 * PROBLEM EXPLANATION:
 * Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.
 */

function rotateLeft(arr, k) {
    k = k % arr.length;
    return arr.slice(k).concat(arr.slice(0, k));
}


function rotateRight(arr, k) {
    k = k % arr.length; // avoid overshifting
    return arr.slice(-k).concat(arr.slice(0, -k));
}


console.log(rotateRight([1,2,3,4,5,6,7], 3));
console.log(rotateLeft([1,2,3,4,5,6,7], 3));
// [5,6,7,1,2,3,4]

// ⭐ Method 2: Reverse Algorithm (In-place, optimal)

// This is important — interviewers LOVE this method.

// Right Rotate:

// Steps:

// Reverse whole array

// Reverse first k elements

// Reverse remaining n-k elements


function reverse(arr, left, right) {
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
}

function rotateRightInPlace(arr, k) {
    k = k % arr.length;

    reverse(arr, 0, arr.length - 1);
    reverse(arr, 0, k - 1);
    reverse(arr, k, arr.length - 1);

    return arr;
}
