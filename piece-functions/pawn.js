import { movePiece } from "../../moves.js";

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
