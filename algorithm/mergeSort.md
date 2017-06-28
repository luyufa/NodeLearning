## 归并排序
> 把数组一分为2.....直到一个元素为止，在依次合并起来


* 时间最优  O(nlogn)
* 时间最坏  O(nlogn)
* 空间`O(n)`


```
function mergeSort(arr) {
    // 设置终止的条件，
    if (arr.length < 2) {
        return arr;
    }
    //设立中间值
    var middle = parseInt(arr.length / 2);
    //第1个和middle个之间为左子列
    var left = arr.slice(0, middle);
    //第middle+1到最后为右子列
    var right = arr.slice(middle);
    // if (left == "undefined" && right == "undefined") {
    //     return false;
    // }
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    var result = [];

    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            //把left的左子树推出一个，然后push进result数组里
            result.push(left.shift());
        } else {
            //把right的右子树推出一个，然后push进result数组里
            result.push(right.shift());
        }
    }
    //经过上面一次循环，只能左子列或右子列一个不为空，或者都为空
    while (left.length) {
        result.push(left.shift());
    }
    while (right.length) {
        result.push(right.shift());
    }
    return result;
}
```