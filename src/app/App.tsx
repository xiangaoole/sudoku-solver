import React, { useState } from 'react';
import './App.css';
import Board from 'features/board/Board';
import { isValidSudoku, solveSudoku, InvalidInfo } from 'utils/Sudoku';

const emptyPuzzle = function (): string[][] {
  return Array(9)
    .fill(null)
    .map((ele) => Array(9).fill(''));
};
const testPuzzle: string[][] = [
  ['5', '3', '', '', '7', '', '', '', ''],
  ['6', '', '', '1', '9', '5', '', '', ''],
  ['', '9', '8', '', '', '', '', '6', ''],
  ['8', '', '', '', '6', '', '', '', '3'],
  ['4', '', '', '8', '', '3', '', '', '1'],
  ['7', '', '', '', '2', '', '', '', '6'],
  ['', '6', '', '', '', '', '2', '8', ''],
  ['', '', '', '4', '1', '9', '', '', '5'],
  ['', '', '', '', '8', '', '', '7', '9']
];

function isNumberValid(val: string): boolean {
  if (val.length === 1) {
    return !Number.isNaN(Number(val));
  }
  if (val.length === 0) {
    return true;
  }
  return false;
}

const App: React.FC = () => {
  let [history, setHistory] = useState<string[][][]>([]);
  let [puzzle, setPuzzle] = useState(testPuzzle);
  let [board, setBoard] = useState(testPuzzle);
  let [checkResult, setCheckResult] = useState('');
  let [invalidInfo, setInvalid] = useState<InvalidInfo | null>(null);

  function checkIsValid(): boolean {
    const VALID_HINT = 'The board is valid :)';
    const INVALID_HINT = 'You have made some mistakes, highlighted in red!';
    const invalidInfo = isValidSudoku(board);
    setCheckResult(invalidInfo ? INVALID_HINT : VALID_HINT);
    setInvalid(invalidInfo);
    return invalidInfo === null;
  }

  function _resetCheckInfo() {
    if (invalidInfo !== null) {
      setInvalid(null);
    }
    if (checkResult !== '') {
      setCheckResult('');
    }
  }

  function reset() {
    _resetCheckInfo();
    setPuzzle(emptyPuzzle);
    setBoard(emptyPuzzle);
  }

  function onTextChange(row: number, col: number, newVal: string) {
    if (isNumberValid(newVal)) {
      _resetCheckInfo();
      let newInput = puzzle.map((arr) => arr.slice());
      newInput[row][col] = newVal;
      setPuzzle(newInput);
      setBoard(newInput);
    }
  }

  function solve() {
    if (checkIsValid()) {
      let newOutput = solveSudoku(puzzle);
      if (newOutput === null) {
        setCheckResult('Sorry! I have no solution!');
        return;
      }
      setBoard(newOutput);
    }
  }

  function jumpTo(index: number) {
    _resetCheckInfo();
    setPuzzle(history[index]);
    setBoard(history[index]);
  }

  function save() {
    if (checkIsValid()) {
      setHistory([...history, puzzle.map((arr) => arr.slice())]);
    }
  }

  let hintClass = 'hint-txt';
  if (invalidInfo) {
    hintClass += ' invalid-hint';
  }
  let puzzles = history.map((val, index) => {
    const desc = `Go to saved puzzle #${index + 1}`;
    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{desc}</button>
      </li>
    );
  });

  let content = (
    <>
      <div className="game-board">
        <Board
          board={board}
          puzzle={puzzle}
          onTextChange={onTextChange}
          invalidInfo={invalidInfo}
        />
        <br />
        <button onClick={() => checkIsValid()}>Check</button>
        <button onClick={() => reset()}>Reset</button>
        <button onClick={() => solve()}>Solve</button>
        <button onClick={() => save()}>Save</button>
        {checkResult.length > 0 && <p className={hintClass}>{checkResult}</p>}
      </div>
      <div className="game-history">
        <p>History:</p>
        {puzzles.length === 0 ? <p>No saved history</p> : <ol>{puzzles}</ol>}
      </div>
    </>
  );
  return <div className="game">{content}</div>;
};

export default App;
