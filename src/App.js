import React from "react";
import "./App.css";

function App() {
  const handleClick = async () => {
    const response = await fetch("/api/index.py", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ params: "hi" }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 m-3">
        <div className="flex items-center justify-center p-4 rounded-md text-5xl bg-gray-200 border border-black aspect-square">
          1
        </div>
        <div className="flex items-center justify-center p-4 rounded-md text-5xl bg-gray-200 border border-black aspect-square">
          2
        </div>
        <div className="flex items-center justify-center p-4 rounded-md text-5xl bg-gray-200 border border-black aspect-square">
          3
        </div>
        <div className="flex items-center justify-center p-4 rounded-md text-5xl bg-gray-200 border border-black aspect-square">
          4
        </div>
      </div>
      <button onClick={handleClick}>Call API</button>
    </div>
  );
}

export default App;
