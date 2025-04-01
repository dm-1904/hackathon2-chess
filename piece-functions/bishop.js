import { movePiece } from "../moves.js";

/**
 * Handles the logic for determining valid moves for a bishop.
 * - The Bishop can move any number of squares diagonally, stays on same color.
 * - The Bishop cannot jump over other pieces.
 * - The Bishop can capture opponent pieces but cannot capture pieces of the same color.
 * - Highlights valid moves and marks opponent pieces as vulnerable.
 * - Functions the same as Rook but moves diagonally.
 * @param {HTMLElement} piece
 * @param {number} currentRow
 * @param {string} columnLetter
 */
export const bishop = (piece, currentRow, columnLetter) => {
  const isBlack = piece.children[0].classList.contains("black");
  const validMoves = [];
  const columns = "ABCDEFGH";
  const columnIndex = columns.indexOf(columnLetter);

  // Diretions for rook movement: down left, up right, down right, up left
  const directions = [
    { dRow: 1, dCol: -1 }, // Down Left
    { dRow: -1, dCol: 1 }, // Up Right
    { dRow: 1, dCol: 1 }, // Down Right
    { dRow: -1, dCol: -1 }, // Up Left
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
};
