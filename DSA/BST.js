class TreeNode {
    constructor(val) {
      this.val = val;
      this.left = null;
      this.right = null;
    }
  }
  const root = new TreeNode(1);
  const node2 = new TreeNode(2);
  const node3 = new TreeNode(3);
  const node4 = new TreeNode(4);
  const node5 = new TreeNode(5);
  const node6 = new TreeNode(6);
  root.left = node2;
  root.right = node3;
  node2.left = node4;
  node2.right = node5;
  node3.right = node6;
  
  function postOrder(node){
     if(node==null) return;
     inorder(node.left)
     inorder(node.right)
     console.log(node.val);
  }
  function inorder(node){
     if(node==null) return;
     inorder(node.left)
     console.log(node.val);
     inorder(node.right)
  }
  
  function preOrder(node){
     if(node==null) return;
     console.log(node.val);
     inorder(node.left)
     inorder(node.right)
  }
  
  function levelOrder(node){
      if (!node) return [];
      const queue=[node];
      const res=[];
      while(queue.length){
          let node = queue.shift();
          res.push(node.val);
          if (node.left) queue.push(node.left);
          if (node.right) queue.push(node.right);
      }
      console.log(res)
  }
  
  function minDepth(root) {
    if (!root) return 0;
  
    if (!root.left) return minDepth(root.right) + 1;
    if (!root.right) return minDepth(root.left) + 1;
  
    return Math.min(
      minDepth(root.left),
      minDepth(root.right)
    ) + 1;
  }
  
  function diameterOfBinaryTree(root) {
    let diameter = 0;
  
    function height(node) {
      if (!node) return 0;
  
      let left = height(node.left);
      let right = height(node.right);
  
      // update diameter (edges count)
      diameter = Math.max(diameter, left + right);
  
      // return height of tree
      return Math.max(left, right) + 1;
    }
  
    height(root);
    return diameter;
  }
  
  function isBalanced(root) {
    function height(node) {
      if (!node) return 0;
  
      const left = height(node.left);
      if (left === -1) return -1;
  
      const right = height(node.right);
      if (right === -1) return -1;
  
      if (Math.abs(left - right) > 1) return -1;
  
      return Math.max(left, right) + 1;
    }
  
    return height(root) !== -1;
  }
  
  function isValidBST(root) {
    function validate(node, min, max) {
      if (!node) return true;
  
      if (node.val <= min || node.val >= max) return false;
  
      return (
        validate(node.left, min, node.val) &&
        validate(node.right, node.val, max)
      );
    }
  
    return validate(root, -Infinity, Infinity);
  }
  
  
  function lowestCommonAncestor(root, p, q) {
    if (!root) return null;
  
    if (root === p || root === q) return root;
  
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
  
    if (left && right) return root;
  
    return left ? left : right;
  }
  
  function hasPathSum(root, targetSum) {
    if (!root) return false;
  
    // leaf node
    if (!root.left && !root.right) {
      return targetSum === root.val;
    }
  
    const remaining = targetSum - root.val;
  
    return (
      hasPathSum(root.left, remaining) ||
      hasPathSum(root.right, remaining)
    );
  }

  function levelOrder(root) {
    if (!root) return [];
  
    const queue = [root];
    const result = [];
  
    while (queue.length) {
      const size = queue.length; // nodes in current level
      const level = [];
  
      for (let i = 0; i < size; i++) {
        const node = queue.shift();
        level.push(node.val);
  
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
  
      result.push(level);
    }
  
    return result;
  }
  function sortedArrayToBST(nums) {
    if (!nums.length) return null;

    function build(left, right) {
        if (left > right) return null;

        const mid = Math.floor((left + right) / 2);

        const node = {
            val: nums[mid],
            left: build(left, mid - 1),
            right: build(mid + 1, right)
        };

        return node;
    }

    return build(0, nums.length - 1);
}

  
  console.log(isValidBST(root))
  isBalanced(root)
  inorder(root)
  preOrder(root)
  postOrder(root)
  levelOrder(root)
  minDepth(root)
  diameterOfBinaryTree(root)
  