import { movePiece } from "../moves.js";

/**
 * Handles the logic for determining valid moves for a rook.
 * - Selects all squares in the same row and column as the rook.
 * @param {HTMLElement} piece - The rook piece element.
 * @param {number} currentRow - The current row of the rook.
 * @param {string} columnLetter - The current column of the rook.
 */
export const rook = (piece, currentRow, columnLetter) => {
  const isBlack = piece.children[0].classList.contains("black");
  const validMoves = [];

  // Select all squares in the same row
  const rowSquares = document.querySelectorAll(`.square.row-${currentRow}`);
  rowSquares.forEach((square) => {
    if (!square.querySelector(".piece")) {
      validMoves.push(square);
    } else if (
      square
        .querySelector(".piece")
        .children[0].classList.contains(isBlack ? "white" : "black")
    ) {
      validMoves.push(square);
      square.querySelector(".piece").classList.add("vulnerable");
    }
  });

  // Select all squares in the same column
  const columnSquares = document.querySelectorAll(
    `.square.column-${columnLetter}`
  );
  columnSquares.forEach((square) => {
    if (!square.querySelector(".piece")) {
      validMoves.push(square);
    } else if (
      square
        .querySelector(".piece")
        .children[0].classList.contains(isBlack ? "white" : "black")
    ) {
      validMoves.push(square);
      square.querySelector(".piece").classList.add("vulnerable");
    }
  });

  // Highlight valid moves and add listeners
  if (piece.classList.contains("selected")) {
    validMoves.forEach((square) => {
      square.classList.add("valid-move");
      square.addEventListener("click", () => movePiece(piece, square), {
        once: true,
      });
    });
  }

  console.log("Valid moves for rook:", validMoves);
};
