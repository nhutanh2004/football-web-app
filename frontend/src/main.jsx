import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import HomePage from './pages/Homepage';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import MatchesPage from './pages/MatchesPage';
import PlayerPage from './pages/PlayerPage';
import TeamPage from './pages/TeamPage';
import MatchPage from './pages/MatchPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UserManagerPage from "./pages/UserManagerPage";
import AdminPlayersPage from './pages/AdminPlayersPage';
import AdminTeamsPage from './pages/AdminTeamsPage'; // Import AdminTeamsPage
import AdminMatchesPage from './pages/AdminMatchesPage'; // Import AdminMatchesPage
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="players" element={<PlayersPage />} />
          <Route path="matches" element={<MatchesPage />} />
          {/* Protected Routes */}
          <Route
            path="players/:id"
            element={
              <ProtectedRoute>
                <PlayerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="teams/:id"
            element={
              <ProtectedRoute>
                <TeamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="matches/:id"
            element={
              <ProtectedRoute>
                <MatchPage />
              </ProtectedRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path="admin/players"
            element={
              <ProtectedRoute admin>
                <AdminPlayersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/teams"
            element={
              <ProtectedRoute admin>
                <AdminTeamsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/matches"
            element={
              <ProtectedRoute admin>
                <AdminMatchesPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="admin/users"
            element={
              <ProtectedRoute admin>
                <UserManagerPage />
              </ProtectedRoute>
            }
          />
          {/* Public Routes */}
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);