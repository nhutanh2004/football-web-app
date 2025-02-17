import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/matches')
      .then(response => {
        setMatches(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Matches</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {matches.map(match => (
          <li key={match._id}>
            {match.team1?.name} vs {match.team2?.name} - {match.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchesPage;
