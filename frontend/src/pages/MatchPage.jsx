import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MatchPage = () => {
  const { id } = useParams(); // Get the match ID from the URL
  const [match, setMatch] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/matches/${id}`)
      .then(response => setMatch(response.data))
      .catch(error => console.error(error));
  }, [id]);

  if (!match) return <div>Loading...</div>;

  return (
    <div>
      <h1>Match Details</h1>
      <p><strong>Date:</strong> {new Date(match.date).toLocaleDateString()}</p>
      <p><strong>Teams:</strong> 
        <Link to={`/teams/${match.team1._id}`}>{match.team1.name}</Link> 
        <span> vs </span>
        <Link to={`/teams/${match.team2._id}`}>{match.team2.name}</Link>
      </p>
      <p><strong>Stadium:</strong> {match.stadium}</p>
      <p><strong>Score:</strong> {match.score}</p>
      <p><strong>Scorers:</strong></p>
      <ul>
        {match.scorer.map((scorer, index) => (
          <li key={index}>{scorer}</li>
        ))}
      </ul>
      <p><strong>Status:</strong> {match.status}</p>
    </div>
  );
};

export default MatchPage;