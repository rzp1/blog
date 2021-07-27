(function (array) {
  function createTreeNode(index) {
    if (index > array.length) return null;
    const val = array[index - 1];
    if (!val) return null;
    let TreeNode = {};
    TreeNode["val"] = val;
    TreeNode["left"] = createTreeNode(index * 2);
    TreeNode["right"] = createTreeNode(index * 2 + 1);
    return TreeNode;
  }
  console.log(createTreeNode(1));
  // return createTreeNode(1);
})([1,2,3]);
