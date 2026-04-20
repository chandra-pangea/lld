/**
 * PROBLEM EXPLANATION:
 * Given an array of integers `heights` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.
 */

var largestRectangleArea = function(heights) {
    let stack = [];       // Stack to store indices of bars (monotonic increasing)
    let maxArea = 0;      // Stores maximum rectangle area found

    // Add a sentinel bar of height 0
    // This forces all bars in stack to be processed at the end
    heights.push(0);

    // Iterate through all bars
    for (let i = 0; i < heights.length; i++) {

        // While current bar is smaller than the bar at stack top
        // it means the stack-top bar cannot extend further to the right
        while (stack.length && heights[i] < heights[stack[stack.length - 1]]) {

            // Pop the index of the bar forming the rectangle height
            let height = heights[stack.pop()];

            let width;

            // If stack is empty after popping:
            // the popped bar extends from index 0 to i-1
            if (stack.length === 0) {
                width = i;
            } 
            // If stack is not empty:
            // width is between current index i and new stack top
            else {
                width = i - stack[stack.length - 1] - 1;
            }

            // Calculate area and update maximum
            maxArea = Math.max(maxArea, height * width);
        }

        // Push current index into stack
        stack.push(i);
    }

    return maxArea;
};
