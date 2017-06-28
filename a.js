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
console.log(quickSort([3, 5, 4, 1, 2]));