import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import GameCard from '../components/GameCard';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchGames();
    fetchRegistrations();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get('/api/games');
      setGames(response.data);
    } catch (error) {
      showToast('Failed to load games', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get('/api/registrations/my-registrations');
      setRegistrations(response.data);
    } catch (error) {
      console.error('Failed to load registrations:', error);
    }
  };

  const handleRegister = async (gameId) => {
    try {
      await axios.post('/api/registrations', { gameId });
      showToast('Successfully registered for the game!', 'success');
      fetchRegistrations();
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Registration failed',
        'error'
      );
    }
  };

  const handleUnregister = async (registrationId) => {
    try {
      await axios.delete(`/api/registrations/${registrationId}`);
      showToast('Registration cancelled', 'success');
      fetchRegistrations();
    } catch (error) {
      showToast('Failed to cancel registration', 'error');
    }
  };

  const isRegistered = (gameId) => {
    return registrations.some(
      (reg) => reg.game._id === gameId || reg.game === gameId
    );
  };

  const getRegistrationId = (gameId) => {
    const reg = registrations.find(
      (reg) => reg.game._id === gameId || reg.game === gameId
    );
    return reg?._id;
  };

  const filteredGames =
    activeTab === 'registered'
      ? games.filter((game) => isRegistered(game._id))
      : games;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>IKG PTU Sports Event</h1>
            <p>Amritsar Campus - Annual Sports Meet</p>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">Student</span>
            </div>
            {user?.role === 'admin' && (
              <button
                className="btn btn-outline"
                onClick={() => navigate('/admin')}
              >
                Admin Panel
              </button>
            )}
            <button className="btn btn-outline" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Games ({games.length})
          </button>
          <button
            className={`tab ${activeTab === 'registered' ? 'active' : ''}`}
            onClick={() => setActiveTab('registered')}
          >
            My Registrations ({registrations.length})
          </button>
        </div>

        <div className="games-grid">
          {filteredGames.length === 0 ? (
            <div className="empty-state">
              <p>
                {activeTab === 'registered'
                  ? 'You have not registered for any games yet.'
                  : 'No games available.'}
              </p>
            </div>
          ) : (
            filteredGames.map((game) => (
              <GameCard
                key={game._id}
                game={game}
                isRegistered={isRegistered(game._id)}
                onRegister={() => handleRegister(game._id)}
                onUnregister={() => handleUnregister(getRegistrationId(game._id))}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
