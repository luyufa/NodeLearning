function mergeArr(arr, left, mid, right, arr3) {
    let i = left, j = mid + 1;

    while (i <= mid && j <= right) {
        if (arr[i] < arr[j]) {
            arr3.push(arr[i++])
        } else {
            arr3.push(arr[j++])
        }
    }

    while (j <= right) {
        arr3.push(arr[j++])
    }
    while (i <= mid) {
        arr3.push(arr[i++])
    }

    for (let g = 0; g < arr3.length; g++) {
        arr[g] = arr3[g]
    }
    return arr3;
}
// const a=[1, 3, 5, 2, 4, 8]
// mergeArr(a, 0, 2, 5, [])
// console.log(a)

function mergeSort(arr) {
    let newArr = [];

    function merge(arr, left, right, temp) {
        console.log(arr, left, right, temp)
        if (left < right) {
            let mid = parseInt((left + right) / 2);
            merge(arr, left, mid, temp);
            merge(arr, mid + 1, right, temp);
            mergeArr(arr, left, mid, right, temp)
        }
    }

    merge(arr, 0, arr.length - 1, newArr)
    return newArr;
}
console.log(mergeSort([3, 5, 4, 2]))
