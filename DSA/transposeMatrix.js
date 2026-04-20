/**
 * PROBLEM EXPLANATION:
 * Given a 2D integer array `matrix`, return the transpose of `matrix`.
 */

function transpose(matrix) {
    // Number of rows in the original matrix
    const rowCount = matrix.length;

    // Number of columns in the original matrix
    const colCount = matrix[0].length;

    // Create a new matrix with swapped dimensions
    const result = [];

    // Loop through columns first, because they become rows
    for (let col = 0; col < colCount; col++) {
        
        // New row for transpose
        const newRow = [];

        // Take each row's element from current column
        for (let row = 0; row < rowCount; row++) {
            newRow.push(matrix[row][col]);
        }

        // Push the constructed row into result
        result.push(newRow);
    }

    return result;
}

const matrix = [
    [1, 2, 3],
    [4, 5, 6]
];

console.log(transpose(matrix));

