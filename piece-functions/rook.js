import { calculateMoves } from "./sharedMoves.js";

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
