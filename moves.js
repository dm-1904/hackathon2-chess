import { pawn } from "./piece-functions/pawn.js";
import { rook } from "./piece-functions/rook.js";
import { gameState } from "./main.js";
import { bishop } from "./piece-functions/bishop.js";

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
};

/**
 * Handles the logic for selecting a piece and displaying its valid moves.
 * @param {Event} e - The click event triggered by selecting a piece.
 */
export const checkLegalMoves = (e) => {
  const piece = e.currentTarget.parentElement;
  const selectedPiece = piece.classList.contains("selected");
  if (!e.currentTarget.classList.contains(gameState.whosTurn)) return;

  document
    .querySelectorAll(".selected")
    .forEach((el) => el.classList.remove("selected"));
  document
    .querySelectorAll(".valid-move")
    .forEach((el) => el.classList.remove("valid-move"));
  document
    .querySelectorAll(".vulnerable")
    .forEach((el) => el.classList.remove("vulnerable"));

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
 * Moves a piece to the target square and updates the game state.
 * @param {HTMLElement} piece - The piece element to move.
 * @param {HTMLElement} targetSquare - The square to move the piece to.
 */
export const movePiece = (piece, targetSquare) => {
  if (!piece.classList.contains("selected")) {
    console.warn("Cannot move a piece that is not selected.");
    return;
  }

  const currentSquare = piece.parentElement;
  currentSquare.innerHTML = "";

  targetSquare.innerHTML = "";
  targetSquare.appendChild(piece);

  document
    .querySelectorAll(".valid-move")
    .forEach((square) => square.classList.remove("valid-move"));

  document
    .querySelectorAll(".selected")
    .forEach((el) => el.classList.remove("selected"));

  document
    .querySelectorAll(".vulnerable")
    .forEach((el) => el.classList.remove("vulnerable"));

  if (gameState.whosTurn === "white") {
    gameState.whosTurn = "black";
  } else {
    gameState.whosTurn = "white";
  }

  const turnDiv = document.querySelector(".whos-turn");
  if (turnDiv) {
    turnDiv.innerHTML = gameState.whosTurn;
  }

  console.log(`Moved piece to square: ${targetSquare.id}`);
};
