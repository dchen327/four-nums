import { useState } from "react";

function App() {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedOp, setSelectedOp] = useState(null);
  const values = [2, 3, 4, 6];
  const operations = ["+", "-", "x", "÷"];

  const handleNumberClick = (idx) => {
    setSelectedNumber(idx);
  };

  const handleOpClick = (idx) => {
    setSelectedOp(idx);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 m-3">
        {values.map((num, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center p-4 rounded-md text-5xl border aspect-square ${
              selectedNumber === idx ? "bg-blue-200" : "bg-gray-200"
            }`}
            onClick={() => handleNumberClick(idx)}
          >
            {num}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4 m-3">
        {operations.map((op, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center p-4 rounded-md text-3xl border aspect-square ${
              selectedOp === idx ? "bg-blue-200" : "bg-gray-200"
            }`}
            onClick={() => handleOpClick(idx)}
          >
            {op}
          </div>
        ))}
      </div>
      <button onClick={() => console.log(selectedNumber, selectedOp)}>
        Call API
      </button>
    </div>
  );
}

export default App;
