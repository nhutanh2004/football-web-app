import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/matches')
      .then(response => setMatches(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Matches</h1>
      <ul>
        {matches.map(match => (
          <li key={match._id}>
            <Link to={`/matches/${match._id}`}>
              {new Date(match.date).toLocaleString()}-{match.team1?.name} vs {match.team2?.name} - {match.score}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchesPage;