/**
 * PROBLEM EXPLANATION:
 * Given two strings, s1 and s2, write code to check if s2 is a rotation of s1 under the constraint that s1 can be shifted by any number of characters.
 */

function isRotation(s1, s2) {
    if (s1.length !== s2.length) return false;

    return (s1 + s1).includes(s2);
}


// s1 = "abcd"
// s1+s1 = "abcdabcd"

// Possible rotations:
// abcd
// bcda
// cdab
// dabc
