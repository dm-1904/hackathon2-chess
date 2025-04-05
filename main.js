import { startingPossitions } from "./starting-possitions.js";
import { checkLegalMoves } from "./moves.js";

localStorage.removeItem("chessPlayers");

export const gameState = {
  whosTurn: "white",
  players: {
    white: "",
    black: "",
  },
  moveHistory: [], // Add this
};

/**
 * Records a move in the game history and updates the display.
 * @param {HTMLElement} piece - The piece that was moved.
 * @param {string} fromSquare - The starting square ID.
 * @param {string} toSquare - The destination square ID.
 */
export const recordMove = (piece, fromSquare, toSquare) => {
  const pieceType = piece.id;
  const player = gameState.players[gameState.whosTurn];
  const moveNumber = gameState.moveHistory.length + 1;

  // Convert numeric squares to chess notation (e.g., 0 -> a1, 7 -> h1, etc.)
  const getSquareNotation = (squareId) => {
    const row = 8 - Math.floor(squareId / 8);
    const col = String.fromCharCode(97 + (squareId % 8)); // 97 is ASCII for 'a'
    return `${col}${row}`;
  };

  const fromNotation = getSquareNotation(parseInt(fromSquare));
  const toNotation = getSquareNotation(parseInt(toSquare));

  const moveText = `${moveNumber}. ${player} - ${pieceType} - ${fromNotation} - ${toNotation}`;

  gameState.moveHistory.push(moveText);
  updateMoveHistory();
};

/**
 * Updates the move history display with the current game history.
 * Automatically scrolls to show the latest move.
 */
const updateMoveHistory = () => {
  const historyDisplay = document.querySelector(".move-history");
  if (historyDisplay) {
    historyDisplay.innerHTML = gameState.moveHistory
      .map((move) => `<div class="move">${move}</div>`)
      .join("");
    historyDisplay.scrollTop = historyDisplay.scrollHeight;
  }
};

/**
 * Creates and initializes the welcome form with player name inputs.
 * Sets up form submission handler to start the game.
 */
const createWelcomeForm = () => {
  const bannerBox = document.querySelector(".welcome-banner-box");
  const bannerImg = document.createElement("img");
  const welcomeForm = document.createElement("form");
  const welcomeHeader = document.createElement("h1");
  const plsEnterNames = document.createElement("span");
  const nameInputBox = document.createElement("div");
  const p1InputBox = document.createElement("div");
  const p1Label = document.createElement("label");
  const p1Input = document.createElement("input");
  const p2InputBox = document.createElement("div");
  const p2Label = document.createElement("label");
  const p2Input = document.createElement("input");
  const submitButton = document.createElement("button");

  // Set up form elements
  bannerImg.className = "welcome-banner";
  bannerImg.src = "./assets/scroll-png-26393.png";
  welcomeForm.className = "welcome-form";
  welcomeHeader.className = "welcome-header";
  welcomeHeader.textContent = "Welcome to Chess!";
  plsEnterNames.textContent = "Please enter player names";
  nameInputBox.className = "name-input-box";
  p1InputBox.className = "p1-input-box";
  p1Label.className = "white-label";
  p1Label.textContent = "White";
  p2InputBox.className = "p2-input-box";
  p2Label.className = "black-label";
  p2Label.textContent = "Black";
  p1Input.type = "text";
  p2Input.type = "text";
  p1Input.required = true;
  p2Input.required = true;
  submitButton.textContent = "Start Game";

  // Append form elements
  welcomeForm.appendChild(welcomeHeader);
  welcomeForm.appendChild(plsEnterNames);
  welcomeForm.appendChild(nameInputBox);
  nameInputBox.appendChild(p1InputBox);
  p1InputBox.appendChild(p1Label);
  p1InputBox.appendChild(p1Input);
  nameInputBox.appendChild(p2InputBox);
  p2InputBox.appendChild(p2Label);
  p2InputBox.appendChild(p2Input);
  welcomeForm.appendChild(submitButton);

  if (bannerBox) {
    bannerBox.appendChild(bannerImg);
    bannerBox.appendChild(welcomeForm);

    // Form submit handler
    welcomeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      gameState.players.white = p1Input.value;
      gameState.players.black = p2Input.value;
      localStorage.setItem("chessPlayers", JSON.stringify(gameState.players));
      updatePlayerDisplays();

      const headerImg = document.querySelector(".headerImg");
      const yourTurn = document.querySelector(".your-turn");
      const game = document.querySelector(".game");
      bannerBox.style.display = "none";
      headerImg.style.display = "block";
      game.style.display = "flex";
      yourTurn.style.display = "flex";
    });
  }
};

/**
 * Updates the turn display with the current player's name.
 * Shows default color if no player name is available.
 */
const updateTurnDisplay = () => {
  const turnDiv = document.querySelector(".whos-turn");
  if (turnDiv) {
    const currentPlayer = gameState.players[gameState.whosTurn];
    turnDiv.innerHTML = currentPlayer
      ? ` ${currentPlayer}`
      : ` ${gameState.whosTurn}`;
  }
};

/**
 * Updates all player-related displays including:
 * - Captured pieces headers
 * - Turn indicator
 */
const updatePlayerDisplays = () => {
  // Update captured pieces headers
  const whiteHeader = document.querySelector(".captured-white h3");
  const blackHeader = document.querySelector(".captured-black h3");
  if (whiteHeader) whiteHeader.textContent = `${gameState.players.white}`;
  if (blackHeader) blackHeader.textContent = `${gameState.players.black}`;

  // Update turn display
  updateTurnDisplay();
};

/**
 * Creates the chessboard and initializes the game state.
 * - Assigns colors to squares.
 * - Places pieces on the board based on starting positions.
 * - Adds event listeners to pieces for move handling.
 */
const createBoard = () => {
  const board = document.querySelector(".board");
  if (!board) return console.error("Board element not found");

  const turnDiv = document.querySelector(".whos-turn");
  if (turnDiv) {
    turnDiv.innerHTML = gameState.whosTurn;
  }

  const getSquareColor = (row, i) =>
    row % 2 === 0
      ? i % 2 === 0
        ? "light-square"
        : "dark-square"
      : i % 2 === 0
      ? "dark-square"
      : "light-square";

  /**
   * Assigns a color to a piece and adds an event listener for moves.
   * @param {HTMLElement} piece - The piece element.
   * @param {number} i - The index of the piece in the starting positions array.
   */
  const assignPieceColor = (piece, i) => {
    const color = i <= 15 ? "black" : i >= 48 ? "white" : null;
    if (color && piece.firstElementChild) {
      piece.firstElementChild.classList.add(color);
      piece.firstElementChild.addEventListener("click", checkLegalMoves);
    }
  };

  startingPossitions.forEach((start, i) => {
    const column = "ABCDEFGH";
    const square = document.createElement("div");
    const row = Math.floor((63 - i) / 8) + 1;

    square.className = `square row-${row} column-${column[i % 8]}`;
    square.id = i;
    square.classList.add(getSquareColor(row, i));
    board.appendChild(square);

    if (start) {
      square.innerHTML = start;
      const piece = square.children[0];
      if (piece) assignPieceColor(piece, i);
    }
  });

  updateTurnDisplay();
};

document.addEventListener("DOMContentLoaded", () => {
  createWelcomeForm();
  createBoard();
});
