import React, { useEffect, useState } from 'react';
import axios from 'axios';


const AdminPlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    birthday: '',
    position: '',
    team: '',
    country: '',
    number: '',
    avatarUrl: '',
  });
  const [editingPlayer, setEditingPlayer] = useState(null);

  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']; // Predefined positions

  useEffect(() => {
    // Fetch existing players and teams
    axios.get('http://localhost:5000/api/players')
      .then((res) => setPlayers(res.data))
      .catch(console.error);

    axios.get('http://localhost:5000/api/teams')
      .then((res) => setTeams(res.data))
      .catch(console.error);
  }, []);

  // Add a new player
  const handleAddPlayer = () => {
    if (!newPlayer.name.trim()) {
      alert('Player name is required!');
      return;
    }
  
    // Check for missing team
    if (!newPlayer.team.trim()) {
      alert('Team selection is required!');
      return;
    }
    axios.post('http://localhost:5000/api/players', newPlayer)
      .then((res) => {
        setPlayers([...players, res.data]);
        alert('Player added successfully!');
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to add player. Please try again!');
      });
  
    setNewPlayer({
      name: '',
      birthday: '',
      position: '',
      team: '',
      country: '',
      number: '',
      avatarUrl: '',
    });
  };
  //Edit a player
  const handleEditPlayer = () => {
    
    const originalPlayer = players.find((player) => player._id === editingPlayer._id);
    const updatedPlayer = {
      ...originalPlayer,
      ...editingPlayer,
      name: editingPlayer.name || originalPlayer.name,
      birthday: editingPlayer.birthday || originalPlayer.birthday,
      position: editingPlayer.position || originalPlayer.position,
      team: editingPlayer.team || originalPlayer.team,
      country: editingPlayer.country || originalPlayer.country,
      number: editingPlayer.number || originalPlayer.number,
      avatarUrl: editingPlayer.avatarUrl || originalPlayer.avatarUrl,
    };
  
    axios.put(`http://localhost:5000/api/players/${editingPlayer._id}`, updatedPlayer)
      .then((res) => {
        setPlayers(players.map((player) => (player._id === editingPlayer._id ? res.data : player)));
        alert('Player updated successfully!');
        setEditingPlayer(null); // Clear editing state
      })
      .catch(console.error);
  };
  // Delete a player
  const handleDeletePlayer = (id) => {
    axios.delete(`http://localhost:5000/api/players/${id}`)
      .then(() => {
        setPlayers(players.filter((player) => player._id !== id));
        setEditingPlayer(null); // Clear editing state
        alert('Player deleted successfully!');
      })
      .catch(console.error);
  };
  const handleImageError = (e) => {
    e.target.src = 'https://resources.premierleague.com/premierleague/photos/players/250x250/Photo-Missing.png'; // Import the default image
  };
  
  return (
    <div className="admin-players-page">
      <h1>Manage Players</h1>

      {/* Add Player Section */}
      <section>
        <h2>Add Player</h2>
        <input
          type="text"
          placeholder="Name"
          value={newPlayer.name}
          onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
        />
        <input
          type="date"
          placeholder="Birthday"
          value={newPlayer.birthday}
          onChange={(e) => setNewPlayer({ ...newPlayer, birthday: e.target.value })}
        />
        <select
          value={newPlayer.position}
          onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
        >
          <option value="">Select Position</option>
          {positions.map((position) => (
            <option key={position} value={position}>{position}</option>
          ))}
        </select>
        <select
          value={newPlayer.team}
          onChange={(e) => setNewPlayer({ ...newPlayer, team: e.target.value })}
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>{team.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Country"
          value={newPlayer.country}
          onChange={(e) => setNewPlayer({ ...newPlayer, country: e.target.value })}
        />
        <input
          type="number"
          placeholder="Jersey Number"
          value={newPlayer.number}
          onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })}
        />
        <input
          type="text"
          placeholder="Avatar URL"
          value={newPlayer.avatarUrl}
          onChange={(e) => setNewPlayer({ ...newPlayer, avatarUrl: e.target.value })}
        />
        <button onClick={handleAddPlayer}>Add Player</button>
      </section>

      {/* Edit Player Section */}
      {editingPlayer && (
        <section>
          <h2>Edit Player</h2>
          <input
            type="text"
            placeholder="Name"
            value={editingPlayer.name}
            onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
          />
          <input
            type="date"
            placeholder="Birthday"
            value={editingPlayer.birthday}
            onChange={(e) => setEditingPlayer({ ...editingPlayer, birthday: e.target.value })}
          />
          <select
            value={editingPlayer.position}
            onChange={(e) => setEditingPlayer({ ...editingPlayer, position: e.target.value })}
          >
            <option value="">Select Position</option>
            {positions.map((position) => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
          <select
            value={editingPlayer.team}
            onChange={(e) => setEditingPlayer({ ...editingPlayer, team: e.target.value })}
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>{team.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Country"
            value={editingPlayer.country}
            onChange={(e) => setEditingPlayer({ ...editingPlayer, country: e.target.value })}
          />
          <input
            type="number"
            placeholder="Jersey Number"
            value={editingPlayer.number}
            onChange={(e) => setEditingPlayer({ ...editingPlayer, number: e.target.value })}
          />
          <input
            type="text"
            placeholder="Avatar URL"
            value={editingPlayer.avatarUrl}
            onChange={(e) => setEditingPlayer({ ...editingPlayer, avatarUrl: e.target.value })}
          />
          <button onClick={handleEditPlayer}>Save Changes</button>
          <button onClick={() => setEditingPlayer(null)}>Cancel</button>
        </section>
      )}

      {/* Players List */}
      <section>
        <h2>Players List</h2>
        <ul>
          {players.map((player) => {
            const team = teams.find((team) => team._id === player.team._id); // Find the team object
            return (
              <li key={player._id}>
                <img src={player.avatarUrl || 
                'https://resources.premierleague.com/premierleague/photos/players/250x250/Photo-Missing.png'} 
                alt={player.name} onError={handleImageError}
                style={{ width: '50px', height: '50px' }} />
                {player.name} - {player.position} - {team ? team.name : 'Unknown Team'} - {player.number} - {player.country} - {player.birthday}
                <button onClick={() => setEditingPlayer(player)}>Edit</button>
                <button onClick={() => handleDeletePlayer(player._id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default AdminPlayersPage;