export function RulesPage() {
    return (
      <div className="rules-page">
        <h1>How to Play Minesweeper</h1>
        <div className="rules-content">
          <h2>Game Rules:</h2>
          <ul>
            <li>The goal is to uncover all cells that do not contain mines.</li>
            <li>Numbers show how many mines are adjacent to that cell.</li>
            <li>Use logic to determine which cells are safe to click.</li>
            <li>If you click on a mine, the game is over!</li>
          </ul>
          
          <h2>Difficulty Levels:</h2>
          <ul>
            <li>Easy: 8x8 grid with 10 mines</li>
            <li>Medium: 16x16 grid with 40 mines</li>
            <li>Hard: 30x16 grid with 99 mines</li>
          </ul>
        </div>
      </div>
    );
  }