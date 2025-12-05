import MinesweeperBoard from "./minesweeperBoard.js";
import MinesweeperUI from "./minesweeperUI.js";

const gameboardEl = document.querySelector(".game-board");
const playAgainBtn = document.querySelector(".modal__btn--play-again");

const CELL_SIZE = 30;
const rowCount = Math.floor(gameboardEl.clientWidth / CELL_SIZE);
const colCount = rowCount;

const gameboard = new MinesweeperBoard(rowCount, colCount);
const gameboardUI = new MinesweeperUI(rowCount, colCount, CELL_SIZE);

gameboardUI.updateStats(gameboard.mineCount);
gameboardUI.renderCells();

let isCellClickDisabled = false;
gameboardEl.addEventListener("click", (e) => {
  const targetCell = e.target.closest(".game-board__cell");
  const isRevealed = targetCell?.classList.contains("game-board__cell--revealed");

  if (isCellClickDisabled || !targetCell || isRevealed) {
    return;
  }

  const row = parseInt(targetCell.dataset.row);
  const col = parseInt(targetCell.dataset.col);

  const isMine = gameboard.isMine(row, col);

  if (isMine) {
    isCellClickDisabled = true;

    const mineCoords = gameboard.revealAllMines(row, col);

    const intervalId = setInterval(() => {
      const [cx, cy] = mineCoords.shift();

      gameboardUI.revealCellValue(cx, cy, gameboard.board[cx][cy].value);

      new Audio("./audio/laser-sound.mp3").play();

      if (mineCoords.length === 0) {
        clearInterval(intervalId);

        setTimeout(() => {
          gameboardUI.toggleModal("You Lost!");
        }, 300);
      }
    }, 150);

    return;
  }

  const revealedCellCoords = gameboard.revealSafeAdjacentCells(row, col);

  revealedCellCoords.forEach(([cx, cy]) => {
    gameboardUI.revealCellValue(cx, cy, gameboard.board[cx][cy].value);
  });

  const playerWon = gameboard.hasPlayerWon();

  if (playerWon) {
    setTimeout(() => {
      gameboardUI.toggleModal("You Won!");
    }, 300);
  }
});

playAgainBtn.addEventListener("click", () => {
  isCellClickDisabled = false;

  gameboard.resetBoard();
  gameboardUI.resetCells();
  gameboardUI.toggleModal();
});