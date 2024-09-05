import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Controls from '../Controls';
import { fetchNumbers } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type DataSet = number[];

const SortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<DataSet>([]);
  const [delay, setDelay] = useState<number>(500);
  const [numElements, setNumElements] = useState<number>(50);
  const [sorting, setSorting] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [shouldStop, setShouldStop] = useState<boolean>(false);
  const quickSortPromise = useRef<Promise<void> | null>(null);

  const fetchAndSetNumbers = async (count: number) => {
    const numbers = await fetchNumbers(count);
    setArray(numbers);
    setIsSorted(false);
  };

  useEffect(() => {
    fetchAndSetNumbers(numElements);
  }, [numElements]);

  const quickSort = async (arr: DataSet, left: number, right: number): Promise<void> => {
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
        setArray([...arr]);
        await new Promise((resolve) => setTimeout(resolve, delay));
        i++;
        j--;
      }
    }
    await quickSort(arr, left, j);
    await quickSort(arr, i, right);
  };

  const handlePlay = (): void => {
    if (!sorting && !isSorted) {
      setSorting(true);
      setShouldStop(false);
      quickSortPromise.current = quickSort(array, 0, array.length - 1);
      quickSortPromise.current.then(() => {
        setSorting(false);
        setIsSorted(true);
      });
    }
  };

  const handleReset = async (): Promise<void> => {
    if (quickSortPromise.current) {
      setShouldStop(true);
      await quickSortPromise.current;
    }
    setSorting(false);
    await fetchAndSetNumbers(numElements);
    setShouldStop(false);
    setIsSorted(false);
  };

  const chartData = {
    labels: array.map((_, i) => i.toString()),
    datasets: [
      {
        label: 'Values',
        data: array,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    animation: {
      duration: 0,
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">QuickSort Visualizer</h1>
      <Controls
        delay={delay}
        setDelay={setDelay}
        numElements={numElements}
        setNumElements={setNumElements}
        sorting={sorting}
        isSorted={isSorted}
        handlePlay={handlePlay}
        handleReset={handleReset}
      />
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default SortingVisualizer;
