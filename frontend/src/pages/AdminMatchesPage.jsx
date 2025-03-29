import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminMatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [newMatch, setNewMatch] = useState({
    date: '',
    team1: '',
    team2: '',
    score: '',
    stadium: '',
    status: 'scheduled',
    team1_scorer: [],
    team2_scorer: [],
  });
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    // Fetch all matches
    axios.get('http://localhost:5000/api/matches')
      .then((res) => setMatches(res.data))
      .catch(console.error);

    // Fetch all teams
    axios.get('http://localhost:5000/api/teams')
      .then((res) => setTeams(res.data))
      .catch(console.error);

    // Fetch all players
    axios.get('http://localhost:5000/api/players')
      .then((res) => setPlayers(res.data))
      .catch(console.error);
  }, []);

  const handleAddMatch = () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
      alert('You must be logged in to edit a team!');
      return;
    }
    if (newMatch.team1 === newMatch.team2 && newMatch.team1 !== '') {
      alert('Team 1 and Team 2 must be different!');
      return;
    }

    axios.post('http://localhost:5000/api/matches', newMatch,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request header
        },
      }
    )
      .then((res) => {
        setMatches([...matches, res.data]);
        setNewMatch({
          date: '',
          team1: '',
          team2: '',
          score: '',
          stadium: '',
          status: 'scheduled',
          team1_scorer: [],
          team2_scorer: [],
        });
      })
      .catch(console.error);
  };

  const handleEditMatch = () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
      alert('You must be logged in to edit a team!');
      return;
    }
    if (editingMatch.team1 === editingMatch.team2 && editingMatch.team1 !== '') {
      alert('Team 1 and Team 2 must be different!');
      return;
    }

    axios.put(`http://localhost:5000/api/matches/${editingMatch._id}`, editingMatch,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request header
        },
      }
    )
      .then((res) => {
        setMatches(matches.map((match) => (match._id === editingMatch._id ? res.data : match)));
        setEditingMatch(null); // Clear the editing state
      })
      .catch(console.error);
  };

  const handleDeleteMatch = (id) => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
      alert('You must be logged in to edit a team!');
      return;
    }
    axios.delete(`http://localhost:5000/api/matches/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request header
        },
      }
    )
      .then(() => setMatches(matches.filter((match) => match._id !== id)))
      .catch(console.error);
  };

  const addScorer = (team, scorer) => {
    const updatedScorers = [...newMatch[team], scorer];
    setNewMatch({ ...newMatch, [team]: updatedScorers });
  };

  const removeScorer = (team, index) => {
    const updatedScorers = [...newMatch[team]];
    updatedScorers.splice(index, 1);
    setNewMatch({ ...newMatch, [team]: updatedScorers });
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
        <select
          value={newMatch.team1}
          onChange={(e) => setNewMatch({ ...newMatch, team1: e.target.value })}
        >
          <option value="">Select Team 1</option>
          {teams.map((team) => (
            <option key={team._id} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>
        <select
          value={newMatch.team2}
          onChange={(e) => setNewMatch({ ...newMatch, team2: e.target.value })}
        >
          <option value="">Select Team 2</option>
          {teams
            .filter((team) => team.name !== newMatch.team1) // Exclude team1 from the options
            .map((team) => (
              <option key={team._id} value={team.name}>
                {team.name}
              </option>
            ))}
        </select>
        <input
          type="text"
          placeholder="Score (e.g., 2-1)"
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

        {/* Team 1 Scorers */}
        <h3>Team 1 Scorers</h3>
          <select
            value="" // Đặt giá trị mặc định
            onChange={(e) => addScorer('team1_scorer', {
              scorerId: e.target.value,
              minute: '',
              ownGoal: false,
            })}
          >
            <option value="">Select Scorer</option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.name}
              </option>
            ))}
          </select>
          <ul>
            {newMatch.team1_scorer.map((scorer, index) => {
              // Tìm tên cầu thủ dựa trên ID
              const player = players.find((p) => p._id === scorer.scorerId);
              return (
                <li key={index}>
                  {player ? player.name : "Unknown"} - Minute: {scorer.minute || 'N/A'}
                  <input
                    type="number"
                    placeholder="Enter minute"
                    value={scorer.minute}
                    onChange={(e) => {
                      const updatedScorers = [...newMatch.team1_scorer];
                      updatedScorers[index].minute = e.target.value;
                      setNewMatch({ ...newMatch, team1_scorer: updatedScorers });
                    }}
                  />
                  <label>
                    Own Goal:
                    <input
                      type="checkbox"
                      checked={scorer.ownGoal}
                      onChange={(e) => {
                        const updatedScorers = [...newMatch.team1_scorer];
                        updatedScorers[index].ownGoal = e.target.checked;
                        setNewMatch({ ...newMatch, team1_scorer: updatedScorers });
                      }}
                    />
                  </label>
                  <button onClick={() => removeScorer('team1_scorer', index)}>Remove</button>
                </li>
              );
            })}
          </ul>
        {/* Team 2 Scorers */}
        <h3>Team 2 Scorers</h3>
          <select
            value="" // Đặt giá trị mặc định
            onChange={(e) => addScorer('team2_scorer', {
              scorerId: e.target.value,
              minute: '',
              ownGoal: false,
            })}
          >
            <option value="">Select Scorer</option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.name}
              </option>
            ))}
          </select>
          <ul>
            {newMatch.team2_scorer.map((scorer, index) => {
              // Tìm tên cầu thủ dựa trên ID
              const player = players.find((p) => p._id === scorer.scorerId);
              return (
                <li key={index}>
                  {player ? player.name : "Unknown"} - Minute: {scorer.minute || 'N/A'}
                  <input
                    type="number"
                    placeholder="Enter minute"
                    value={scorer.minute}
                    onChange={(e) => {
                      const updatedScorers = [...newMatch.team2_scorer];
                      updatedScorers[index].minute = e.target.value;
                      setNewMatch({ ...newMatch, team2_scorer: updatedScorers });
                    }}
                  />
                  <label>
                    Own Goal:
                    <input
                      type="checkbox"
                      checked={scorer.ownGoal}
                      onChange={(e) => {
                        const updatedScorers = [...newMatch.team2_scorer];
                        updatedScorers[index].ownGoal = e.target.checked;
                        setNewMatch({ ...newMatch, team2_scorer: updatedScorers });
                      }}
                    />
                  </label>
                  <button onClick={() => removeScorer('team2_scorer', index)}>Remove</button>
                </li>
              );
            })}
          </ul>
      </section>
      {editingMatch && (
  <section>
    <h2>Edit Match</h2>
    <input
      type="date"
      value={editingMatch.date}
      onChange={(e) => setEditingMatch({ ...editingMatch, date: e.target.value })}
    />
    <select
      value={editingMatch.team1}
      onChange={(e) => setEditingMatch({ ...editingMatch, team1: e.target.value })}
    >
      <option value="">Select Team 1</option>
      {teams.map((team) => (
        <option key={team._id} value={team.name}>
          {team.name}
        </option>
      ))}
    </select>
    <select
      value={editingMatch.team2}
      onChange={(e) => setEditingMatch({ ...editingMatch, team2: e.target.value })}
    >
      <option value="">Select Team 2</option>
      {teams
        .filter((team) => team.name !== editingMatch.team1)
        .map((team) => (
          <option key={team._id} value={team.name}>
            {team.name}
          </option>
        ))}
    </select>
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
    
    {/* Editing Scorers for Team 1 */}
    <h3>Team 1 Scorers</h3>
     {/* Add New Scorer */}
        <select
          value=""
          onChange={(e) => {
            const scorer = { scorerId: e.target.value, minute: '', ownGoal: false };
            const updatedScorers = [...editingMatch.team1_scorer, scorer];
            setEditingMatch({ ...editingMatch, team1_scorer: updatedScorers });
          }}
        >
          <option value="">Select Scorer</option>
          {players.map((player) => (
            <option key={player._id} value={player._id}>
              {player.name}
            </option>
          ))}
        </select>
    <ul>
      {editingMatch.team1_scorer.map((scorer, index) => {
        // Check for missing or invalid scorerId
        const player = scorer.scorerId && typeof scorer.scorerId === 'object'
          ? scorer.scorerId // Use the full object if available
          : players.find((p) => p._id === scorer.scorerId); // Fallback: find by ID
        const playerName = player && player.name ? player.name : "Unknown";

        return (
          <li key={index}>
            <span>{playerName} - Minute: {scorer.minute || "N/A"}</span>
            <input
              type="number"
              placeholder="Enter minute"
              value={scorer.minute}
              onChange={(e) => {
                const updatedScorers = [...editingMatch.team1_scorer];
                updatedScorers[index].minute = e.target.value;
                setEditingMatch({ ...editingMatch, team1_scorer: updatedScorers });
              }}
            />
            <label>
              Own Goal:
              <input
                type="checkbox"
                checked={scorer.ownGoal}
                onChange={(e) => {
                  const updatedScorers = [...editingMatch.team1_scorer];
                  updatedScorers[index].ownGoal = e.target.checked;
                  setEditingMatch({ ...editingMatch, team1_scorer: updatedScorers });
                }}
              />
            </label>
            <button
              onClick={() => {
                const updatedScorers = [...editingMatch.team1_scorer];
                updatedScorers.splice(index, 1); // Remove scorer
                setEditingMatch({ ...editingMatch, team1_scorer: updatedScorers });
              }}
            >
              Remove
            </button>
          </li>
        );
      })}
    </ul>
    {/* Editing Scorers for Team 2 */}
    <h3>Team 2 Scorers</h3>
    {/* Add New Scorer */}
    <select
      value=""
      onChange={(e) => {
        const player = players.find((p) => p._id === e.target.value);
        if (!player) {
          alert("Invalid player selected!");
          return;
        }
        const scorer = { scorerId: player, minute: '', ownGoal: false };
        const updatedScorers = [...editingMatch.team2_scorer, scorer];
        setEditingMatch({ ...editingMatch, team2_scorer: updatedScorers });
      }}
    >
      <option value="">Select Scorer</option>
      {players.map((player) => (
        <option key={player._id} value={player._id}>
          {player.name}
        </option>
      ))}
    </select>
    <ul>
      {editingMatch.team2_scorer.map((scorer, index) => {
        const player = scorer.scorerId && typeof scorer.scorerId === 'object'
          ? scorer.scorerId
          : players.find((p) => p._id === scorer.scorerId);
        const playerName = player && player.name ? player.name : "Unknown";

        return (
          <li key={index}>
            <span>{playerName} - Minute: {scorer.minute || "N/A"}</span>
            <input
              type="number"
              placeholder="Enter minute"
              value={scorer.minute}
              onChange={(e) => {
                const updatedScorers = [...editingMatch.team2_scorer];
                updatedScorers[index].minute = e.target.value;
                setEditingMatch({ ...editingMatch, team2_scorer: updatedScorers });
              }}
            />
            <label>
              Own Goal:
              <input
                type="checkbox"
                checked={scorer.ownGoal}
                onChange={(e) => {
                  const updatedScorers = [...editingMatch.team2_scorer];
                  updatedScorers[index].ownGoal = e.target.checked;
                  setEditingMatch({ ...editingMatch, team2_scorer: updatedScorers });
                }}
              />
            </label>
            <button
              onClick={() => {
                const updatedScorers = [...editingMatch.team2_scorer];
                updatedScorers.splice(index, 1); // Remove scorer
                setEditingMatch({ ...editingMatch, team2_scorer: updatedScorers });
              }}
            >
              Remove
            </button>
          </li>
        );
      })}
    </ul>

      
      <button onClick={handleEditMatch}>Save Changes</button>
      <button onClick={() => setEditingMatch(null)}>Cancel</button>
    </section>
    )}

<section>
  <h2>Matches List</h2>
  <ul>
    {matches.map((match) => (
      <li key={match._id}>
        {new Date(match.date).toLocaleDateString()} - {match.team1.name} vs {match.team2.name} - {match.score || 'N/A'} -{' '}
        {match.status} - {match.stadium || 'Unknown'}
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
