/**
 * PROBLEM EXPLANATION:
 * Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.
 */

function nonRepeatingChar(s) {
    const map = new Map();
    for (let i = 0; i < s.length; i++){
        if (map.has(s[i])) {
            map.set(s[i],map.get(s[i])+1)
        } else {
            map.set(s[i],1)
        }
    }
    for (let [key, value] of map) {
        if (value == 1) {
            return key
        }
    }
}


console.log(nonRepeatingChar("adsadjsdsadasi"))