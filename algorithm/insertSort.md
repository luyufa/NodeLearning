## 插入排序
> 在有序序列中（默认前1个为有序序列），把之后的元素依次插入合适位置。

* 时间最优`O(n)`
* 时间最坏 `1 * 2 * ....(n-1) * n =(n+1)/(n/2)`
* 空间`O(1)`

```
function insertSort(arr = []) {
    for (let i = 1; i < arr.length; i++) {
        for (let j = i; j > 0; j--) {
            if (arr[j - 1] > arr[j]) {
                [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
            } else {
                break;
            }
        }
    }
    return arr;
}
```