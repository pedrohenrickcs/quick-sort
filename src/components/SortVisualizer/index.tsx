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
import { quickSort } from '../../utils/quickSort'; 

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
    console.log('array is sorted', array);
  };

  useEffect(() => {
    fetchAndSetNumbers(numElements);
  }, [numElements]);

  const handlePlay = (): void => {
    if (!sorting && !isSorted) {
      setSorting(true);
      setShouldStop(false);
      quickSortPromise.current = quickSort(array, 0, array.length - 1, delay, shouldStop);
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
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, 
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Value: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
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
