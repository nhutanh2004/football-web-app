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
        <Link to="/" className="navbar-link">Trang chủ</Link>
        <Link to="/teams" className="navbar-link">Đội</Link>
        <Link to="/players" className="navbar-link">Cầu thủ</Link>
        <Link to="/matches" className="navbar-link">Trận đấu</Link>
        <Link to="/comments" className="navbar-link">Bình luận</Link>
        {isAdmin && (
          <div className="admin-dropdown">
            <div className="navbar-link">Quản lý</div>
            <div className="admin-dropdown-content">
              <Link to="/admin/teams" className="navbar-link">Thông tin đội</Link>
              <Link to="/admin/players" className="navbar-link">Thông tin cầu thủ</Link>
              <Link to="/admin/matches" className="navbar-link">Thông tin trận đấu</Link>
              <Link to="/admin/users" className="navbar-link">Thông tin người dùng</Link>
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