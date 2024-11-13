import { useContext, useState } from "react";
import { MinesweeperContext } from "../context/MinesweeperContext";

export function Cell({ row, col }) {
  const { boardState, revealCell, toggleFlag, gameOver } =
    useContext(MinesweeperContext);
  const [isHovered, setIsHovered] = useState(false);
  const cell = boardState[`${row}-${col}`];

  if (!cell) return null;

  const handleClick = (e) => {
    e.preventDefault();
    if (e.shiftKey && !gameOver) {
      toggleFlag(row, col);
    } else if (!gameOver && !cell.isFlagged) {
      revealCell(row, col);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    if (!gameOver) {
      toggleFlag(row, col);
    }
  };

  let content = "";
  let className = "cell";

  if (isHovered) {
    className += " hovered";
  }

  if (!cell.isRevealed && !cell.isFlagged) {
    className += " unselected";
  }

  if (cell.isRevealed) {
    if (cell.isMine) {
      content = "💣";
      className += " revealed mine";
    } else if (cell.adjacentMines > 0) {
      content = cell.adjacentMines;
      className += " revealed number";
    } else {
      className += " revealed empty";
    }
  }

  // Flagged cell state
  if (cell.isFlagged && !cell.isRevealed) {
    content = "🚩";
    className += " flagged";
  }

  return (
    <div
      className={className}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
    </div>
  );
}
