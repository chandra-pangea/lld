/**
 * PROBLEM EXPLANATION:
 * Find the Nth number in the Fibonacci sequence.
 */

function fib(n, memo = {}) {
    if (n <= 1) return n;
  
    if (memo[n] !== undefined) {
      return memo[n];           // Return cached value
    }
  
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
    return memo[n];
  }
  
  console.log(fib(10)); // 55
  