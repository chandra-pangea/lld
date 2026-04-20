/**
 * PROBLEM EXPLANATION:
 * Find the Kth smallest element in a given array or Binary Search Tree.
 */

function kthSmallest(arr, k) {
    let maxHeap = [];

    for (let num of arr) {
        maxHeap.push(num);
        maxHeap.sort((a, b) => b - a);

        if (maxHeap.length > k) maxHeap.shift();
    }

    return maxHeap[0];
}

console.log(kthSmallest([7, 10, 4, 3, 20, 15], 3)); // Output: 7
