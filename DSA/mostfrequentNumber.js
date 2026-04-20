/**
 * PROBLEM EXPLANATION:
 * Find the element that appears most frequently in a given array.
 */

function mostFrequentNumber(arr) {
    const map = new Map();
    let max = 0;
    let maxNumber = null;

    arr.forEach(element => {
        const count = (map.get(element) || 0) + 1;
        map.set(element, count);

        if (count > max) {
            max = count;
            maxNumber = element;
        }
    });

    return maxNumber;
}


console.log(mostFrequentNumber([1,2,2,3,3,3])); // 3
console.log(mostFrequentNumber([5,5,6,6,6,6,5])); // 6
