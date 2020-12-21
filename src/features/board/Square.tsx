import React from 'react';

function Square(props) {
  let className = 'square';
  const { col, row, onTextChange, solved, invalidInfo } = props;
  if (row % 3 === 0) {
    className += ' top-line';
  } else if (row % 3 === 2) {
    className += ' bottom-line';
  }
  if (col % 3 === 0) {
    className += ' left-line';
  } else if (col % 3 === 2) {
    className += ' right-line';
  }

  if (invalidInfo) {
    let invalidLevel = 0;
    let boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    if (invalidInfo.row.has(row)) invalidLevel++;
    if (invalidInfo.col.has(col)) invalidLevel++;
    if (invalidInfo.box.has(boxIndex)) invalidLevel++;
    if (invalidLevel === 1) {
      className += ' invalid-one';
    } else if (invalidLevel === 2) {
      className += ' invalid-two';
    } else if (invalidLevel === 3) {
      className += ' invalid-three';
    }
  }

  return (
    <input
      size={2}
      readOnly={solved}
      className={className}
      onChange={(e) => onTextChange(row, col, e.target.value)}
      value={props.value}
    />
  );
}

export default Square;
