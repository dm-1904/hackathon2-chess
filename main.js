import { startingPossitions } from "./starting-possitions.js";
// import { possibleMoves } from "./moves.js";
import { checkLegalMoves } from "./moves.js";

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
    const column = "ABCDEFGH";
    const square = document.createElement("div");
    const row = Math.floor((63 - i) / 8) + 1;

    square.className = `square row-${row} column-${column[i % 8]}`;
    square.id = i;
    square.classList.add(getSquareColor(row, i));
    board.appendChild(square);

    if (start) {
      square.innerHTML = start;
      const piece = square.children[0];
      if (piece) assignPieceColor(piece, i);
    }
  });

  // const pieces = document.getElementsByClassName("piece");
  // Array.from(pieces).forEach((piece) => {
  //   piece.addEventListener("click", () => possibleMoves(piece.id));
  // });
};

document.addEventListener("DOMContentLoaded", createBoard);
