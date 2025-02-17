import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/players?populate=team')
      .then(response => {
        setPlayers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Players</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {players.map(player => (
          <li key={player._id}>
            {player.name} - {player.position} - Team: {player.team?.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayersPage;
