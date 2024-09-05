export const quickSort = async (arr: number[], left: number, right: number, delay: number, shouldStop: boolean): Promise<void> => {
  if (left >= right || shouldStop) return;

  const pivotIndex = Math.floor((left + right) / 2);
  const pivot = arr[pivotIndex];
  let i = left;
  let j = right;

  while (i <= j) {
    while (arr[i] < pivot) i++;
    while (arr[j] > pivot) j--;
    if (i <= j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];

      await new Promise((resolve) => setTimeout(resolve, delay));

      i++;
      j--;
    }
  }

  await quickSort(arr, left, j, delay, shouldStop);
  await quickSort(arr, i, right, delay, shouldStop);
};
