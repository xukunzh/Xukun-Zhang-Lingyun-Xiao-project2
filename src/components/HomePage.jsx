import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="home-page">
      <h1>Minesweeper</h1>
      <p>Welcome to the classic game of Minesweeper!</p>
      <div className="difficulty-selection">
        <h2>Select Difficulty:</h2>
        <div className="difficulty-buttons">
          <Link to="/game/easy" className="btn">Easy</Link>
          <Link to="/game/medium" className="btn">Medium</Link>
          <Link to="/game/hard" className="btn">Hard</Link>
        </div>
      </div>
    </div>
  );
}
