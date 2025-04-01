import { movePiece } from "../moves.js";

/**
 * Handles the logic for determining valid moves for a piece based on its movement directions.
 * - The piece can move in specified directions until it encounters another piece or the board boundary.
 * - The piece cannot jump over other pieces.
 * - The piece can capture opponent pieces but cannot capture pieces of the same color.
 * - Highlights valid moves and marks opponent pieces as vulnerable.
 * @param {HTMLElement} piece - The piece element.
 * @param {number} currentRow - The current row of the piece.
 * @param {string} columnLetter - The current column of the piece.
 * @param {Array<{dRow: number, dCol: number}>} directions - The movement directions for the piece.
 * @param {number} limit - The maximum number of squares the piece can move in one direction (0 for unlimited).
 */
export const calculateMoves = (
  piece,
  currentRow,
  columnLetter,
  directions,
  limit = 0
) => {
  const isBlack = piece.children[0].classList.contains("black");
  const validMoves = [];
  const columns = "ABCDEFGH";

  const columnIndex = columns.indexOf(columnLetter);

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
    let steps = 0;

    while (true) {
      r += dRow;
      c += dCol;
      steps++;

      // Stop if the square is out of bounds or the movement limit is reached
      if (r < 1 || r > 8 || c < 0 || c > 7 || (limit > 0 && steps > limit))
        break;

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
};
