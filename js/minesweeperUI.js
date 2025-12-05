class MinesweeperUI {
  constructor(rowCount, colCount, cellSize) {
    this._rowCount = rowCount;
    this._colCount = colCount;
    this._cellSize = cellSize;

    this._mineCountEl = document.querySelector("#mine-count");
    this._gameboardEl = document.querySelector(".game-board");
    this._modalOverlayEl = document.querySelector(".modal-overlay");
    this._modalMessageEl = document.querySelector(".modal__message");

    this._cellGrid = [];
  }

  updateStats(mineCount) {
    this._mineCountEl.textContent = mineCount;
  }

  renderCells() {
    for (let i = 0; i < this._rowCount; i++) {
      const rowEl = document.createElement("div");
      const rowCells = [];

      rowEl.classList.add("game-board__row");

      for (let j = 0; j < this._colCount; j++) {
        const cellEl = document.createElement("div");

        cellEl.classList.add("game-board__cell");
        cellEl.dataset.row = i;
        cellEl.dataset.col = j;
        cellEl.style.width = this._cellSize + "px";
        cellEl.style.height = this._cellSize + "px";

        rowEl.append(cellEl);
        rowCells.push(cellEl);
      }

      this._gameboardEl.append(rowEl);
      this._cellGrid.push(rowCells);
    }
  }

  revealCellValue(row, col, cellValue) {
    const cellEl = this._cellGrid[row][col];

    cellEl.classList.add("game-board__cell--revealed");

    cellEl.textContent =
      cellValue === -1 ? "💥" : cellValue > 0 ? cellValue : "";

    if (cellValue > 0) {
      const numberColors = [
        "#0000FE", "#007F0E", "#FF0000", "#00007F",
        "#7F0000", "#007F7F", "#000000", "#7F7F7F"
      ];
      cellEl.style.color = numberColors[cellValue - 1];
    }
  }

  toggleModal(message) {
    const isVisible = this._modalOverlayEl.classList.toggle("modal-overlay--visible");
    this._modalMessageEl.textContent = isVisible ? message : "";
  }

  resetCells() {
    this._cellGrid.forEach((rowCells) => {
      rowCells.forEach((cellEl) => {
        cellEl.classList.remove("game-board__cell--revealed");
        cellEl.style.color = "";
        cellEl.textContent = "";
      });
    });
  }
}

export default MinesweeperUI;