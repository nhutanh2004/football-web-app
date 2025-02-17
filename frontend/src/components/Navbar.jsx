import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/teams">Teams</Link>
      <Link to="/players">Players</Link>
      <Link to="/matches">Matches</Link>
    </nav>
  );
};

export default Navbar;