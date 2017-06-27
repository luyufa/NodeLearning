## 冒泡排序
> 两两相比，大的移后

* 时间最优`O(n)`
* 时间最坏 `1 * 2 * ....(n-1) * n =(n+1)/(n/2)`
* 空间`O(1)`

```
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let flag = true;
        for (let j = 0; j < arr.length - i; j++) {
            if (arr[j] > arr[j + 1]) {
                flag = false;
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
        if (flag) {
            return arr;
        }
    }
    return arr;
}
```