import { useState } from "react";

function App() {
  const [selected, setSelected] = useState(null);
  const values = [2, 3, 4, 6];

  const handleClick = (idx) => {
    setSelected(idx);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 m-3">
        {values.map((num, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center p-4 rounded-md text-5xl border aspect-square ${
              selected === idx ? "bg-blue-200" : "bg-gray-200"
            }`}
            onClick={() => handleClick(idx)}
          >
            {num}
          </div>
        ))}
      </div>
      <button onClick={handleClick}>Call API</button>
    </div>
  );
}

export default App;
