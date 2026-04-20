/**
 * PROBLEM EXPLANATION:
 * Implement Binary Tree traversals: Pre-order, In-order, Post-order, and Level-order.
 */

const tree = {
    value: 1,
    left: {
        value: 2,
        left: { value: 4, left: null, right: null },
        right: { value: 5, left: null, right: null }
    },
    right: {
        value: 3,
        left: { value: 6, left: null, right: null },
        right: { value: 7, left: null, right: null }
    }
};


class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}


class BinaryTree {
    constructor() {
        this.root = null;
    }


    insert(value) {
        const newNode = new Node(value);

        if (!this.root) {
            this.root = newNode;
            return;
        }

        let curr = this.root;

        while (true) {
            if (value < curr.value) {
                if (!curr.left) {
                    curr.left = newNode;
                    return;
                }
                curr = curr.left;
            } else {
                if (!curr.right) {
                    curr.right = newNode;
                    return;
                }
                curr = curr.right;
            }
        }
    }


    inorder(node, result = []) {
        if (!node) return result;
        this.inorder(node.left, result);
        result.push(node.value);
        this.inorder(node.right, result);
        return result;
    }

    preorder(node, result = []) {
        if (!node) return result;
        result.push(node.value);
        this.preorder(node.left, result);
        this.preorder(node.right, result);
        return result;
    }

    postorder(node, result = []) {
        if (!node) return result;
        this.postorder(node.left, result);
        this.postorder(node.right, result);
        result.push(node.value);
        return result;
    }

    levelOrder() {
        if (!this.root) return [];

        const result = [];
        const queue = [this.root];

        while (queue.length > 0) {
            const node = queue.shift();
            result.push(node.value);

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        return result;
    }
}


const tre = new BinaryTree();

tre.insert(1);
tre.insert(2);
tre.insert(3);
tre.insert(4);
tre.insert(5);
tre.insert(6);
tre.insert(7);


console.log("Inorder:", tre.inorder(tre.root));     
console.log("Preorder:", tre.preorder(tre.root));   
console.log("Postorder:", tre.postorder(tre.root));
console.log("Levelorder:", tre.levelOrder(tre.root));
