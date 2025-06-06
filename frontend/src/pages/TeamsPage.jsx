import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TeamsPage.css'; // Import the CSS file for styling

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/teams')
      .then(response => setTeams(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="teams-page">
      <h1>Các đội bóng</h1>
      <div className="teams-grid">
        {teams.map(team => (
          <div key={team._id} className="team-card">
            <Link to={`/teams/${team._id}`}>
              <div className="team-card-content">
                <h2>{team.name}</h2>
                <img src={team.logo_high} alt={team.name} />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;