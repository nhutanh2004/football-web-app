import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

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
    axios.get(`http://localhost:5000/api/players/team/${id}`, )
      .then(response => setPlayers(response.data))
      .catch(error => console.error(error));
  }, [id]);

  if (!team) return <div>Loading...</div>;

  return (
    <div>
      <h1>{team.name}</h1>
      <p><strong>Founded:</strong> {team.founded}</p>
      <p><strong>Stadium:</strong> {team.stadium}</p>
      <p><strong>Coach:</strong> {team.coach}</p>

      <h2>Players</h2>
      <ul>
        {players.map(player => (
          <li key={player._id}>
            <Link to={`/players/${player._id}`}>
              {player.name}
            </Link>
          </li>
        ))}
      </ul>

      <h3>Matches</h3>
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