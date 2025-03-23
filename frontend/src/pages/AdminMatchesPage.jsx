import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminMatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [newMatch, setNewMatch] = useState({
    date: '',
    team1: '',
    team2: '',
    score: '',
    stadium: '',
    status: 'scheduled',
  });
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    // Fetch all matches
    axios.get('http://localhost:5000/api/matches')
      .then((res) => setMatches(res.data))
      .catch(console.error);
  }, []);

  const handleAddMatch = () => {
    axios.post('http://localhost:5000/api/matches', newMatch)
      .then((res) => {
        setMatches([...matches, res.data]);
        setNewMatch({ date: '', team1: '', team2: '', score: '', stadium: '', status: 'scheduled' });
      })
      .catch(console.error);
  };

  const handleEditMatch = () => {
    // Find the original match data
    const originalMatch = matches.find((match) => match._id === editingMatch._id);

    // Merge the original match data with the updated data, keeping original values for empty fields
    const updatedMatch = {
      ...originalMatch,
      ...editingMatch,
      date: editingMatch.date || originalMatch.date,
      team1: editingMatch.team1 || originalMatch.team1,
      team2: editingMatch.team2 || originalMatch.team2,
      score: editingMatch.score || originalMatch.score,
      stadium: editingMatch.stadium || originalMatch.stadium,
      status: editingMatch.status || originalMatch.status,
    };

    // Send the updated match data to the backend
    axios.put(`http://localhost:5000/api/matches/${editingMatch._id}`, updatedMatch)
      .then((res) => {
        // Update the matches list with the updated match data
        setMatches(matches.map((match) => (match._id === editingMatch._id ? res.data : match)));
        setEditingMatch(null); // Clear the editing state
      })
      .catch(console.error);
  };

  const handleDeleteMatch = (id) => {
    axios.delete(`http://localhost:5000/api/matches/${id}`)
      .then(() => setMatches(matches.filter((match) => match._id !== id)))
      .catch(console.error);
  };

  return (
    <div className="admin-matches-page">
      <h1>Manage Matches</h1>

      {/* Add Match Section */}
      <section>
        <h2>Add Match</h2>
        <input
          type="date"
          value={newMatch.date}
          onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Team 1"
          value={newMatch.team1}
          onChange={(e) => setNewMatch({ ...newMatch, team1: e.target.value })}
        />
        <input
          type="text"
          placeholder="Team 2"
          value={newMatch.team2}
          onChange={(e) => setNewMatch({ ...newMatch, team2: e.target.value })}
        />
        <input
          type="text"
          placeholder="Score"
          value={newMatch.score}
          onChange={(e) => setNewMatch({ ...newMatch, score: e.target.value })}
        />
        <input
          type="text"
          placeholder="Stadium"
          value={newMatch.stadium}
          onChange={(e) => setNewMatch({ ...newMatch, stadium: e.target.value })}
        />
        <select
          value={newMatch.status}
          onChange={(e) => setNewMatch({ ...newMatch, status: e.target.value })}
        >
          <option value="scheduled">Scheduled</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={handleAddMatch}>Add Match</button>
      </section>

      {/* Edit Match Section */}
      {editingMatch && (
        <section>
          <h2>Edit Match</h2>
          <input
            type="date"
            value={editingMatch.date}
            onChange={(e) => setEditingMatch({ ...editingMatch, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Team 1"
            value={editingMatch.team1}
            onChange={(e) => setEditingMatch({ ...editingMatch, team1: e.target.value })}
          />
          <input
            type="text"
            placeholder="Team 2"
            value={editingMatch.team2}
            onChange={(e) => setEditingMatch({ ...editingMatch, team2: e.target.value })}
          />
          <input
            type="text"
            placeholder="Score"
            value={editingMatch.score}
            onChange={(e) => setEditingMatch({ ...editingMatch, score: e.target.value })}
          />
          <input
            type="text"
            placeholder="Stadium"
            value={editingMatch.stadium}
            onChange={(e) => setEditingMatch({ ...editingMatch, stadium: e.target.value })}
          />
          <select
            value={editingMatch.status}
            onChange={(e) => setEditingMatch({ ...editingMatch, status: e.target.value })}
          >
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={handleEditMatch}>Save Changes</button>
          <button onClick={() => setEditingMatch(null)}>Cancel</button>
        </section>
      )}

      {/* Matches List */}
      <section>
        <h2>Matches List</h2>
        <ul>
          {matches.map((match) => (
            <li key={match._id}>
              {match.date} - {match.team1.name} vs {match.team2.name} - {match.score} - {match.status}
               -{match.stadium} - 
               {match.scorer.map((scorer, index) => (
                <li key={index}>{scorer}</li>
              ))} 
              
              <button onClick={() => setEditingMatch(match)}>Edit</button>
              <button onClick={() => handleDeleteMatch(match._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminMatchesPage;