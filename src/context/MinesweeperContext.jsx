import { createContext, useState, useCallback, useMemo, useEffect } from 'react';

export const MinesweeperContext = createContext();

// Provides Minesweeper game state and functions to manipulate game data
export function MinesweeperProvider({ children }) {
  const [boardState, setBoardState] = useState({}); 
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [flagCount, setFlagCount] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);

  // Difficulty settings for different levels (easy, medium, hard)
  const difficultySettings = useMemo(() => ({
    easy: { rows: 8, cols: 8, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 }
  }), []);

  // Initialize the board with empty cells and randomly placed mines
  const initializeBoard = useCallback((difficulty) => {
    const { rows, cols, mines } = difficultySettings[difficulty];
    const board = {};

    // Initialize all cells
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        board[`${i}-${j}`] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0
        };
      }
    }

    // Randomly place mines and update adjacent mine counts
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
            
            if (newRow >= 0 && newRow < rows && 
                newCol >= 0 && newCol < cols && 
                !board[newKey].isMine) {
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
  }, [difficultySettings]);
  
  // Toggles the flag on a cell
  const toggleFlag = useCallback((row, col) => {
    if (gameOver) return;
    
    const key = `${row}-${col}`;
    const cell = boardState[key];
    
    if (!cell || cell.isRevealed) return;
    
    const newBoardState = { ...boardState };
    newBoardState[key].isFlagged = !cell.isFlagged;
    setBoardState(newBoardState);
    
    setFlagCount(prev => cell.isFlagged ? prev - 1 : prev + 1);
  }, [boardState, gameOver]);

  // Initialize the board when difficulty changes
  useEffect(() => {
    console.log('Initial board setup');
    initializeBoard(difficulty);
  }, [difficulty, initializeBoard]);

  // Checks if the player has won the game
  const checkWinCondition = useCallback(() => {
    if (!boardState) return;

    const { rows, cols, mines } = difficultySettings[difficulty];
    let revealedCount = 0;
    
    for (const key in boardState) {
      if (boardState[key].isRevealed && !boardState[key].isMine) {
        revealedCount++;
      }
    }
    
    if (revealedCount === (rows * cols) - mines) {
      setGameOver(true);
      setIsWin(true);
    }
  }, [boardState, difficulty, difficultySettings]);

  // Reveals a cell, handles special logic for first click
  const revealCell = useCallback((row, col) => {
    if (gameOver) return;
    
    const key = `${row}-${col}`;
    const cell = boardState[key];
    
    if (!cell || cell.isRevealed || cell.isFlagged) return;
    
    // Special handling for first click to avoid immediate mine hit
    if (isFirstClick) {
      setIsFirstClick(false);
      if (cell.isMine) { 
        const { rows, cols, mines } = difficultySettings[difficulty];
        const newBoard = {};

        // Initialize cells and place mines avoiding the first-clicked cell
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            newBoard[`${i}-${j}`] = {
              isMine: false,
              isRevealed: false,
              isFlagged: false,
              adjacentMines: 0
            };
          }
        }

        // Place mines avoiding the first cell
        let minesPlaced = 0;
        while (minesPlaced < mines) {
          const mineRow = Math.floor(Math.random() * rows);
          const mineCol = Math.floor(Math.random() * cols);
          const mineKey = `${mineRow}-${mineCol}`;
          
          if (!newBoard[mineKey].isMine && !(mineRow === row && mineCol === col)) {
            newBoard[mineKey].isMine = true;
            minesPlaced++;
            
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                const newRow = mineRow + i;
                const newCol = mineCol + j;
                const newKey = `${newRow}-${newCol}`;
                
                if (newRow >= 0 && newRow < rows && 
                    newCol >= 0 && newCol < cols && 
                    !newBoard[newKey].isMine) {
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
      Object.keys(boardState).forEach(k => {
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
              
              if (newRow >= 0 && newRow < rows && 
                  newCol >= 0 && newCol < cols && 
                  !newBoardState[newKey].isRevealed && 
                  !newBoardState[newKey].isFlagged) {
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
    checkWinCondition();
  }, [boardState, gameOver, isFirstClick, difficulty, difficultySettings, checkWinCondition]);

  // Resets game to start a new one
  const resetGame = useCallback(() => {
    setIsFirstClick(true);
    initializeBoard(difficulty);
  }, [difficulty, initializeBoard]);

  // Provides game data and functions to the context
  const value = {
    boardState,
    gameOver,
    isWin,
    difficulty,
    flagCount,
    setDifficulty,
    revealCell,
    resetGame,
    difficultySettings,
    toggleFlag
  };

  return (
    <MinesweeperContext.Provider value={value}>
      {children}
    </MinesweeperContext.Provider>
  );
}
