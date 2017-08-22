## 二叉树的前序、中序、后序遍历

* 前序:根左右
* 中序:左根右
* 前序:左右根

```
class Node {
    constructor(value, left, right) {
        this.left = left;
        this.right = right;
        this.value = value;
    }
}

const c = new Node('c', null);
const a = new Node('a', c, null);
const b = new Node('b', null, null);
const root = new Node('root', a, b);

function DLR(root) {
    if (root) {
        console.log(root.value);
        DLR(root.left);
        DLR(root.right);
    }
}
function DLR_(root) {
    const stack = [];
    while (root || stack.length) {
        while (root) {
            console.log(root.value);
            stack.push(root);
            root = root.left;
        }
        root = stack.pop();
        root = root.right;
    }
}

function LDR(root) {
    if (root) {
        LDR(root.left);
        console.log(root.value);
        LDR(root.right);
    }
}
function LDR_(root) {
    const stack = [];
    while (root || stack.length) {
        while (root) {
            stack.push(root);
            root = root.left;
        }
        root = stack.pop();
        console.log(root.value);
        root = root.right;
    }
}

function LRD(root) {
    if (root) {
        LRD(root.left);
        LRD(root.right);
        console.log(root.value);
    }
}
```