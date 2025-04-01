import { calculateMoves } from "./sharedMoves.js";
import { movePiece } from "../moves.js";

/**
 * Handles the logic for determining valid moves for a bishop.
 * - The bishop can move any number of squares diagonally.
 * @param {HTMLElement} piece - The bishop piece element.
 * @param {number} currentRow - The current row of the bishop.
 * @param {string} columnLetter - The current column of the bishop.
 */
export const bishop = (piece, currentRow, columnLetter) => {
  const directions = [
    { dRow: 1, dCol: -1 }, // Down Left
    { dRow: -1, dCol: 1 }, // Up Right
    { dRow: 1, dCol: 1 }, // Down Right
    { dRow: -1, dCol: -1 }, // Up Left
  ];
  calculateMoves(piece, currentRow, columnLetter, directions);
};

/**
 * Handles the logic for determining valid moves for a rook.
 * - The rook can move any number of squares vertically or horizontally.
 * @param {HTMLElement} piece - The rook piece element.
 * @param {number} currentRow - The current row of the rook.
 * @param {string} columnLetter - The current column of the rook.
 */
export const rook = (piece, currentRow, columnLetter) => {
  const directions = [
    { dRow: 1, dCol: 0 }, // Down
    { dRow: -1, dCol: 0 }, // Up
    { dRow: 0, dCol: 1 }, // Right
    { dRow: 0, dCol: -1 }, // Left
  ];
  calculateMoves(piece, currentRow, columnLetter, directions);
};

/**
 * Handles the logic for determining valid moves for a queen.
 * - The queen can move any number of squares vertically, horizontally, or diagonally.
 * - Combines the movement logic of both the rook and the bishop.
 * @param {HTMLElement} piece - The queen piece element.
 * @param {number} currentRow - The current row of the queen.
 * @param {string} columnLetter - The current column of the queen.
 */
export const queen = (piece, currentRow, columnLetter) => {
  const directions = [
    { dRow: 1, dCol: 0 }, // Down
    { dRow: -1, dCol: 0 }, // Up
    { dRow: 0, dCol: 1 }, // Right
    { dRow: 0, dCol: -1 }, // Left
    { dRow: 1, dCol: -1 }, // Down Left
    { dRow: -1, dCol: 1 }, // Up Right
    { dRow: 1, dCol: 1 }, // Down Right
    { dRow: -1, dCol: -1 }, // Up Left
  ];
  calculateMoves(piece, currentRow, columnLetter, directions);
};

/**
 * Handles the logic for determining valid moves for a king.
 * - The king can move one square in any direction.
 * - The king cannot move into a square that would place it in check.
 * @param {HTMLElement} piece - The king piece element.
 * @param {number} currentRow - The current row of the king.
 * @param {string} columnLetter - The current column of the king.
 */
export const king = (piece, currentRow, columnLetter) => {
  const directions = [
    { dRow: 1, dCol: 0 }, // Down
    { dRow: -1, dCol: 0 }, // Up
    { dRow: 0, dCol: 1 }, // Right
    { dRow: 0, dCol: -1 }, // Left
    { dRow: 1, dCol: -1 }, // Down Left
    { dRow: -1, dCol: 1 }, // Up Right
    { dRow: 1, dCol: 1 }, // Down Right
    { dRow: -1, dCol: -1 }, // Up Left
  ];
  const limit = 1; // Limit movement to one square
  calculateMoves(piece, currentRow, columnLetter, directions, limit);
};

/**
 * Handles the logic for determining valid moves for a pawn.
 * - Pawns can move forward one square if the square is empty.
 * - Pawns can move forward two squares from their starting position if both squares are empty.
 * - Pawns can capture diagonally if an opponent's piece is present.
 * - Highlights valid moves and marks opponent pieces as vulnerable.
 * @param {HTMLElement} piece - The pawn piece element.
 * @param {number} currentRow - The current row of the pawn.
 * @param {string} columnLetter - The current column of the pawn.
 */
export const pawn = (piece, currentRow, columnLetter) => {
  const isBlack = piece.children[0].classList.contains("black");
  const validMoves = [];
  const columns = "ABCDEFGH";
  const targetRow = isBlack ? currentRow - 1 : currentRow + 1;
  const doubleMoveRow = isBlack ? currentRow - 2 : currentRow + 2;

  // One step forward
  const targetSquare = document.querySelector(
    `.square.row-${targetRow}.column-${columnLetter}`
  );
  if (targetSquare && !targetSquare.querySelector(".piece")) {
    validMoves.push(targetSquare);
  }

  // Two steps forward from starting row
  if ((isBlack && currentRow === 7) || (!isBlack && currentRow === 2)) {
    const doubleMoveSquare = document.querySelector(
      `.square.row-${doubleMoveRow}.column-${columnLetter}`
    );
    if (doubleMoveSquare && !doubleMoveSquare.querySelector(".piece")) {
      validMoves.push(doubleMoveSquare);
    }
  }

  // Diagonal captures
  const leftDiagonalColumn = columns[columns.indexOf(columnLetter) - 1] || null;
  const rightDiagonalColumn =
    columns[columns.indexOf(columnLetter) + 1] || null;

  if (leftDiagonalColumn) {
    const leftDiagonalSquare = document.querySelector(
      `.square.row-${targetRow}.column-${leftDiagonalColumn}`
    );
    if (leftDiagonalSquare) {
      const leftPiece = leftDiagonalSquare.querySelector(".piece");

      if (
        leftPiece &&
        ((isBlack && leftPiece.children[0].classList.contains("white")) ||
          (!isBlack && leftPiece.children[0].classList.contains("black")))
      ) {
        validMoves.push(leftDiagonalSquare);
        leftPiece.classList.add("vulnerable");
      }
    }
  }

  if (rightDiagonalColumn) {
    const rightDiagonalSquare = document.querySelector(
      `.square.row-${targetRow}.column-${rightDiagonalColumn}`
    );
    if (rightDiagonalSquare) {
      const rightPiece = rightDiagonalSquare.querySelector(".piece");
      if (
        rightPiece &&
        ((isBlack && rightPiece.children[0].classList.contains("white")) ||
          (!isBlack && rightPiece.children[0].classList.contains("black")))
      ) {
        validMoves.push(rightDiagonalSquare);
        rightPiece.classList.add("vulnerable");
      }
    }
  }

  // Highlight valid moves and add listeners
  if (piece.classList.contains("selected")) {
    validMoves.forEach((square) => {
      square.classList.add("valid-move");
      square.addEventListener("click", () => movePiece(piece, square), {
        once: true,
      });
    });
  }
};
