import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MinesweeperProvider } from './context/MinesweeperContext';
import { HomePage } from './components/HomePage';
import { GamePage } from './components/GamePage';
import { RulesPage } from './components/RulesPage';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <Router>
      <MinesweeperProvider>
        <div className="app">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/:difficulty" element={<GamePage />} />
            <Route path="/rules" element={<RulesPage />} />
          </Routes>
        </div>
      </MinesweeperProvider>
    </Router>
  );
}

export default App;