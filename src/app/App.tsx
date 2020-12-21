import React, { useState } from 'react';
import './App.css';
import Board from 'features/board/Board';
import { isValidSudoku, solveSudoku, InvalidInfo } from 'utils/Sudoku';

const emptyBoard = function (): string[][] {
  return Array(9)
    .fill(null)
    .map((ele) => Array(9).fill(''));
};
const emptySolvedMark = function (): boolean[][] {
  return Array(9)
    .fill(null)
    .map((ele) => Array(9).fill(false));
};
const testBoard: string[][] = [
  ['1', '5', '4', '7', '2', '6', '8', '9', '3'],
  ['7', '9', '8', '1', '5', '3', '6', '2', '4'],
  ['6', '2', '3', '4', '9', '8', '1', '7', '5'],
  ['5', '6', '1', '3', '4', '7', '2', '8', '9'],
  ['4', '7', '2', '8', '6', '9', '3', '5', '1'],
  ['3', '8', '9', '5', '1', '2', '7', '4', '6'],
  ['8', '4', '5', '2', '3', '1', '9', '6', '7'],
  ['2', '3', '6', '9', '7', '4', '5', '1', '8'],
  ['9', '1', '7', '6', '8', '5', '4', '3', '2']
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
  let [input, setInput] = useState(emptyBoard);
  let [board, setBoard] = useState(testBoard);
  let [checkResult, setCheckResult] = useState('');
  let [invalidInfo, setInvalid] = useState<InvalidInfo | null>(null);
  let [solvedMarks, setSolvedMark] = useState(emptySolvedMark);
  function onTextChange(row: number, col: number, newVal: string) {
    if (isNumberValid(newVal)) {
      let newInput = input.map((arr) => arr.slice());
      newInput[row][col] = newVal;
      setInput(newInput);
      setBoard(newInput);
    }
  }

  function checkIsValid(): boolean {
    const VALID_HINT = 'Valid input:)';
    const INVALID_HINT = 'You have made some mistakes, highlighted in red!';
    const invalidInfo = isValidSudoku(board);
    setCheckResult(invalidInfo ? INVALID_HINT : VALID_HINT);
    setInvalid(invalidInfo);
    return invalidInfo === null;
  }

  function reset() {
    setCheckResult('');
    setInvalid(null);
    setInput(emptyBoard);
    setBoard(emptyBoard);
    setSolvedMark(emptySolvedMark);
  }

  function solve() {
    if (checkIsValid()) {
      let newSolvedMark = solvedMarks.map((arr) => arr.slice());
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          newSolvedMark[i][j] = input[i][j] === '';
        }
      }
      let newOutput = solveSudoku(board);
      if (newOutput === null) {
        setCheckResult('Sorry! I have no solution!');
        return;
      }
      setBoard(newOutput);
      setSolvedMark(newSolvedMark);
    }
  }

  let hintClass = 'hint-txt';
  if (invalidInfo) {
    hintClass += ' invalid-hint';
  }
  let content = (
    <>
      <Board
        squares={board}
        solvedMarks={solvedMarks}
        onTextChange={onTextChange}
        invalidInfo={invalidInfo}
      />
      <button onClick={() => checkIsValid()}>Check is valid</button>
      <p className={hintClass}>{checkResult}</p>
      <button onClick={() => reset()}>Reset</button>
      <button onClick={() => solve()}>Solve</button>
    </>
  );
  return <div className="App">{content}</div>;
};

export default App;
