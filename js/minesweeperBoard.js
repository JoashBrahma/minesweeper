class MinesweeperBoard {
  constructor(rowCount, colCount) {
    this._rowCount = rowCount;
    this._colCount = colCount;
    this._cellCount = this._rowCount * this._colCount;
    this._mineCount = Math.ceil(this._cellCount * 0.156);
    this._safeCellCount = this._cellCount - this._mineCount;
    this._revealedSafeCellCount = 0;

    this._createBoard();
    this._placeMines();
    this._setAdjacentinesCount();
  }

  get rowCount() {
    return this._rowCount;
  }

  get colCount() {
    return this._colCount;
  }

  get mineCount() {
    return this._mineCount;
  }

  get board() {
    return [...this._board];
  }

  _createBoard() {
    this._board =
      Array.from({ length: this._rowCount },
        () => Array.from({ length: this._colCount },
          () => ({ value: 0, isRevealed: false })));
  }

  _placeMines() {
    let count = this._mineCount;

    while (count > 0) {
      const row = Math.floor(Math.random() * this._rowCount);
      const col = Math.floor(Math.random() * this._colCount);
      const value = this._board[row][col].value;

      if (value === 0) {
        this._board[row][col].value = -1;
        count--;
      }
    }
  }

  _getAdjacentCoords(row, col) {
    return [
      [row - 1, col], // top
      [row + 1, col], // bottom
      [row, col - 1], // left
      [row, col + 1],  // right
      [row - 1, col - 1], // top-left
      [row - 1, col + 1], // top-right
      [row + 1, col - 1], // bottom-left
      [row + 1, col + 1] // bottom-right
    ];
  }

  _setAdjacentinesCount() {
    for (let i = 0; i < this._rowCount; i++) {
      for (let j = 0; j < this._colCount; j++) {
        if (this._board[i][j].value === -1) {
          continue;
        }

        const adjacentCoords = this._getAdjacentCoords(i, j);

        let adjacentMineCount = 0;

        for (let [cx, cy] of adjacentCoords) {
          if (
            cx >= 0 && cx < this._rowCount &&
            cy >= 0 && cy < this._colCount &&
            this._board[cx][cy].value === -1
          ) {
            adjacentMineCount++;
          }
        }

        this._board[i][j].value = adjacentMineCount;
      }
    }
  }

  revealSafeAdjacentCells(row, col, safeAdjacentCellsCoords = []) {
    if (
      row < 0 || row >= this._rowCount ||
      col < 0 || col >= this._colCount ||
      this._board[row][col].isRevealed
    ) {
      return safeAdjacentCellsCoords;
    }

    this._board[row][col].isRevealed = true;
    this._revealedSafeCellCount++;

    safeAdjacentCellsCoords.push([row, col]);

    if (this._board[row][col].value !== 0) {
      return safeAdjacentCellsCoords;
    }

    const adjacentCoords = this._getAdjacentCoords(row, col);
    adjacentCoords.forEach(([cx, cy]) => {
      this.revealSafeAdjacentCells(cx, cy, safeAdjacentCellsCoords);
    });

    return safeAdjacentCellsCoords;
  }

  isMine(row, col) {
    return this._board[row][col].value === -1;
  }

  revealAllMines(row, col) {
    const minesCoords = [[row, col]];

    for (let i = 0; i < this._rowCount; i++) {
      for (let j = 0; j < this._colCount; j++) {
        if (i === row && j === col) {
          continue;
        }

        if (this._board[i][j].value === -1) {
          this._board[i][j].isRevealed = true;
          minesCoords.push([i, j]);
        }
      }
    }

    return minesCoords;
  }

  hasPlayerWon() {
    return this._safeCellCount === this._revealedSafeCellCount;
  }

  resetBoard() {
    this._revealedSafeCellCount = 0;

    this._createBoard();
    this._placeMines();
    this._setAdjacentinesCount();
  }
}

export default MinesweeperBoard;