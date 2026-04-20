/**
 * PROBLEM EXPLANATION:
 * Find the common elements present in given multiple sorted or unsorted arrays.
 */

function commonElement(arr1, arr2) {
    let arr1Element = new Set(arr1);
    let res = [];
    arr2.forEach(element => {
        if (arr1Element.has(element)) {
            res.push(element)
        }
    });
    return res
}


console.log(commonElement([1,2,3,4],[1,2,3,4,5,6]))