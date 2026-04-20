/**
 * PROBLEM EXPLANATION:
 * Write a function that takes a deeply nested array and flattens it into a one-dimensional array.
 */

function flattenArray(ele) {
    if (Array.isArray(ele)) {
        for (let i = 0; i < ele.length; i++){
            flattenArray(ele[i])
        }
    } else {
        res.push(ele)
    }
    
}

let res=[]
flattenArray([1, [2, [3, 4], 5], 6], res)
console.log(res)