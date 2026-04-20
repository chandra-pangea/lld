/**
 * PROBLEM EXPLANATION:
 * Implementations of various sorting algorithms such as Quicksort, Mergesort, Bubble Sort, etc.
 */

// ============================================================================
// 1. QUICK SORT (Divide & Conquer) — Average O(n log n), Worst O(n²)
// ============================================================================

function quickSort(arr) {
    if (arr.length <= 1) return arr;
  
    const pivot = arr[arr.length - 1]; // Choose last element as pivot
    const left = [];
    const right = [];
  
    // Partition the array into left (< pivot) and right (>= pivot)
    for (let i = 0; i < arr.length - 1; i++) {
      arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]);
    }
  
    // Recursively sort smaller arrays and merge
    return [...quickSort(left), pivot, ...quickSort(right)];
  }
  
  
  
  // ============================================================================
  // COMMENT: QuickSort ends here. Below is MergeSort.
  // ============================================================================
  
  
  
  // ============================================================================
  // 2. MERGE SORT — O(n log n), Stable, Uses extra space
  // ============================================================================
  
  function mergeSort(arr) {
    if (arr.length <= 1) return arr;
  
    // Split array
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
  
    // Merge sorted halves
    return merge(left, right);
  }
  
  // Helper to merge two sorted arrays
  function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
  
    // Compare elements and merge
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) result.push(left[i++]);
      else result.push(right[j++]);
    }
  
    // Include leftover elements
    return [...result, ...left.slice(i), ...right.slice(j)];
  }
  
  
  
  // ============================================================================
  // COMMENT: MergeSort ends here. Below is HeapSort.
  // ============================================================================
  
  
  
  // ============================================================================
  // 3. HEAP SORT — O(n log n), In-place, Not stable
  // ============================================================================
  
  function heapSort(arr) {
    let n = arr.length;
  
    // Step 1: Build a max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i);
    }
  
    // Step 2: Extract max and shrink heap
    for (let i = n - 1; i > 0; i--) {
      // Move current max to the end
      [arr[0], arr[i]] = [arr[i], arr[0]];
      heapify(arr, i, 0);
    }
  
    return arr;
  }
  
  // Heapify subtree at index i
  function heapify(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
  
    // Find largest among root, left child, and right child
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
  
    // If root is not largest, swap and continue
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  }
  
  
  
  // ============================================================================
  // COMMENT: HeapSort ends here. Below is Insertion Sort.
  // ============================================================================
  
  
  
  // ============================================================================
  // 4. INSERTION SORT — O(n²), Best case O(n), Good for nearly sorted arrays
  // ============================================================================
function insertionSort(arr) {
    const length = arr.length;
  
    for (let i = 1; i < length; i++) {
        const current = arr[i];     // Element we want to insert
        let previous = i - 1;       // Check with elements on the left
  
        // As long as there are elements bigger than current, shift them
        while (previous >= 0 && arr[previous] > current) {
            arr[previous + 1] = arr[previous];
            previous--;
        }
  
        // Now previous is at the position where current should be placed
        arr[previous + 1] = current;
    }
  
}
  
  
  // ============================================================================
  // COMMENT: InsertionSort ends here. Below is Selection Sort.
  // ============================================================================
  
  
  
  // ============================================================================
  // 5. SELECTION SORT — O(n²), Simple but slow
  // ============================================================================
  
  function selectionSort(arr) {
    const n = arr.length;
  
    for (let i = 0; i < n; i++) {
      let minIndex = i;
  
      // Find minimum in remaining array
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIndex]) minIndex = j;
      }
  
      // Swap minimum element with first unsorted element
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    return arr;
  }
  
  
  
  // ============================================================================
  // COMMENT: SelectionSort ends here. Below is Bubble Sort.
  // ============================================================================
  
  
  
  // ============================================================================
  // 6. BUBBLE SORT — O(n²), Best case O(n) with early stopping
  // ============================================================================
  
  function bubbleSort(arr) {
    let n = arr.length;
  
    for (let i = 0; i < n; i++) {
      let swapped = false;
  
      // Compare adjacent elements
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
        }
      }
  
      // Stop early if no swaps happened
      if (!swapped) break;
    }
    return arr;
  }
  
  
  
  // ============================================================================
  // EXAMPLE USAGE
  // ============================================================================
  
  const arr = [7, 2, 9, 4, 1, 5];
  
  console.log("QuickSort      =", quickSort([...arr]));
  console.log("MergeSort      =", mergeSort([...arr]));
  console.log("HeapSort       =", heapSort([...arr]));
  console.log("InsertionSort  =", insertionSort([...arr]));
  console.log("SelectionSort  =", selectionSort([...arr]));
  console.log("BubbleSort     =", bubbleSort([...arr]));