import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import MatchesPage from './pages/MatchesPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="players" element={<PlayersPage />} />
          <Route path="matches" element={<MatchesPage />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);