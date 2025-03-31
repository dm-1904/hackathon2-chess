import { pawn } from "./piece-functions/pawn.js";

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
  document
    .querySelectorAll(".vulnerable")
    .forEach((el) => el.classList.remove("vulnerable"));

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

export const movePiece = (piece, targetSquare) => {
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

  document
    .querySelectorAll(".vulnerable")
    .forEach((el) => el.classList.remove("vulnerable"));

  console.log(`Moved piece to square: ${targetSquare.id}`);
};
