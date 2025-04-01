import { movePiece } from "../moves.js";

/**
 * Handles the logic for determining valid moves for a rook.
 * - The rook can move any number of squares vertically or horizontally.
 * - The rook cannot jump over other pieces.
 * - The rook can capture opponent pieces but cannot capture pieces of the same color.
 * - Highlights valid moves and marks opponent pieces as vulnerable.
 * @param {HTMLElement} piece - The rook piece element.
 * @param {number} currentRow - The current row of the rook.
 * @param {string} columnLetter - The current column of the rook.
 */
export const rook = (piece, currentRow, columnLetter) => {
  const isBlack = piece.children[0].classList.contains("black");
  const validMoves = [];
  const columns = "ABCDEFGH";

  const columnIndex = columns.indexOf(columnLetter);

  // Directions for rook movement: down, up, right, left
  const directions = [
    { dRow: 1, dCol: 0 }, // Down
    { dRow: -1, dCol: 0 }, // Up
    { dRow: 0, dCol: 1 }, // Right
    { dRow: 0, dCol: -1 }, // Left
  ];

  /**
   * Checks if a piece on a square belongs to the opponent.
   * @param {HTMLElement} pieceOnSquare - The piece element on the square.
   * @returns {boolean} - True if the piece belongs to the opponent, false otherwise.
   */
  const isOpponentPiece = (pieceOnSquare) => {
    if (!pieceOnSquare || !pieceOnSquare.children[0]) return false;
    return isBlack
      ? pieceOnSquare.children[0].classList.contains("white")
      : pieceOnSquare.children[0].classList.contains("black");
  };

  // Process each direction for valid moves
  for (let { dRow, dCol } of directions) {
    let r = currentRow;
    let c = columnIndex;

    while (true) {
      r += dRow;
      c += dCol;

      // Stop if the square is out of bounds
      if (r < 1 || r > 8 || c < 0 || c > 7) break;

      const square = document.querySelector(
        `.square.row-${r}.column-${columns[c]}`
      );
      if (!square) break;

      const pieceOnSquare = square.querySelector(".piece");

      if (!pieceOnSquare) {
        validMoves.push(square); // Add empty square to valid moves
      } else {
        if (isOpponentPiece(pieceOnSquare)) {
          validMoves.push(square); // Add opponent's piece to valid moves
          pieceOnSquare.classList.add("vulnerable"); // Mark opponent's piece as vulnerable
        }
        break; // Stop processing further squares in this direction
      }
    }
  }

  // Highlight valid moves and add event listeners
  if (piece.classList.contains("selected")) {
    validMoves.forEach((square) => {
      square.classList.add("valid-move");
      square.addEventListener("click", () => movePiece(piece, square), {
        once: true,
      });
    });
  }

  console.log(
    "Valid rook moves:",
    validMoves.map((s) => s.className)
  );
};
