import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css'; // Import the CSS file

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check if the user is logged in

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <img
          src="https://www.premierleague.com/resources/rebrand/v7.153.46/i/elements/pl-main-logo.png"
          alt="Premier League Logo"
          className="homepage-logo"
        />
        <div>
          <h1 className="homepage-title">Welcome to Premier League</h1>
          <p className="homepage-description">Get the latest information about Premier League matches and standings </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;