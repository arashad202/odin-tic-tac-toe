function gameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(cell());
    }
  }

  const getBoard = () => board;

  const putMark = (row, column, player) => {
    if (board[row][column].getValue() === "") {
      board[row][column].addMark(player);
    }
  };

  return { getBoard, putMark };
}

function cell() {
  let value = "";

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addMark, getValue };
}

function GameController(playerOneName, playerTwoName) {
  const board = gameBoard();
  const players = [
    { name: playerOneName, token: "X" },
    { name: playerTwoName, token: "O" },
  ];

  let activePlayer = players[0];
  let gameOver = false;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;
  const getBoard = () => board.getBoard();

  const getPlayerByToken = (token) =>
    players.find((p) => p.token === token);

  const checkWinner = () => {
    const boardState = board.getBoard().map((row) =>
      row.map((cell) => cell.getValue())
    );

    // Rows
    for (let row of boardState) {
      if (row[0] !== "" && row.every((cell) => cell === row[0])) {
        return row[0];
      }
    }

    // Columns
    for (let col = 0; col < 3; col++) {
      if (
        boardState[0][col] !== "" &&
        boardState[0][col] === boardState[1][col] &&
        boardState[1][col] === boardState[2][col]
      ) {
        return boardState[0][col];
      }
    }

    // Diagonals
    if (
      boardState[0][0] !== "" &&
      boardState[0][0] === boardState[1][1] &&
      boardState[1][1] === boardState[2][2]
    ) {
      return boardState[0][0];
    }

    if (
      boardState[0][2] !== "" &&
      boardState[0][2] === boardState[1][1] &&
      boardState[1][1] === boardState[2][0]
    ) {
      return boardState[0][2];
    }

    return null;
  };

  const checkDraw = () => {
    const boardState = board.getBoard().map((row) =>
      row.map((cell) => cell.getValue())
    );
    return boardState.flat().every((cell) => cell !== "");
  };

  const playRound = (row, column) => {
    if (gameOver) return;

    row = Number(row);
    column = Number(column);

    if (board.getBoard()[row][column].getValue() !== "") return;

    board.putMark(row, column, activePlayer.token);

    const winnerToken = checkWinner();
    if (winnerToken) {
      gameOver = true;
    } else if (checkDraw()) {
      gameOver = true;
    } else {
      switchPlayerTurn();
    }
  };

  return {
    playRound,
    getActivePlayer,
    getBoard,
    isGameOver: () => gameOver,
    getWinnerToken: checkWinner,
    getPlayerByToken,
  };
}

function screenController() {
  let game = null;

  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const startBtn = document.getElementById("startBtn");

  const updateScreen = () => {
    boardDiv.textContent = "";
    if (!game) return;

    const board = game.getBoard();
    const winnerToken = game.getWinnerToken();

    if (game.isGameOver()) {
      if (winnerToken) {
        const winner = game.getPlayerByToken(winnerToken);
        playerTurnDiv.textContent = `${winner.name} wins! 🎉`;
      } else {
        playerTurnDiv.textContent = "It's a draw!";
      }
    } else {
      playerTurnDiv.textContent = `${game.getActivePlayer().name}'s turn...`;
    }

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellBtn = document.createElement("button");
        cellBtn.classList.add("cell", "text-4xl", "bg-white");
        cellBtn.textContent = cell.getValue();
        cellBtn.dataset.row = rowIndex;
        cellBtn.dataset.column = colIndex;

        if (cell.getValue() !== "" || game.isGameOver()) {
          cellBtn.disabled = true;
        }

        boardDiv.appendChild(cellBtn);
      });
    });
  };

  const clickHandlerBoard = (e) => {
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    if (!row || !column || !game) return;

    game.playRound(row, column);
    updateScreen();
  };

  const startGame = () => {
    const player1 = document.getElementById("player1").value || "Player 1";
    const player2 = document.getElementById("player2").value || "Player 2";
    game = GameController(player1, player2);
    updateScreen();
  };

  boardDiv.addEventListener("click", clickHandlerBoard);
  startBtn.addEventListener("click", startGame);

  updateScreen(); // Initial screen
}

screenController();