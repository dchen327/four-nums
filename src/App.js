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
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button onClick={handleClick}>Call API</button>
    </div>
  );
}

export default App;
