/**
 * PROBLEM EXPLANATION:
 * Write a function that reverses a string. The input string is given as an array of characters or string.
 */

function reverseString(str) {
    let reversedString=""
    for (let i = str.length-1; i >=0; i -= 1){
        reversedString+=str[i]
    }
    return reversedString
}

console.log(reverseString("ABCDE"));