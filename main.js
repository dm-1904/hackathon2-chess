const createBoard = () => {
  const board = document.getElementsByClassName("board")[0];
  for (let i = 0; i < 64; i++) {
    const squares = document.createElement("div");
    squares.className = "square";
    squares.id = i;
    board.appendChild(squares);
  }
};

createBoard();
