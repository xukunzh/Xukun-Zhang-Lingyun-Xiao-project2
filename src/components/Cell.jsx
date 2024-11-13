import { useContext, useState } from 'react';
import { MinesweeperContext } from '../context/MinesweeperContext';

export function Cell({ row, col }) {
  const { boardState, revealCell, toggleFlag, gameOver } = useContext(MinesweeperContext);
  const [isHovered, setIsHovered] = useState(false);
  const cell = boardState[`${row}-${col}`];
  
  if (!cell) return null;

  const handleClick = (e) => {
    e.preventDefault();
    if (e.shiftKey && !gameOver) {
      // Shift + click to place a flag
      toggleFlag(row, col);
    } else if (!gameOver && !cell.isFlagged) {
      // Regular click to reveal the cell
      revealCell(row, col);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    if (!gameOver) {
      toggleFlag(row, col); // Right-click to toggle flag
    }
  };

  let content = '';
  let className = 'cell';

  // Add hover state for styling
  if (isHovered) {
    className += ' hovered';
  }

  // Default unselected cell state
  if (!cell.isRevealed && !cell.isFlagged) {
    className += ' unselected';
  }

  // Cell states when revealed
  if (cell.isRevealed) {
    if (cell.isMine) {
      content = '💣';
      className += ' revealed mine';  // Display mine symbol and add mine class
    } else if (cell.adjacentMines > 0) {
      content = cell.adjacentMines;
      className += ' revealed number';  // Display adjacent mine count and add number class
    } else {
      className += ' revealed empty';  // Add empty class for cells with zero adjacent mines
    }
  }

  // Flagged cell state
  if (cell.isFlagged && !cell.isRevealed) {
    content = '🚩';
    className += ' flagged';  // Display flag symbol and add flagged class
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
