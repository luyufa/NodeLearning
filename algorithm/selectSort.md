## 选择排序
> n个元素中最小，(n-1)个元素中找最小

* 时间最优 `1 * 2 * ....(n-1) * n =(n+1)/(n/2)`
* 时间最坏 `1 * 2 * ....(n-1) * n =(n+1)/(n/2)`
* 空间`O(1)`

```
function selectSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                [arr[i], arr[j]] = [arr[j], arr[i]]
            }
        }
    }
    return arr;
}```