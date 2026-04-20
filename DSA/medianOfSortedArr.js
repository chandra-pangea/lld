/**
 * PROBLEM EXPLANATION:
 * Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.
 */

function findMedianSortedArrays(nums1, nums2) {
    if (nums1.length > nums2.length) {
      return findMedianSortedArrays(nums2, nums1);
    }
  
    const n = nums1.length;
    const m = nums2.length;
    let low = 0, high = n;
  
    while (low <= high) {
      const i = Math.floor((low + high) / 2);
      const j = Math.floor((n + m + 1) / 2) - i;
  
      const A_left  = i === 0 ? -Infinity : nums1[i - 1];
      const A_right = i === n ? Infinity : nums1[i];
      const B_left  = j === 0 ? -Infinity : nums2[j - 1];
      const B_right = j === m ? Infinity : nums2[j];
  
      if (A_left <= B_right && B_left <= A_right) {
        if ((n + m) % 2 === 0) {
          return (Math.max(A_left, B_left) + Math.min(A_right, B_right)) / 2;
        } else {
          return Math.max(A_left, B_left);
        }
      } 
      else if (A_left > B_right) {
        high = i - 1;
      } 
      else {
        low = i + 1;
      }
    }
  }
  