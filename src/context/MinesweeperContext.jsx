import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

export const MinesweeperContext = createContext();

export function MinesweeperProvider({ children }) {
  const [boardState, setBoardState] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [flagCount, setFlagCount] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [localStorageData, setLocalStorageData] = useState(null);
  const [correctFlagsOnMines, setCorrectFlagsOnMines] = useState(0);

  const difficultySettings = useMemo(
    () => ({
      easy: { rows: 8, cols: 8, mines: 10 },
      medium: { rows: 16, cols: 16, mines: 40 },
      hard: { rows: 16, cols: 30, mines: 99 },
    }),
    []
  );

  // Initialize the board with empty cells and randomly placed mines
  const initializeBoard = useCallback(
    (difficulty) => {
      const { rows, cols, mines } = difficultySettings[difficulty];
      const board = {};

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          board[`${i}-${j}`] = {
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
          };
        }
      }

      let minesPlaced = 0;
      while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        const key = `${row}-${col}`;

        if (!board[key].isMine) {
          board[key].isMine = true;
          minesPlaced++;

          // Update adjacent cell counts for each mine placed
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              const newKey = `${newRow}-${newCol}`;

              if (
                newRow >= 0 &&
                newRow < rows &&
                newCol >= 0 &&
                newCol < cols &&
                !board[newKey].isMine
              ) {
                board[newKey].adjacentMines++;
              }
            }
          }
        }
      }

      setBoardState(board);
      setGameOver(false);
      setIsWin(false);
      setFlagCount(0);
      setCorrectFlagsOnMines(0);
    },
    [difficultySettings]
  );

  const saveGameData = useCallback(() => {
    // retrieve current game data
    const gameData = {
      boardState,
      gameOver,
      isWin,
      difficulty,
      flagCount,
      isFirstClick,
    };

    const jsonData = JSON.stringify(gameData);
    localStorage.setItem("minesweeperGame", jsonData);
    setLocalStorageData(jsonData);

    console.log("data saved!");
  }, [boardState, gameOver, isWin, difficulty, flagCount, isFirstClick]);

  const loadPreviousGameData = useCallback(() => {
    // retrieve saved data from local storage
    const savedData = localStorage.getItem("minesweeperGame");
    if (savedData) {
      const {
        boardState,
        gameOver,
        isWin,
        difficulty,
        flagCount,
        isFirstClick,
      } = JSON.parse(savedData);
      setBoardState(boardState);
      setGameOver(gameOver);
      setIsWin(isWin);
      setDifficulty(difficulty);
      setFlagCount(flagCount);
      setIsFirstClick(isFirstClick);
      console.log("Loaded!");
    } else {
      console.log("There is no historical data!");
      initializeBoard(difficulty);
    }
  }, [difficulty, initializeBoard]);

  const toggleFlag = useCallback(
    (row, col) => {
      if (gameOver) return;

      const key = `${row}-${col}`;
      const cell = boardState[key];

      if (!cell || cell.isRevealed) return;

      const newBoardState = { ...boardState };
      newBoardState[key].isFlagged = !cell.isFlagged;
      setBoardState(newBoardState);

      setFlagCount((prev) => (cell.isFlagged ? prev - 1 : prev + 1));
    },
    [boardState, gameOver]
  );

  useEffect(() => {
    console.log("Initial board setup");
    initializeBoard(difficulty);
  }, [difficulty, initializeBoard]);

  const checkWin = useCallback(() => {
    if (!boardState) return;

    const { rows, cols, mines } = difficultySettings[difficulty];
    let revealedCount = 0;

    for (const key in boardState) {
      if (boardState[key].isRevealed && !boardState[key].isMine) {
        revealedCount++;
      }
    }

    if (revealedCount === rows * cols - mines) {
      setGameOver(true);
      setIsWin(true);
    }
  }, [boardState, difficulty, difficultySettings]);

  // Reveals a cell, handles special logic for first click
  const revealCell = useCallback(
    (row, col) => {
      if (gameOver) return;

      const key = `${row}-${col}`;
      const cell = boardState[key];

      if (!cell || cell.isRevealed || cell.isFlagged) return;
      if (isFirstClick) {
        setIsFirstClick(false);
        // If the first click is mine, reset the board
        if (cell.isMine) {
          const { rows, cols, mines } = difficultySettings[difficulty];
          const newBoard = {};
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              newBoard[`${i}-${j}`] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
              };
            }
          }

          let minesPlaced = 0;
          while (minesPlaced < mines) {
            const mineRow = Math.floor(Math.random() * rows);
            const mineCol = Math.floor(Math.random() * cols);
            const mineKey = `${mineRow}-${mineCol}`;

            if (
              !newBoard[mineKey].isMine &&
              !(mineRow === row && mineCol === col)
            ) {
              newBoard[mineKey].isMine = true;
              minesPlaced++;

              for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                  const newRow = mineRow + i;
                  const newCol = mineCol + j;
                  const newKey = `${newRow}-${newCol}`;

                  if (
                    newRow >= 0 &&
                    newRow < rows &&
                    newCol >= 0 &&
                    newCol < cols &&
                    !newBoard[newKey].isMine
                  ) {
                    newBoard[newKey].adjacentMines++;
                  }
                }
              }
            }
          }

          newBoard[key].isRevealed = true;
          setBoardState(newBoard);
          return;
        }
      }

      const newBoardState = { ...boardState };
      newBoardState[key].isRevealed = true;

      if (cell.isMine) {
        setGameOver(true);
        setIsWin(false);
        Object.keys(boardState).forEach((k) => {
          if (boardState[k].isMine) {
            newBoardState[k].isRevealed = true;
          }
        });
      } else {
        if (cell.adjacentMines === 0) {
          const { rows, cols } = difficultySettings[difficulty];
          const revealSurrounding = (r, c) => {
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                const newRow = r + i;
                const newCol = c + j;
                const newKey = `${newRow}-${newCol}`;

                if (
                  newRow >= 0 &&
                  newRow < rows &&
                  newCol >= 0 &&
                  newCol < cols &&
                  !newBoardState[newKey].isRevealed &&
                  !newBoardState[newKey].isFlagged
                ) {
                  newBoardState[newKey].isRevealed = true;
                  if (newBoardState[newKey].adjacentMines === 0) {
                    revealSurrounding(newRow, newCol);
                  }
                }
              }
            }
          };
          revealSurrounding(row, col);
        }
      }
      setBoardState(newBoardState);
      checkWin();
    },
    [
      boardState,
      gameOver,
      isFirstClick,
      difficulty,
      difficultySettings,
      checkWin,
    ]
  );

  const updateCorrectCountOfFlagsOnMines = useCallback(() => {
    let totalCorrectCnt = 0;
    for (const key in boardState) {
      const cellState = boardState[key];
      if (cellState.isMine && cellState.isFlagged && !cellState.isRevealed) {
        totalCorrectCnt++;
      }
    }
    setCorrectFlagsOnMines(totalCorrectCnt);
  }, [boardState]);

  useEffect(() => {
    updateCorrectCountOfFlagsOnMines();
  }, [boardState, updateCorrectCountOfFlagsOnMines]);

  const resetGame = useCallback(() => {
    setIsFirstClick(true);
    initializeBoard(difficulty);
  }, [difficulty, initializeBoard]);

  const clearGameHistory = useCallback(() => {
    localStorage.removeItem("minesweeperGame");
    setLocalStorageData(null);
  }, []);

  // Provides game data and functions to the context
  const value = {
    boardState,
    gameOver,
    isWin,
    difficulty,
    flagCount,
    localStorageData,
    correctFlagsOnMines,
    difficultySettings,
    setDifficulty,
    revealCell,
    resetGame,
    toggleFlag,
    saveGameData,
    loadPreviousGameData,
    clearGameHistory,
  };

  return (
    <MinesweeperContext.Provider value={value}>
      {children}
    </MinesweeperContext.Provider>
  );
}
