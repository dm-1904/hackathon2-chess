export const checkLegalMoves = (e) => {
  const piece = e.currentTarget.parentElement;
  const selectedPiece = piece.classList.contains("selected");
  console.log(piece.id);

  // Always remove "selected" and "valid-move" classes
  document
    .querySelectorAll(".selected")
    .forEach((el) => el.classList.remove("selected"));
  document
    .querySelectorAll(".valid-move")
    .forEach((el) => el.classList.remove("valid-move"));

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

  console.log("Row:", rowNumber);
  console.log("Column:", columnLetter);

  if (!selectedPiece) {
    pawn(piece, rowNumber, columnLetter);
  }
};

const pawn = (piece, currentRow, currentColumn) => {
  console.log("Selected Piece:", piece);

  // Highlight only the square one row below the current row
  const targetRow = currentRow - 1;
  const targetSquare = document.querySelector(
    `.square.row-${targetRow}.column-${currentColumn}`
  );

  if (targetSquare) {
    targetSquare.classList.add("valid-move");

    // Add event listener to the valid square
    targetSquare.addEventListener(
      "click",
      () => movePiece(piece, targetSquare),
      {
        once: true,
      }
    );
  }
};

const movePiece = (piece, targetSquare) => {
  // Remove the piece from its current square
  const currentSquare = piece.parentElement;
  currentSquare.innerHTML = "";

  // Move the piece to the target square
  targetSquare.innerHTML = "";
  targetSquare.appendChild(piece);

  // Clear valid move highlights
  document
    .querySelectorAll(".valid-move")
    .forEach((square) => square.classList.remove("valid-move"));

  // Ensure the piece is no longer selected after moving
  document
    .querySelectorAll(".selected")
    .forEach((el) => el.classList.remove("selected"));

  console.log(`Moved piece to square: ${targetSquare.id}`);
};
