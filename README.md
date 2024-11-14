# Writeup of the project

### Challenges

Getting the game state to work smoothly with Context API was trickier than we expected. We needed a way to store the main game info—like the board layout, which cells were revealed or flagged, and if the game was won or lost—and make it easy for any part of the app to access and update this info.
<l>
The board layout was especially important because it tracks whether each cell has a mine, is flagged, or has been revealed. We also had to handle that first-click rule, where the first click always needs to be safe, so the game checks if the first cell is a mine and reshuffles things if it is.
<l>
Flagging cells needed careful tracking too—every time a flag is added or removed, the game updates the count so players know how many mines are left. And, of course, we needed a way to store whether the game was over and whether it was won or lost, so we could stop any further clicks once the game’s done.
<l>
Using Context made it easier to set all of this up in one place, so every part of the app can grab whatever piece of game info it needs without us having to pass everything down as props. It kept the setup simpler and made sure the game state was always in sync across components.

### What we would add with more time

Maybe we could add a timer for each game to create a bit more challenge and let people see how fast they can finish. Saving high scores locally would be awesome for tracking personal bests. We’d also add some sounds for clicks and when mines are found to make it feel more interactive. And of course, we’d want it to work better on mobile. Additionally,a hint system could be a great addition for those times when you’re totally stuck—just something subtle to keep the game moving without giving too much away.

### Assumptions we made

We figured most players would already know the basic Minesweeper rules, so we didn’t add extra tutorials. We assumed people would mostly be playing on desktop, using modern browsers, and with both a mouse and keyboard handy. This let us focus on making the game run smoothly on that setup without worrying too much about mobile support or older browsers.

### Time to complete

About 15 hours total:

- Basic setup and board: 3h
- Core game logic: 5h
- UI and styling: 3h
- Bug fixes and refactor code: 4h (Including bonus points features)

### Some feedback

This project gave us a solid chance to practice React hooks and the Context API, which was great for learning. Tracking status is quiet important in React. The project requirements were clear and the practice is useful.

If we could improve it, we’d probably want more bonus challenges to make things a bit more interesting. Also, some performance tips would’ve been helpful, like using useCallback() or useMemo() hooks to reduce unnecessary re-renders, especially when dealing with larger boards or animations.

##### ===============================================================================

## Extra credit code

1. **Early submissions**: 3pts - the project finished on Nov 12
2. **Safe first Turn**: 2pts
   `isFirstClick` to check whether the specific click is the first click
   MinesweeperContext.jsx line180 - 234

   ```
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
        ...
          newBoard[key].isRevealed = true;
          setBoardState(newBoard);
          return;
        }

   ```

3. **Saved Data** - 4pts
   Implement a button called “Save your data.” When the button is clicked, the historical game data will be stored in local storage. If a JSON record called ‘minesweeperGame’ exists in local storage, two new buttons will appear: “Load your previous game” and “Clear game history.”

   - First, the user can click “Reset game” to simulate exiting the game. Then, by clicking “Load your previous game,” the historical data will be loaded onto the new board.
   - If the user clicks “Clear game history,” the historical data will be removed from local storage.

```
const [localStorageData, setLocalStorageData] = useState(null); // json
...
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
...
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
...
    const clearGameHistory = useCallback(() => {
    localStorage.removeItem("minesweeperGame");
    setLocalStorageData(null);
  }, []);

```

GamePage.jsx

```
<button onClick={saveGameData}>Save Your Data</button>
      {localStorageData ? (
        <div>
          <button onClick={loadPreviousGameData}>
            Load Your Previous Game
          </button>
        </div>
      ) : null}
      {localStorageData ? (
        <button onClick={clearGameHistory}>Clear game history</button>
      ) : null}
```

4. **Flag Bomb Function - 3pts**
   Cell.jsx

   ```
   const handleRightClick = (e) => {
       e.preventDefault();
       if (!gameOver) {
       toggleFlag(row, col);
       }
   };
   ```

5. **Auto Clear - 5pts**
   MinesweeperContext.jsx line250 - 274
   Recursively reveal surroundings.

```
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

```

##### ===============================================================================

##### Available scripts to run the app and build locally

1. In the project directory, you can run: `npm start`. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

2. `npm run build` Builds the app for production to the `dist` folder.\
   It correctly bundles React in production mode and optimizes the build for the best performance.
