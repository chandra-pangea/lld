/**
 * PROBLEM EXPLANATION:
 * Given a string `s`, return the longest palindromic substring in `s`.
 */

function allPalindromicSubstrings(str) {
    let result = [];

    function expand(left, right) {
        while (left >= 0 && right < str.length && str[left] === str[right]) {
            result.push(str.substring(left, right + 1));
            left--;
            right++;
        }
    }

    for (let i = 0; i < str.length; i++) {
        expand(i, i);
        expand(i, i + 1);
    }

    return result;
}


console.log(allPalindromicSubstrings("abba"));
