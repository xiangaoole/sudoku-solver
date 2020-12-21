export interface InvalidInfo {
  row: Set<number>;
  col: Set<number>;
  box: Set<number>;
}
export const isValidSudoku = function (board: string[][]): InvalidInfo | null {
  let result: InvalidInfo = { row: new Set(), col: new Set(), box: new Set() };
  let valid = true;
  let rows = new Array(9);
  let columns = new Array(9);
  let boxes = new Array(9);
  for (let i = 0; i < 9; i++) {
    rows[i] = {};
    columns[i] = {};
    boxes[i] = {};
  }
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === '') continue;
      let number = board[i][j]; //string number

      if (rows[i][number] !== undefined) {
        result.row.add(i);
        valid = false;
      } else {
        rows[i][number] = true;
      }

      if (columns[j][number] !== undefined) {
        result.col.add(j);
        valid = false;
      } else {
        columns[j][number] = true;
      }

      let boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
      if (boxes[boxIndex][number] !== undefined) {
        valid = false;
        result.box.add(boxIndex);
      } else {
        boxes[boxIndex][number] = true;
      }
    }
  }
  if (!valid) {
    console.log(result);
    return result;
  }
  return null;
};

function _backTrack(
  board: string[][],
  index: number,
  rows: boolean[][],
  columns: boolean[][],
  boxes: boolean[][]
): boolean {
  if (index === 81) return true; // track through successfully
  let row = index % 9;
  let col = Math.floor(index / 9);
  if (board[row][col] === '') {
    for (let i = 0; i < 9; i++) {
      let boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      if (!rows[row][i] && !columns[col][i] && !boxes[boxIndex][i]) {
        //put in a free number
        rows[row][i] = true;
        columns[col][i] = true;
        boxes[boxIndex][i] = true;
        board[row][col] = String(i + 1);
        if (_backTrack(board, index + 1, rows, columns, boxes)) {
          return true;
        }
        //recover to origin
        board[row][col] = '';
        rows[row][i] = false;
        columns[col][i] = false;
        boxes[boxIndex][i] = false;
      }
    }
    return false; // no free number available, this trial failed
  } else {
    // Skip the number
    return _backTrack(board, index + 1, rows, columns, boxes);
  }
}

export const solveSudoku = function (board: string[][]): string[][] | null {
  // deep copy the two-dimentional array
  const solvedBoard = board.map((arr) => arr.slice());
  // Construct the three arrays saving if number is contained
  let rows = new Array(9);
  let columns = new Array(9);
  let boxes = new Array(9);
  for (let i = 0; i < 9; i++) {
    rows[i] = Array(9).fill(false);
    columns[i] = Array(9).fill(false);
    boxes[i] = Array(9).fill(false);
  }
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (solvedBoard[i][j] === '.') continue;
      let number = Number(solvedBoard[i][j]) - 1; //number
      let boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
      rows[i][number] = true;
      columns[j][number] = true;
      boxes[boxIndex][number] = true;
    }
  }

  if (!_backTrack(solvedBoard, 0, rows, columns, boxes)) {
    return null;
  }

  return solvedBoard;
};
