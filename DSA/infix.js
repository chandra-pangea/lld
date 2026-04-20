/**
 * PROBLEM EXPLANATION:
 * Evaluate an infix mathematical expression or convert it to postfix notation.
 */

var calculate = function(s) {
    let values = [];   // stack for numbers
    let ops = [];      // stack for operators

    // Helper: operator precedence
    const precedence = (op) => {
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/') return 2;
        return 0;
    };

    // Helper: apply operation
    const applyOp = (b, a, op) => {
        if (op === '+') return a + b;
        if (op === '-') return a - b;
        if (op === '*') return a * b;
        if (op === '/') return Math.trunc(a / b);
    };

    let i = 0;

    while (i < s.length) {
        let ch = s[i];

        // Ignore spaces
        if (ch === ' ') {
            i++;
            continue;
        }

        // If digit, parse full number
        if (!isNaN(ch)) {
            let num = 0;
            while (i < s.length && !isNaN(s[i])) {
                num = num * 10 + Number(s[i]);
                i++;
            }
            values.push(num);
            continue;
        }

        // Opening bracket
        if (ch === '(') {
            ops.push(ch);
        }

        // Closing bracket
        else if (ch === ')') {
            while (ops.length && ops[ops.length - 1] !== '(') {
                let op = ops.pop();
                let b = values.pop();
                let a = values.pop();
                values.push(applyOp(b, a, op));
            }
            ops.pop(); // remove '('
        }

        // Operator
        else {
            while (
                ops.length &&
                precedence(ops[ops.length - 1]) >= precedence(ch)
            ) {
                let op = ops.pop();
                let b = values.pop();
                let a = values.pop();
                values.push(applyOp(b, a, op));
            }
            ops.push(ch);
        }

        i++;
    }

    // Apply remaining operators
    while (ops.length) {
        let op = ops.pop();
        let b = values.pop();
        let a = values.pop();
        values.push(applyOp(b, a, op));
    }

    return values.pop();
};
