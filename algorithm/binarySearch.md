## 二分搜索
> 有序数组为前提，key和数组中间值比较，相等返回，不等折半。


* 最坏时间  `O(log2n)`
* 空间  `O(1)`

##### 递归

```
function binarySearch(arr, key) {
    return (function search(key, arr, left, right) {
        if (left < right) {
            let mid = parseInt((left + right) / 2);
            if (arr[mid] > key) {
                return search(key, arr, left, mid);
            } else if (arr[mid] < key) {
                return search(key, arr, mid + 1, right);
            } else {
                return mid;
            }
        } else {
            return -1;
        }
    })(key, arr, 0, arr.length - 1)
}
```

##### 非递归

```
function binarySearch(arr, key) {
    let left = 0, right = arr.length - 1;
    while (left < right) {
        let mid = parseInt((left + right) / 2);
        if (arr[mid] > key) {
            right = mid - 1;
        } else if (arr[mid] < key) {
            left = mid + 1;
        } else if (arr[mid] === key) {
            return mid;
        }
    }
    return -1;
}
```