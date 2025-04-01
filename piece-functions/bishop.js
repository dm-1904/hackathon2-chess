import { calculateMoves } from "./sharedMoves.js";

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
