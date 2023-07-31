import { useState, useEffect, useRef } from "react";
import Fraction from "fraction.js";

function App() {
  const [selectedNumberIdx, setSelectedNumberIdx] = useState(null);
  const [selectedOpIdx, setSelectedOpIdx] = useState(null);
  const [gameNums, setGameNums] = useState([2, 3, 4, 6]);
  const [originalGameNums, setOriginalGameNums] = useState([2, 3, 4, 6]);
  const [gameHistory, setGameHistory] = useState([]);
  const operations = ["+", "-", "x", "÷"];
  const numberButtonsRef = useRef(null);
  const opButtonsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        numberButtonsRef.current &&
        !numberButtonsRef.current.contains(event.target) &&
        opButtonsRef.current &&
        !opButtonsRef.current.contains(event.target)
      ) {
        setSelectedNumberIdx(null);
        setSelectedOpIdx(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleNumberClick = (idx) => {
    if (
      gameNums[idx] !== "" &&
      selectedNumberIdx !== null &&
      selectedOpIdx !== null
    ) {
      const num1 = new Fraction(gameNums[selectedNumberIdx]);
      const num2 = new Fraction(gameNums[idx]);
      let result;
      switch (selectedOpIdx) {
        case 0:
          result = num1.add(num2);
          break;
        case 1:
          result = num1.sub(num2);
          break;
        case 2:
          result = num1.mul(num2);
          break;
        case 3:
          result = num1.div(num2);
          break;
        default:
          result = null;
      }
      setSelectedNumberIdx(idx);
      setSelectedOpIdx(null);
      setGameNums((prevNums) => {
        const newNums = [...prevNums];
        newNums[idx] = result.toFraction();
        newNums[selectedNumberIdx] = "";
        return newNums;
      });
      setGameHistory((prevHistory) => [...prevHistory, gameNums]);
    } else if (gameNums[idx] !== "") {
      setSelectedNumberIdx(idx);
    }
  };

  const handleOpClick = (idx) => {
    setSelectedOpIdx(idx);
  };

  const handleResetClick = () => {
    setGameNums(originalGameNums);
    setSelectedNumberIdx(null);
    setSelectedOpIdx(null);
    setGameHistory([]);
  };

  const handleUndoClick = () => {
    if (gameHistory.length > 0) {
      const prevGameNums = gameHistory[gameHistory.length - 1];
      setGameNums(prevGameNums);
      setGameHistory((prevHistory) => prevHistory.slice(0, -1));
      setSelectedNumberIdx(null);
      setSelectedOpIdx(null);
    }
  };

  const handleNewPuzzleClick = () => {
    const newGameNums = [1, 2, 3, 4].map(
      () => Math.floor(Math.random() * 10) + 1
    );
    setGameNums(newGameNums);
    setOriginalGameNums(newGameNums);
    setSelectedNumberIdx(null);
    setSelectedOpIdx(null);
    setGameHistory([]);
  };

  const handleHintClick = () => {
    // TODO: Implement hint functionality
    console.log("Hint clicked");
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 m-3" ref={numberButtonsRef}>
        {gameNums.map((num, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center p-4 rounded-md text-5xl border aspect-square ${
              selectedNumberIdx === idx ? "bg-blue-200" : "bg-gray-200"
            }`}
            onClick={() => handleNumberClick(idx)}
          >
            {num}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4 m-3" ref={opButtonsRef}>
        {operations.map((op, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center p-4 rounded-md text-3xl border aspect-square ${
              selectedOpIdx === idx ? "bg-blue-200" : "bg-gray-200"
            }`}
            onClick={() => handleOpClick(idx)}
          >
            {op}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 m-3">
        <button onClick={handleResetClick}>Reset</button>
        <button onClick={handleUndoClick}>Undo</button>
        <button onClick={handleNewPuzzleClick}>New Puzzle</button>
        <button onClick={handleHintClick}>Hint</button>
      </div>
      <button onClick={() => console.log(gameNums)}>Call API</button>
    </div>
  );
}

export default App;
