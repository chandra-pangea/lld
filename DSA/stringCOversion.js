/**
 * PROBLEM EXPLANATION:
 * Convert a given string based on specific rules (e.g., snake_case to camelCase) or minimal edit distance.
 */

var minDistance = function(s, t) {
    const memo = new Map();

    function solve(i, j) {
        const key = i + "," + j;
        if (memo.has(key)) return memo.get(key);

        // Base cases
        if (i < 0) return j + 1; // insert remaining
        if (j < 0) return i + 1; // delete remaining

        // If characters match
        if (s[i] === t[j]) {
            const res = solve(i - 1, j - 1);
            memo.set(key, res);
            return res;
        }

        // Try all three operations
        const insert = solve(i, j - 1);
        const del = solve(i - 1, j);
        const replace = solve(i - 1, j - 1);

        const res = 1 + Math.min(insert, del, replace);
        memo.set(key, res);
        return res;
    }

    return solve(s.length - 1, t.length - 1);
};


let s = "horse"
let t = "ros"
solve(4,2)
