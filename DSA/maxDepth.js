/**
 * PROBLEM EXPLANATION:
 * Given the root of a binary tree, return its maximum depth.
 */

function maxDepth(root) {
    if (!root) return 0;

    return 1 + Math.max(
        maxDepth(root.left),
        maxDepth(root.right)
    );
}
