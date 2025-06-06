import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './TeamPage.css';

const TeamPage = () => {
  const { id } = useParams(); 
  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Lấy thông tin đội bóng
    axios.get(`http://localhost:5000/api/teams/${id}`)
      .then(response => setTeam(response.data))
      .catch(error => console.error(error));

    // Lấy tất cả trận đấu của đội bóng
    axios.get(`http://localhost:5000/api/matches/team/${id}`)
      .then(response => setMatches(response.data))
      .catch(error => console.error(error));
    
    // Lấy tất cả các cầu thủ của đội bóng
    axios.get(`http://localhost:5000/api/players/team/${id}`)
      .then(response => setPlayers(response.data))
      .catch(error => console.error(error));
  }, [id]);

  if (!team) return <div>Loading...</div>;

  const handleImageError = (e) => {
    e.target.src = 'https://resources.premierleague.com/premierleague/photos/players/250x250/Photo-Missing.png'; // Import the default image
  };

  return (
    <div>
      <h1>
        <img src={team.logo_low} alt={team.name} />{team.name}
      </h1>
      <div className='team-info'>
        <p><strong>Quốc gia:</strong> {team.country}</p>
        <p><strong>Ngày thành lập:</strong> {team.founded}</p>
        <p><strong>Sân nhà:</strong> {team.stadium}</p>
        <p><strong>Huấn luận viên:</strong> {team.coach}</p>
      </div>
      <h2>Cầu thủ</h2>
      <div className="players-grid">
        {players.map(player => (
          <div key={player._id} className="player-card">
            <div className="player-card-content">
              <h2>{player.name}</h2>
              <img 
                src={player.avatarUrl || 'https://resources.premierleague.com/premierleague/photos/players/250x250/Photo-Missing.png'} 
                alt={player.name} 
                onError={handleImageError} 
              />
              <p>{player.position}</p>
              <Link to={`/players/${player._id}`}>View Profile</Link>
            </div>
          </div>
        ))}
      </div>

      <h3>Trận Đấu</h3>
      <ul>  
        {matches.map(match => (
          <li key={match._id}>
            <Link to={`/matches/${match._id}`}>
              {new Date(match.date).toLocaleString()} - {match.team1.name} vs {match.team2.name} - {match.score}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamPage;