import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MatchesPage.css'; // Import the CSS file for styling

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/matches')
      .then(response => setMatches(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="matches-page">
      <h1>Matches</h1>
      <div className="matches-grid">
        {matches.map(match => (
          <div key={match._id} className="match-card">
            <div className="match-card-content">
              <h2>
                <Link to={`/teams/${match.team1._id}`} className="team-link">
                  <img src={match.team1.logo_low} alt={match.team1.name}/>
                  <span className="team-name">{match.team1.name}</span>
                </Link>
                <span className='vs'> VS </span>
                <Link to={`/teams/${match.team2._id}`} className="team-link">
                  <img src={match.team2.logo_low} alt={match.team2.name}/>
                  <span className="team-name">{match.team2.name}</span>
                </Link>
              </h2>
              <Link to={`/matches/${match._id}`}>
                <p><strong>Date:</strong> {new Date(match.date).toLocaleString()}</p>
                <p><strong>Score:</strong> {match.score}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchesPage;