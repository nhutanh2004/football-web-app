import React, { useEffect, useState } from 'react';
import { useParams , Link} from 'react-router-dom';
import axios from 'axios';

const PlayerPage = () => {
  const { id } = useParams(); // Get the player ID from the URL
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/players/${id}`)
      .then(response => setPlayer(response.data))
      .catch(error => console.error(error));
  }, [id]);

  if (!player) return <div>Loading...</div>;

  return (
    <div>
      <h1>{player.name}</h1>
      <img src={player.avatarUrl} alt={player.name} />
      <p><strong>Birthday:</strong> {player.birthday}</p>
      <p><strong>Position:</strong> {player.position}</p>
      <p><strong>Nationality:</strong> {player.country}</p>
      <p><strong>Team: </strong> 
        <Link to={`/teams/${player.team?._id}`}>
           {player.team?.name}
        </Link>
      </p>
    </div>
  );
};

export default PlayerPage;