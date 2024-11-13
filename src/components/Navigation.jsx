import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="navigation">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/rules" className="nav-link">Rules</Link>
    </nav>
  );
}