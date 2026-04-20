/**
 * PROBLEM EXPLANATION:
 * Given an array of intervals, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.
 */

function maxNonOverlappingTasks(tasks) {
    // Sort by end time
    tasks.sort((a, b) => a[1] - b[1]);

    let count = 0;
    let lastEnd = -Infinity;

    for (let [start, end] of tasks) {
        if (start >= lastEnd) {
            count++;
            lastEnd = end;
        }
    }

    return count;
}
