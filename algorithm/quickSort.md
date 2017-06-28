## 快速排序
> 挖坑填数，分而治之


* 时间最优 选取合适的key，使得左右数组均分  `O(n log2 n)`
* 时间最坏 选择数组中最大或最小值，使得数组全分到一个序列了 `O(n^2)`
* 空间`O(n log2 n)`


```
function quickSort(arr) {
    (function quick(arr, low, high) {
        if (low < high) {//递归出口
            let key = arr[low];
            let left = low;
            let right = high;

            while (left < right) {
                //寻找key值左边
                while (arr[right] > key && left < right) {
                    right--;
                }
                arr[left] = arr[right];

                //寻找key值右边
                while (arr[left] < key && left < right) {
                    left++
                }
                arr[right] = arr[left];
            }

            //left,right最终会回到一个下标,此值为key
            arr[left] = key;

            //递归以key为界,左右数组
            quick(arr, low, left - 1);
            quick(arr, left + 1, high)
        }
    })(arr, 0, arr.length - 1);
    return arr;
}
```