import { useState, useEffect, useRef } from "react";
import Fraction from "fraction.js";

function App() {
  const [difficulty, setDifficulty] = useState(0); // 0-3
  const [randomness, setRandomness] = useState(true);
  const [usedIDs, setUsedIDs] = useState([]);
  const [selectedNumberIdx, setSelectedNumberIdx] = useState(null);
  const [selectedOpIdx, setSelectedOpIdx] = useState(null);
  const [gameNums, setGameNums] = useState([
    new Fraction(2),
    new Fraction(3),
    new Fraction(4),
    new Fraction(6),
  ]);
  const [originalGameNums, setOriginalGameNums] = useState([
    new Fraction(2),
    new Fraction(3),
    new Fraction(4),
    new Fraction(6),
  ]);
  const [showSolvedModal, setShowSolvedModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const operations = ["+", "-", "x", "÷"];
  const numberButtonsRef = useRef(null);
  const opButtonsRef = useRef(null);
  const rotationAngles = [-45, 45, 225, 135];

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

  useEffect(() => {
    if (
      gameNums.filter((num) => num !== "").length === 1 &&
      gameNums.some((num) => num && num.valueOf() === 24)
    ) {
      setShowSolvedModal(true);
    }
  }, [gameNums]);

  const handleNumberClick = (idx) => {
    if (
      gameNums[idx] !== "" &&
      selectedNumberIdx !== null &&
      selectedOpIdx !== null
    ) {
      const num1 = gameNums[selectedNumberIdx];
      const num2 = gameNums[idx];
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
      }
      setSelectedNumberIdx(idx);
      setSelectedOpIdx(null);
      setGameNums((prevNums) => {
        const newNums = [...prevNums];
        newNums[idx] = result;
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

  const handleNewPuzzleClick = async () => {
    setShowSolvedModal(false);
    const response = await fetch("/api/index.py", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usedIDs: [5], difficulty: 0, randomness: true }),
    });
    const data = await response.json();

    const newGameNums = data.gameNums.map((num) => new Fraction(num));
    const puzzleID = data.puzzleID;
    setUsedIDs((prevIDs) => [...prevIDs, puzzleID]);

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
    <div className="flex flex-col items-center h-screen mt-5">
      <div
        className="rotate-45 grow grid grid-cols-2 gap-4 m-10 aspect-square mt-10"
        style={{
          maxWidth: "35vh ",
          maxHeight: "35vh",
        }}
        ref={numberButtonsRef}
      >
        {/* {gameNums.map((num, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center p-2 rounded-md text-7xl border aspect-square ${
              selectedNumberIdx === idx ? "bg-blue-200" : "bg-gray-200"
            }`}
            onClick={() => handleNumberClick(idx)}
          >
            {num !== "" && num.toFraction()}
          </div>
        ))} */}
        {gameNums.map((num, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center p-2 rounded-full text-6xl border aspect-square' ${
              selectedNumberIdx === idx ? "bg-blue-200" : "bg-gray-200"
            }`}
            style={{ transform: `rotate(${rotationAngles[idx]}deg)` }}
            onClick={() => handleNumberClick(idx)}
          >
            <p
              className={`flex items-center justify-center font-mono overflow-hidden select-none ${
                num === "" && "invisible"
              }`}
            >
              {/* invisible underscore to make the other circles not resize */}
              {num === "" ? "_" : num.toFraction()}
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4 m-3" ref={opButtonsRef}>
        {operations.map((op, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center p-4 rounded-md text-4xl border aspect-square ${
              selectedOpIdx === idx ? "bg-blue-200" : "bg-gray-200"
            }`}
            onClick={() => handleOpClick(idx)}
          >
            {op}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 m-3">
        <button onClick={() => setShowSettingsModal(true)}>Settings</button>
        <button onClick={handleResetClick}>Reset</button>
        <button onClick={handleUndoClick}>Undo</button>
        <button onClick={handleHintClick}>Hint</button>
        <button onClick={handleNewPuzzleClick}>New Puzzle</button>
      </div>
      {showSolvedModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={() => handleNewPuzzleClick()}
          ></div>
          <div className="bg-white p-8 rounded-lg z-10">
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p>You have won the game!</p>
            <button className="mt-4" onClick={handleNewPuzzleClick}>
              Play again
            </button>
          </div>
        </div>
      )}
      {showSettingsModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={() => setShowSettingsModal(false)}
          ></div>
          <div className="bg-white p-8 rounded-lg z-10">
            <div className="flex flex-row justify-between">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <button
                className="text-gray-600 p-1 mb-4"
                onClick={() => setShowSettingsModal(false)}
              >
                X
              </button>
            </div>
            <div className="flex flex-row justify-between">
              <label className="mr-2" htmlFor="difficulty">
                Difficulty:
              </label>
              <select
                name="difficulty"
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value={0}>Easy</option>
                <option value={1}>Medium</option>
                <option value={2}>Hard</option>
                <option value={3}>Extreme</option>
              </select>
            </div>
            <div className="flex flex-row justify-between">
              <label className="mr-2" htmlFor="randomness">
                Randomness:
              </label>
              <input
                className="mr-4"
                type="checkbox"
                name="randomness"
                id="randomness"
                checked={randomness}
                onChange={(e) => setRandomness(e.target.checked)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
