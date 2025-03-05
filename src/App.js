import { useState, useRef, useEffect } from 'react';
import Die from './Die';

import Confetti from 'react-confetti';

export default function App() {
  const [diceNums, setDiceNums] = useState(generateAllNewDice());
  const buttonRef = useRef(null);

  const gameWon =
    diceNums.every((die) => die.isHeld) &&
    diceNums.every((die) => die.value === diceNums[0].value);

  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus();
    }
  }, [gameWon]);

  function generateAllNewDice() {
    return Array(10)
      .fill(0)
      .map((_, i) => ({
        id: i,
        value: Math.floor(Math.random() * 6) + 1,
        isHeld: false,
      }));
  }

  function rollDice() {
    if (!gameWon) {
      setDiceNums((prev) =>
        prev.map((dice) => {
          return dice.isHeld
            ? dice
            : { ...dice, value: Math.floor(Math.random() * 6) + 1 };
        })
      );
    } else {
      setDiceNums(generateAllNewDice());
    }
  }

  function hold(id) {
    setDiceNums((prev) =>
      prev.map((item) => {
        return item.id === id ? { ...item, isHeld: !item.isHeld } : item;
      })
    );
  }

  const dices = diceNums.map((die, id) => (
    <Die key={id} value={die.value} isHeld={die.isHeld} hold={() => hold(id)} />
  ));

  return (
    <main>
      {gameWon && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{dices}</div>
      <button ref={buttonRef} className="roll-button" onClick={rollDice}>
        {gameWon ? 'New Game' : 'Roll'}
      </button>
    </main>
  );
}
