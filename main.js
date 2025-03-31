import { startingPossitions } from "./starting-possitions.js";
import { checkLegalMoves } from "./moves.js";

export const gameState = {
  whosTurn: "white",
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
    } else {
      console.warn(`Unexpected structure for piece at index ${i}`, piece);
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
};

document.addEventListener("DOMContentLoaded", createBoard);
