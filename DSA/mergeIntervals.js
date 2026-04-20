/**
 * PROBLEM EXPLANATION:
 * Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals.
 */

function mergeIntervals(intervals) {
    if (!intervals.length) return [];

    intervals.sort((a, b) => a.start - b.start);

    const merged = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
        const prev = merged[merged.length - 1];
        const curr = intervals[i];
        if (curr.start <= prev.end) {
            prev.end = Math.max(prev.end, curr.end);
        } else {
            merged.push(curr);
        }
    }

    return merged;
}


var hasOverlap = function(intervals) {
    if (intervals.length <= 1) return false;

    // Step 1: sort by start time
    intervals.sort((a, b) => a[0] - b[0]);

    // Step 2: check adjacent intervals
    for (let i = 1; i < intervals.length; i++) {
        const prevEnd = intervals[i - 1][1];
        const currStart = intervals[i][0];

        if (currStart <= prevEnd) {
            return true;
        }
    }

    return false;
};



const interval=[
    { start: 1, end: 3 },
    { start: 2, end: 6 },
    { start: 8, end: 10 },
    { start: 9, end: 12 }
  ]
  
console.log(mergeIntervals(interval));
