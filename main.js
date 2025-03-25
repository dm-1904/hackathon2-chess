import { startingPossitions } from "./starting-possitions.js";

//  const selectedPiece = document.querySelector(".selected");
//  if (selectedPiece) {
//    selectedPiece.classList.remove("selected");
//  }

//  if (!piece.classList.contains("selected")) {
//    piece.classList.add("selected");
//  }
const checkLegalMoves = (e) => {
  const piece = e.currentTarget.parentElement;
  const selectedPiece = piece.classList.contains("selected");
  console.log(piece.id);
  document
    .querySelectorAll(".selected")
    .forEach((el) => el.classList.remove("selected"));
  if (!selectedPiece) {
    piece.classList.add("selected");
  }
};

const createBoard = () => {
  const board = document.querySelector(".board");
  if (!board) return console.error("Board element not found");

  const getSquareColor = (row, i) =>
    row % 2 === 0
      ? i % 2 === 0
        ? "light-square"
        : "dark-square"
      : i % 2 === 0
      ? "dark-square"
      : "light-square";

  const assignPieceColor = (piece, i) => {
    const color = i <= 15 ? "black" : i >= 48 ? "white" : null;
    if (color && piece.firstElementChild) {
      piece.firstElementChild.classList.add(color);
      piece.firstElementChild.addEventListener("click", checkLegalMoves);
    } else {
      console.warn(`Unexpected structure for piece at index ${i}`, piece);
    }
  };

  startingPossitions.forEach((start, i) => {
    const square = document.createElement("div");
    const row = Math.floor((63 - i) / 8) + 1;

    square.className = `square row-${row}`;
    // just added row. add column next
    square.id = i;
    square.classList.add(getSquareColor(row, i));
    board.appendChild(square);

    if (start) {
      square.innerHTML = start;
      const piece = square.children[0];
      if (piece) assignPieceColor(piece, i);
    }
  });
};

document.addEventListener("DOMContentLoaded", createBoard);
