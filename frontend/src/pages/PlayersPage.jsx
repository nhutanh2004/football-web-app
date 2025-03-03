import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PlayersPage.css';

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/players')
      .then(response => setPlayers(response.data))
      .catch(error => console.error(error));
  }, []);
  
  const handleImageError = (e) => {
    e.target.src = 'https://resources.premierleague.com/premierleague/photos/players/250x250/Photo-Missing.png'; // Import the default image
  };
  return (
    <div className="players-page">
      <h1>Players</h1>
      <div className="players-grid">
        {players.map(player => (
          <div key={player._id} className="player-card">
            <div className="player-card-content">
              <h2>{player.name}</h2>
              <img src={player.avatarUrl || 'https://resources.premierleague.com/premierleague/photos/players/250x250/Photo-Missing.png'} 
              alt={player.name} onError={handleImageError}/>

              <p>{player.position}</p>
              <Link to={`/players/${player._id}`}>View Profile</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersPage;