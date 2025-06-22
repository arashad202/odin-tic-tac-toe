function gameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];


  // Create a 2d array that will represent the state of the game board
  // For this 2d array, row 0 will represent the top row and
  // column 0 will represent the left-most column.
  // This nested-loop technique is a simple and common way to create a 2d array.
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(cell());
    }
  }

  // This will be the method of getting the entire board that our
  // UI will eventually need to render it.
  const getBoard = () => board;

  // In order to mark a cell, we need to find what the available cells of the
  // selected column is, *then* change that cell's value to the player mark
  const putMark = (row, column, player) => {
    // check if row,column is empty
    // put mark if empty if not then return
    if (board[row][column].getValue() === 0) {
      board[row][column].addMark(player);
    } else {
      return;
    }
  }

  // This method will be used to print our board to the console.
  // It is helpful to see what the board looks like after each turn as we play,
  // but we won't need it after we build our UI
  const printBoard = () => {
    const boardWithValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithValues);
  }

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return {getBoard, putMark, printBoard};
}

/*
** A Cell represents one "square" on the board and can have one of
** 0: no token is in the square,
** X: Player One's token,
** Y: Player 2's token
*/

function cell() {
  let value = 0;

  // Accept a player's token to change the value of the cell
  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMark,
    getValue
  }
}

/* 
** The GameController will be responsible for controlling the 
** flow and state of the game's turns, as well as whether
** anybody has won the game
*/

