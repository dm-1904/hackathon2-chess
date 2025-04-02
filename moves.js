import {
  king,
  pawn,
  bishop,
  queen,
  rook,
  knight,
} from "./piece-functions/piece-functions.js";
import { gameState } from "./main.js";

export const capturedPieces = []; // Array to store captured pieces

export const gameScores = {
  white: 0,
  black: 0,
};

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

  // Handle captured pieces
  const capturedPiece = targetSquare.querySelector(".piece");
  if (capturedPiece) {
    const capturingColor = piece.children[0].classList.contains("white")
      ? "white"
      : "black";

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

  // Update the turn display
  const turnDiv = document.querySelector(".whos-turn");
  if (turnDiv) {
    turnDiv.innerHTML = gameState.whosTurn;
  }
};
