import React from 'react';
import Square from './Square';

function Board(props) {
  function renderSquare(row: number, col: number) {
    return (
      <Square
        key={row * 9 + col}
        row={row}
        col={col}
        invalidInfo={props.invalidInfo}
        solved={props.puzzle[row][col] !== props.board[row][col]}
        onTextChange={props.onTextChange}
        value={props.board[row][col]}
      />
    );
  }

  let board = [];
  for (let row = 0; row < 9; row++) {
    const cols = [];
    for (let col = 0; col < 9; col++) {
      cols.push(renderSquare(row, col));
    }
    board.push(
      <div className="board-row" key={row}>
        {cols}
      </div>
    );
  }

  return <div>{board}</div>;
}

export default Board;
