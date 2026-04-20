/**
 * PROBLEM EXPLANATION:
 * Implement Run-Length Encoding (RLE) to compress and decompress a given string.
 */

function compress(str) {
    if (str.length === 0) return "";

    let result = "";
    let count = 1;

    for (let i = 1; i <= str.length; i++) {
        if (str[i] === str[i - 1]) {
            count++;
        } else {
            result += str[i - 1] + count;
            count = 1;
        }
    }

    return result;
}


console.log(compress("aaabbc"))