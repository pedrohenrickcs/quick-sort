import React from 'react';

interface ControlsProps {
  delay: number;
  setDelay: React.Dispatch<React.SetStateAction<number>>;
  numElements: number;
  setNumElements: React.Dispatch<React.SetStateAction<number>>;
  sorting: boolean;
  isSorted: boolean;
  handlePlay: () => void;
  handleReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  delay,
  setDelay,
  numElements,
  setNumElements,
  sorting,
  handlePlay,
  handleReset
}) => {
  return (
    <div>
      <div className="mt-4">
        <label>Delay: {delay}ms</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="ml-2"
        />
      </div>

      <div className="mt-4">
        <label>Number of Elements: {numElements}</label>
        <input
          type="range"
          min="10"
          max="1000"
          step="5"
          value={numElements}
          onChange={(e) => setNumElements(Number(e.target.value))}
          className="ml-2"
        />
      </div>

      <button
        onClick={handlePlay}
        disabled={sorting}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Play
      </button>
      <button
        onClick={handleReset}
        className="mt-4 ml-2 p-2 bg-gray-500 text-white rounded"
      >
        Reset
      </button>
    </div>
  );
};

export default Controls;
