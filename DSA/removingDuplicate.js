/**
 * PROBLEM EXPLANATION:
 * Remove duplicates from a sorted array or sorted linked list in-place.
 */

function removingDuplicate(arr) {
    let uniqueSet = new Set();
    arr.forEach(element => {
        uniqueSet.add(element);
    });
    return Array.from(uniqueSet);
}

console.log(removingDuplicate([1,1,1,2,2,2,2]))