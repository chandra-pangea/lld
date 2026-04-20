/**
 * PROBLEM EXPLANATION:
 * Given two strings s and t, return true if t is an anagram of s, and false otherwise.
 */

function isAnagram(s1, s2) {
    return s1.sort().toLowercase()==s2.sort().toLowercase()
}

console.log(isAnagram("absd", "asbd"));