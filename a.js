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

const arr = [1, 3, 5, 7, 9];
console.log(binarySearch(arr, 7));