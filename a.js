function binarySearch(arr, target) {
    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
        let mid = parseInt((high + low) / 2);
        console.log(low, high, mid);
        if (arr[mid] === target) {
            return mid;
        }
        else if (arr[mid] < target) {
            low = mid + 1;
        }
        else if (arr[mid] > target) {
            high = mid - 1;
        }
    }
    return -1;
}

function _binarySearch(arr, target) {
    return (function search(arr, low, high) {
        let mid = parseInt((low + high) / 2);
        if (low < high) {
            if (arr[mid] === target) {
                return mid;
            }
            else if (arr[mid] < target) {
                return search(arr, mid + 1, high);
            }
            else if (arr[mid] > target) {
                return search(arr, low, mid - 1);
            }
        }
        else {
            return -1;
        }
    })(arr, 0, arr.length);
}

console.log(_binarySearch([1, 2, 3, 4, 5, 6, 7, 8], 3));//3