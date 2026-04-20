/**
 * PROBLEM EXPLANATION:
 * There is an integer array `nums` sorted in ascending order (with distinct values). It is rotated at an unknown pivot. Given the array `nums` and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not.
 */

var search = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);

        // Target found
        if (nums[mid] === target) {
            return mid;
        }

        // Left half is sorted
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // Right half is sorted
        else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1;
};


let nums = [4,5,6,7,0,1,2]
let target = 0;

console.log(search(nums, target));
