import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({
    _id: '',
    name: '',
    founded: '',
    stadium: '',
    coach: '',
    logo_high: '',
    logo_low: '',
    total_player: '',
  });
  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    // Fetch all teams
    axios.get('http://localhost:5000/api/teams')
      .then((res) => setTeams(res.data))
      .catch(console.error);
  }, []);

  const handleAddTeam = () => {
    if (!newTeam._id.trim()) {
      alert('Team ID cannot be empty or whitespace!');
      return;
    }
    
    axios.post('http://localhost:5000/api/teams', newTeam)
      .then((res) => {
        setTeams([...teams, res.data]);
        setNewTeam({
          _id: '',
          name: '',
          founded: '',
          stadium: '',
          coach: '',
          logo_high: '',
          logo_low: '',
          total_player: '',
        });
        alert('Team added successfully!');
      })
      .catch(console.error);
  };

  const handleEditTeam = () => {
    // Find the original team data
    const originalTeam = teams.find((team) => team._id === editingTeam._id);

    // Merge the original team data with the updated data, keeping original values for empty fields
    const updatedTeam = {
      ...originalTeam,
      ...editingTeam,
      name: editingTeam.name || originalTeam.name,
      founded: editingTeam.founded || originalTeam.founded,
      stadium: editingTeam.stadium || originalTeam.stadium,
      coach: editingTeam.coach || originalTeam.coach,
      logo_high: editingTeam.logo_high || originalTeam.logo_high,
      logo_low: editingTeam.logo_low || originalTeam.logo_low,
      total_player: editingTeam.total_player || originalTeam.total_player,
    };

    // Send the updated team data to the backend
    axios.put(`http://localhost:5000/api/teams/${editingTeam._id}`, updatedTeam)
      .then((res) => {
        // Update the teams list with the updated team data
        setTeams(teams.map((team) => (team._id === editingTeam._id ? res.data : team)));
        setEditingTeam(null); // Clear the editing state
        alert('Team updated successfully!');
      })
      .catch(console.error);
  };

  const handleDeleteTeam = (id) => {
    axios.delete(`http://localhost:5000/api/teams/${id}`)
      .then(() => {
        setTeams(teams.filter((team) => team._id !== id));
        if (editingTeam && editingTeam._id === id) {
          setEditingTeam(null); // Clear editing state
        }
        alert('Team delete successfully!');
      })
      .catch(console.error);
  };
  

  return (
    <div className="admin-teams-page">
      <h1>Manage Teams</h1>

      {/* Add Team Section */}
      <section>
        <h2>Add Team</h2>
        <input
          type="text"
          placeholder="Team ID"
          value={newTeam._id}
          onChange={(e) => setNewTeam({ ...newTeam, _id: e.target.value })}
        />
        <input
          type="text"
          placeholder="Name"
          value={newTeam.name}
          onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Founded Year"
          value={newTeam.founded}
          onChange={(e) => setNewTeam({ ...newTeam, founded: e.target.value })}
        />
        <input
          type="text"
          placeholder="Stadium"
          value={newTeam.stadium}
          onChange={(e) => setNewTeam({ ...newTeam, stadium: e.target.value })}
        />
        <input
          type="text"
          placeholder="Coach"
          value={newTeam.coach}
          onChange={(e) => setNewTeam({ ...newTeam, coach: e.target.value })}
        />
        <input
          type="text"
          placeholder="High-Resolution Logo URL"
          value={newTeam.logo_high}
          onChange={(e) => setNewTeam({ ...newTeam, logo_high: e.target.value })}
        />
        <input
          type="text"
          placeholder="Low-Resolution Logo URL"
          value={newTeam.logo_low}
          onChange={(e) => setNewTeam({ ...newTeam, logo_low: e.target.value })}
        />
        <input
          type="number"
          placeholder="Total Players"
          value={newTeam.total_player}
          onChange={(e) => setNewTeam({ ...newTeam, total_player: e.target.value })}
        />
        <button onClick={handleAddTeam}>Add Team</button>
      </section>

      {/* Edit Team Section */}
      {editingTeam && (
        <section>
          <h2>Edit Team</h2>
          <input
            type="text"
            placeholder="Name"
            value={editingTeam.name}
            onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Founded Year"
            value={editingTeam.founded}
            onChange={(e) => setEditingTeam({ ...editingTeam, founded: e.target.value })}
          />
          <input
            type="text"
            placeholder="Stadium"
            value={editingTeam.stadium}
            onChange={(e) => setEditingTeam({ ...editingTeam, stadium: e.target.value })}
          />
          <input
            type="text"
            placeholder="Coach"
            value={editingTeam.coach}
            onChange={(e) => setEditingTeam({ ...editingTeam, coach: e.target.value })}
          />
          <input
            type="text"
            placeholder="High-Resolution Logo URL"
            value={editingTeam.logo_high}
            onChange={(e) => setEditingTeam({ ...editingTeam, logo_high: e.target.value })}
          />
          <input
            type="text"
            placeholder="Low-Resolution Logo URL"
            value={editingTeam.logo_low}
            onChange={(e) => setEditingTeam({ ...editingTeam, logo_low: e.target.value })}
          />
          <input
            type="number"
            placeholder="Total Players"
            value={editingTeam.total_player}
            onChange={(e) => setEditingTeam({ ...editingTeam, total_player: e.target.value })}
          />
          <button onClick={handleEditTeam}>Save Changes</button>
          <button onClick={() => setEditingTeam(null)}>Cancel</button>
        </section>
      )}

      {/* Teams List */}
      <section>
        <h2>Teams List</h2>
        <ul>
          {teams.map((team) => (
            <li key={team._id} style={{ marginBottom: '20px' }}>
              <div>
                <strong>{team.name}</strong> - {team.stadium} - {team.coach} - {team.total_player} players - Founded: {team.founded}
              </div>
              <div>
                <img
                  src={team.logo_high}
                  alt={`${team.name} High-Resolution Logo`}
                  style={{ width: '100px', height: 'auto', marginRight: '10px' }}
                />
                <img
                  src={team.logo_low}
                  alt={`${team.name} Low-Resolution Logo`}
                  style={{ width: '50px', height: 'auto' }}
                />
              </div>
              <div>
                <button onClick={() => setEditingTeam(team)}>Edit</button>
                <button onClick={() => handleDeleteTeam(team._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminTeamsPage;