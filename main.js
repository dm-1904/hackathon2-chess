import { startingPossitions } from "./starting-possitions.js";
import { checkLegalMoves } from "./moves.js";

const bannerBox = document.querySelector(".welcome-banner-box");
const bannerImg = document.createElement("img");
const welcomeForm = document.createElement("form");
const welcomeHeader = document.createElement("h1");
const plsEnterNames = document.createElement("span");
const p1Label = document.createElement("label");
const p1Input = document.createElement("input");
const p2Label = document.createElement("label");
const p2Input = document.createElement("input");
const submitButton = document.createElement("button");

// Set up form elements
bannerImg.className = "welcome-banner";
bannerImg.src = "./assets/scroll-png-26393.png";
welcomeForm.className = "welcome-form";
welcomeHeader.textContent = "Welcome to Chess!";
plsEnterNames.textContent = "Please enter player names";
p1Label.textContent = "White Player:";
p2Label.textContent = "Black Player:";
p1Input.type = "text";
p2Input.type = "text";
p1Input.required = true;
p2Input.required = true;
submitButton.textContent = "Start Game";

// Append form elements
welcomeForm.appendChild(welcomeHeader);
welcomeForm.appendChild(plsEnterNames);
welcomeForm.appendChild(p1Label);
welcomeForm.appendChild(p1Input);
welcomeForm.appendChild(p2Label);
welcomeForm.appendChild(p2Input);
welcomeForm.appendChild(submitButton);

if (bannerBox) {
  bannerBox.appendChild(bannerImg);
  bannerBox.appendChild(welcomeForm);

  // Form submit handler
  welcomeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const headerImg = document.querySelector(".headerImg");
    const game = document.querySelector(".game");

    // Hide welcome banner and show game
    bannerBox.style.display = "none";
    headerImg.style.display = "block";
    game.style.display = "flex";
  });
}
export const gameState = {
  whosTurn: "white",
};

/**
 * Creates the chessboard and initializes the game state.
 * - Assigns colors to squares.
 * - Places pieces on the board based on starting positions.
 * - Adds event listeners to pieces for move handling.
 */
const createBoard = () => {
  const board = document.querySelector(".board");
  if (!board) return console.error("Board element not found");

  const turnDiv = document.querySelector(".whos-turn");
  if (turnDiv) {
    turnDiv.innerHTML = gameState.whosTurn;
  }

  const getSquareColor = (row, i) =>
    row % 2 === 0
      ? i % 2 === 0
        ? "light-square"
        : "dark-square"
      : i % 2 === 0
      ? "dark-square"
      : "light-square";

  /**
   * Assigns a color to a piece and adds an event listener for moves.
   * @param {HTMLElement} piece - The piece element.
   * @param {number} i - The index of the piece in the starting positions array.
   */
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
};

document.addEventListener("DOMContentLoaded", createBoard);
