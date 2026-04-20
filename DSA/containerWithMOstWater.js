/**
 * PROBLEM EXPLANATION:
 * You are given an integer array `height` of length n. Find two lines that together with the x-axis form a container such that the container contains the most water.
 */

function maxArea(height) {
    let left = 0;
    let right = height.length - 1;
    let maxArea = 0;
  
    while (left < right) {
      // Width
      const width = right - left;
  
      // Height = the smaller line
      const h = Math.min(height[left], height[right]);
  
      // Calculate area
      const currArea = width * h;
  
      // Track maximum
      maxArea = Math.max(maxArea, currArea);
  
      // Move the pointer with smaller height
      if (height[left] < height[right]) {
        left++;
      } else {
        right--;
      }
    }
  
    return maxArea;
  }
console.log(maxArea([1,8,6,2,5,4,8,3,7]))