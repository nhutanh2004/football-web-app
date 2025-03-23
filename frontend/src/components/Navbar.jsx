import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check if the user is logged in
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Check if the user is an admin

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    localStorage.removeItem('isAdmin'); // Remove the isAdmin flag
    navigate('/login'); // Redirect to the login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/teams" className="navbar-link">Teams</Link>
        <Link to="/players" className="navbar-link">Players</Link>
        <Link to="/matches" className="navbar-link">Matches</Link>
        {isAdmin && (
          <div className="admin-dropdown">
            <Link to="/admin" className="navbar-link">Admin</Link>
            <div className="admin-dropdown-content">
              <Link to="/admin/teams" className="navbar-link">Manage Teams</Link>
              <Link to="/admin/players" className="navbar-link">Manage Players</Link>
              <Link to="/admin/matches" className="navbar-link">Manage Matches</Link>
            </div>
          </div>
        )}
      </div>
      <div className="navbar-right">
        {token ? (
          <button onClick={handleLogout} className="navbar-button">Logout</button>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;