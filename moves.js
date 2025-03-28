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

  if (!selectedPiece) {
    moveSelector(piece.id, piece, rowNumber, columnLetter);
  }
};

const pawn = (piece, currentRow, currentColumn) => {
  const isBlack = piece.children[0].classList.contains("black");
  const validMoves = [];

  const targetRow = isBlack ? currentRow - 1 : currentRow + 1;
  const doubleMoveRow = isBlack ? currentRow - 2 : currentRow + 2;

  const targetSquare = document.querySelector(
    `.square.row-${targetRow}.column-${currentColumn}`
  );
  if (targetSquare) validMoves.push(targetSquare);

  if ((isBlack && currentRow === 7) || (!isBlack && currentRow === 2)) {
    const doubleMoveSquare = document.querySelector(
      `.square.row-${doubleMoveRow}.column-${currentColumn}`
    );
    if (doubleMoveSquare) validMoves.push(doubleMoveSquare);
  }

  if (piece.classList.contains("selected")) {
    validMoves.forEach((square) => {
      square.classList.add("valid-move");
      square.addEventListener("click", () => movePiece(piece, square), {
        once: true,
      });
    });
  }
};

const movePiece = (piece, targetSquare) => {
  // Ensure the piece has the "selected" class before moving
  if (!piece.classList.contains("selected")) {
    console.warn("Cannot move a piece that is not selected.");
    return;
  }

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
