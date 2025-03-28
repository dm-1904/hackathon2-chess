const moveSelector = (selector, piece, rowNumber, columnLetter) => {
  if (selector === "pawn") pawn(piece, rowNumber, columnLetter);
};

export const checkLegalMoves = (e) => {
  const piece = e.currentTarget.parentElement;
  const selectedPiece = piece.classList.contains("selected");
  console.log("piece.id", piece.id);

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
    console.log("piece", piece);
    moveSelector(piece.id, piece, rowNumber, columnLetter);
  }
};

const pawn = (piece, currentRow, currentColumn) => {
  console.log("Selected Piece:", piece);

  const targetRow = currentRow - 1;
  const targetSquare = document.querySelector(
    `.square.row-${targetRow}.column-${currentColumn}`
  );

  if (targetSquare) {
    targetSquare.classList.add("valid-move");

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
  const currentSquare = piece.parentElement;
  currentSquare.innerHTML = "";

  targetSquare.innerHTML = "";
  targetSquare.appendChild(piece);

  document
    .querySelectorAll(".valid-move")
    .forEach((square) => square.classList.remove("valid-move"));

  document
    .querySelectorAll(".selected")
    .forEach((el) => el.classList.remove("selected"));

  console.log(`Moved piece to square: ${targetSquare.id}`);
};
