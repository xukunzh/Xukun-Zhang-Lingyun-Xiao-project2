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

## Available scripts to run the app and build locally

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
