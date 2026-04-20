/**
 * PROBLEM EXPLANATION:
 * Given a binary tree, determine if it is height-balanced (the left and right subtrees of every node differ in height by no more than 1).
 */

// ------------------------------
// Tree Node Definition
// ------------------------------
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

// ------------------------------
// Height Balanced Tree Check
// (Postorder DFS)
// ------------------------------
function isBalanced(root) {
    const dfs = (node) => {
        if (!node) return 0;

        // Postorder traversal
        const leftHeight = dfs(node.left);
        if (leftHeight === -1) return -1;

        const rightHeight = dfs(node.right);
        if (rightHeight === -1) return -1;

        // Balance check
        if (Math.abs(leftHeight - rightHeight) > 1) {
            return -1;
        }

        // Return height
        return 1 + Math.max(leftHeight, rightHeight);
    };

    return dfs(root) !== -1;
}

// ------------------------------
// Create a Balanced Tree
// ------------------------------
const root1 = new TreeNode(1);
root1.left = new TreeNode(2);
root1.right = new TreeNode(3);
root1.left.left = new TreeNode(4);

console.log("Balanced Tree:", isBalanced(root1)); // true

// ------------------------------
// Create an Unbalanced Tree
// ------------------------------
const root2 = new TreeNode(1);
root2.left = new TreeNode(2);
root2.left.left = new TreeNode(3);
root2.left.left.left = new TreeNode(4);

console.log("Unbalanced Tree:", isBalanced(root2)); // false
