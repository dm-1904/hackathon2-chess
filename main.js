import { startingPossitions } from "./starting-possitions.js";

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
    } else {
      console.warn(`Unexpected structure for piece at index ${i}`, piece);
    }
  };

  startingPossitions.forEach((start, i) => {
    const square = document.createElement("div");
    const row = Math.floor((63 - i) / 8) + 1;

    square.className = "square";
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
