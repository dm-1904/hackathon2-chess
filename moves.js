import {
  king,
  pawn,
  bishop,
  queen,
  rook,
  knight,
} from "./piece-functions/piece-functions.js";
import { gameState, recordMove } from "./main.js";

export const capturedPieces = []; // Array to store captured pieces

/**
 * gameScores
 * - An object that tracks the scores for the white and black players.
 * - Updated whenever a piece is captured.
 * - Used in conjunction with `addScoreTogether()` to calculate and update scores.
 */
export const gameScores = {
  white: 0,
  black: 0,
};

/**
 * updateScoreDisplay()
 * - Updates the score display in the game's UI based on the current `gameScores`.
 * - Selects the DOM elements for the white and black scores using their class names.
 * - Updates the `textContent` of these elements with the current scores.
 * - Ensures the displayed scores are always in sync with the actual game state.
 */
export const updateScoreDisplay = () => {
  const whiteScoreEl = document.querySelector(".white-score");
  const blackScoreEl = document.querySelector(".black-score");
  if (whiteScoreEl) whiteScoreEl.textContent = gameScores.white;
  if (blackScoreEl) blackScoreEl.textContent = gameScores.black;
};

/**
 * Selects the appropriate move logic based on the piece type.
 * @param {string} selector - The type of the piece (e.g., "pawn").
 * @param {HTMLElement} piece - The piece element.
 * @param {number} rowNumber - The current row of the piece.
 * @param {string} columnLetter - The current column of the piece.
 */
const moveSelector = (selector, piece, rowNumber, columnLetter) => {
  if (selector === "pawn") pawn(piece, rowNumber, columnLetter);
  if (selector === "rook") rook(piece, rowNumber, columnLetter);
  if (selector === "bishop") bishop(piece, rowNumber, columnLetter);
  if (selector === "queen") queen(piece, rowNumber, columnLetter);
  if (selector === "king") king(piece, rowNumber, columnLetter);
  if (selector === "knight") knight(piece, rowNumber, columnLetter);
};

/**
 * Handles the logic for selecting a piece and displaying its valid moves.
 * @param {Event} e - The click event triggered by selecting a piece.
 */
export const checkLegalMoves = (e) => {
  const piece = e.currentTarget.parentElement;
  const selectedPiece = piece.classList.contains("selected");

  // Ensure the piece belongs to the current player
  if (!e.currentTarget.classList.contains(gameState.whosTurn)) return;

  // Clear previous selections and valid moves
  document
    .querySelectorAll(".selected")
    .forEach((el) => el.classList.remove("selected"));
  document
    .querySelectorAll(".valid-move")
    .forEach((el) => el.classList.remove("valid-move"));
  document
    .querySelectorAll(".vulnerable")
    .forEach((el) => el.classList.remove("vulnerable"));

  // Toggle selection
  if (!selectedPiece) {
    piece.classList.add("selected");
  }

  const rowFromParentClass = Array.from(piece.parentElement.classList).find(
    (cls) => cls.startsWith("row-")
  );
  const rowNumber = Number(rowFromParentClass.slice(-1));

  const columnFromParentClass = Array.from(piece.parentElement.classList).find(
    (cls) => cls.startsWith("column")
  );
  const columnLetter = columnFromParentClass.slice(-1);

  if (!selectedPiece) {
    moveSelector(piece.id, piece, rowNumber, columnLetter);
  }
};

/**
 * Adds score based on the captured piece's data-score attribute.
 * @param {HTMLElement} capturedPiece - The captured piece element.
 * @param {string} capturingColor - The color of the capturing piece ("white" or "black").
 */
export const addScoreTogether = (capturedPiece, capturingColor) => {
  const score = parseInt(capturedPiece.dataset.score) || 0;
  gameScores[capturingColor] += score;
  updateScoreDisplay();
  console.log(`${capturingColor}'s score: ${gameScores[capturingColor]}`);
};

/**
 * Handles the logic for king capture and displays the winner.
 * @param {HTMLElement} capturedPiece - The captured piece element.
 * @param {string} capturingColor - The color of the capturing piece ("white" or "black").
 */
export const handleKingCapture = (capturedPiece, capturingColor) => {
  const game = document.querySelector(".game");
  const bannerBox = document.querySelector(".welcome-banner-box");
  const welcomeForm = document.querySelector(".welcome-form");
  const headerImg = document.querySelector(".headerImg");
  const yourTurn = document.querySelector(".your-turn");

  if (capturedPiece.id === "king") {
    const winner = gameState.players[capturingColor];
    // Hide game, form, and header image
    game.style.display = "none";
    headerImg.style.display = "none";
    yourTurn.style.display = "none";
    if (welcomeForm) welcomeForm.style.display = "none";

    // Show and update banner
    bannerBox.style.display = "flex";
    bannerBox.style.flexDirection = "column";
    bannerBox.style.alignItems = "center";
    bannerBox.innerHTML = ""; // Clear any existing content

    const victoryText = document.createElement("h1");
    victoryText.textContent = `Checkmate! ${winner} Wins!`;
    victoryText.className = "victory-text";

    const newGameButton = document.createElement("button");
    newGameButton.textContent = "New Game";
    newGameButton.className = "new-game-button";
    newGameButton.addEventListener("click", () => {
      window.location.reload();
    });

    bannerBox.appendChild(victoryText);
    bannerBox.appendChild(newGameButton);
  }
};

/**
 * Moves a piece to the target square and updates the game state.
 * @param {HTMLElement} piece - The piece element to move.
 * @param {HTMLElement} targetSquare - The square to move the piece to.
 */
export const movePiece = (piece, targetSquare) => {
  // Ensure the piece is selected before moving
  if (!piece.classList.contains("selected")) {
    console.warn("Cannot move a piece that is not selected.");
    return;
  }

  // Clear the current square
  const currentSquare = piece.parentElement;
  currentSquare.innerHTML = "";

  const fromSquare = currentSquare.id;
  const toSquare = targetSquare.id;

  // Record the move
  recordMove(piece, fromSquare, toSquare);

  // Handle captured pieces
  const capturedPiece = targetSquare.querySelector(".piece");
  if (capturedPiece) {
    const capturingColor = piece.children[0].classList.contains("white")
      ? "white"
      : "black";

    // Check for king capture before removing the piece
    handleKingCapture(capturedPiece, capturingColor);

    // Calculate score before the piece is removed from the board
    addScoreTogether(capturedPiece, capturingColor);

    // Store the captured piece
    capturedPiece.classList.add("captured");
    capturedPieces.push(capturedPiece);

    // Preserve the original piece structure
    const capturedContainer = document.querySelector(
      `.captured-container.${gameState.whosTurn}`
    );

    if (capturedContainer) {
      // Clone the piece with its full structure
      const capturedClone = capturedPiece.cloneNode(true);
      // Ensure the SVG retains its class for color
      const svgElement = capturedClone.querySelector("svg");
      svgElement.classList.add(
        capturedPiece.querySelector("svg").classList.contains("white")
          ? "white"
          : "black"
      );
      capturedContainer.appendChild(capturedClone);
    }
  }

  // Move the piece to the target square
  targetSquare.innerHTML = "";
  targetSquare.appendChild(piece);

  // Clear valid moves and selection
  document
    .querySelectorAll(".valid-move")
    .forEach((square) => square.classList.remove("valid-move"));
  document
    .querySelectorAll(".selected")
    .forEach((el) => el.classList.remove("selected"));
  document
    .querySelectorAll(".vulnerable")
    .forEach((el) => el.classList.remove("vulnerable"));

  // Update the turn
  gameState.whosTurn = gameState.whosTurn === "white" ? "black" : "white";

  // Update the turn display with player name
  const turnDiv = document.querySelector(".whos-turn");
  if (turnDiv) {
    const currentPlayer = gameState.players[gameState.whosTurn];
    turnDiv.innerHTML = currentPlayer
      ? ` ${currentPlayer}`
      : ` ${gameState.whosTurn}`;
  }
};
