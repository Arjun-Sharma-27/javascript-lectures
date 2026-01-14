import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import Modal from '../components/Modal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('games');
  const [showGameModal, setShowGameModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGame, setFilterGame] = useState('');
  const [gameForm, setGameForm] = useState({
    name: '',
    description: '',
    registrationOpen: true,
    gameType: 'registrable'
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchGames();
    fetchRegistrations();
  }, [user]);

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
      const params = {};
      if (filterGame) params.gameId = filterGame;
      const response = await axios.get('/api/registrations/all', { params });
      setRegistrations(response.data);
    } catch (error) {
      showToast('Failed to load registrations', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'registrations') {
      fetchRegistrations();
    }
  }, [filterGame, activeTab]);

  const handleCreateGame = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/games', gameForm);
      showToast('Game created successfully!', 'success');
      setShowGameModal(false);
      setGameForm({
        name: '',
        description: '',
        registrationOpen: true,
        gameType: 'registrable'
      });
      fetchGames();
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Failed to create game',
        'error'
      );
    }
  };

  const handleEditGame = (game) => {
    setSelectedGame(game);
    setGameForm({
      name: game.name,
      description: game.description || '',
      registrationOpen: game.registrationOpen,
      gameType: game.gameType
    });
    setShowEditModal(true);
  };

  const handleUpdateGame = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/games/${selectedGame._id}`, gameForm);
      showToast('Game updated successfully!', 'success');
      setShowEditModal(false);
      setSelectedGame(null);
      fetchGames();
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Failed to update game',
        'error'
      );
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game?')) {
      return;
    }
    try {
      await axios.delete(`/api/games/${gameId}`);
      showToast('Game deleted successfully!', 'success');
      fetchGames();
    } catch (error) {
      showToast('Failed to delete game', 'error');
    }
  };

  const toggleRegistration = async (game) => {
    try {
      await axios.put(`/api/games/${game._id}`, {
        ...game,
        registrationOpen: !game.registrationOpen
      });
      showToast(
        `Registration ${!game.registrationOpen ? 'opened' : 'closed'}!`,
        'success'
      );
      fetchGames();
    } catch (error) {
      showToast('Failed to update registration status', 'error');
    }
  };

  const exportToCSV = () => {
    const headers = ['Student Name', 'Roll Number', 'Course', 'Year', 'Email', 'Game', 'Registered At'];
    const rows = registrations.map(reg => [
      reg.student.name,
      reg.student.rollNumber,
      reg.student.course,
      reg.student.year,
      reg.student.email,
      reg.game.name,
      new Date(reg.registeredAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
  };

  const filteredRegistrations = registrations.filter(reg => {
    const searchLower = searchTerm.toLowerCase();
    return (
      reg.student.name.toLowerCase().includes(searchLower) ||
      reg.student.rollNumber.toLowerCase().includes(searchLower) ||
      reg.student.email.toLowerCase().includes(searchLower) ||
      reg.game.name.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Admin Panel</h1>
            <p>IKG PTU Sports Event Management</p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-outline"
              onClick={() => navigate('/dashboard')}
            >
              Student View
            </button>
            <button className="btn btn-outline" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            Game Management
          </button>
          <button
            className={`tab ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            Registrations ({registrations.length})
          </button>
        </div>

        {activeTab === 'games' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Games</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowGameModal(true)}
              >
                + Add Game
              </button>
            </div>
            <div className="games-list">
              {games.map((game) => (
                <div key={game._id} className="admin-game-card">
                  <div className="game-info">
                    <h3>{game.name}</h3>
                    {game.description && <p>{game.description}</p>}
                    <div className="game-meta">
                      <span className={`badge ${game.registrationOpen ? 'badge-success' : 'badge-danger'}`}>
                        {game.registrationOpen ? 'Open' : 'Closed'}
                      </span>
                      <span className={`badge ${game.gameType === 'registrable' ? 'badge-info' : 'badge-warning'}`}>
                        {game.gameType === 'registrable' ? 'Registrable' : 'Display Only'}
                      </span>
                    </div>
                  </div>
                  <div className="game-actions">
                    <button
                      className="btn btn-outline"
                      onClick={() => toggleRegistration(game)}
                    >
                      {game.registrationOpen ? 'Close' : 'Open'} Registration
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => handleEditGame(game)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteGame(game._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Student Registrations</h2>
              <div className="header-filters">
                <select
                  className="form-select"
                  value={filterGame}
                  onChange={(e) => setFilterGame(e.target.value)}
                  style={{ width: '200px' }}
                >
                  <option value="">All Games</option>
                  {games.map((game) => (
                    <option key={game._id} value={game._id}>
                      {game.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '250px' }}
                />
                <button className="btn btn-secondary" onClick={exportToCSV}>
                  Export CSV
                </button>
              </div>
            </div>
            <div className="registrations-table-container">
              <table className="registrations-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Email</th>
                    <th>Game</th>
                    <th>Registered At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                        No registrations found
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg._id}>
                        <td>{reg.student.name}</td>
                        <td>{reg.student.rollNumber}</td>
                        <td>{reg.student.course}</td>
                        <td>{reg.student.year}</td>
                        <td>{reg.student.email}</td>
                        <td>{reg.game.name}</td>
                        <td>{new Date(reg.registeredAt).toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={async () => {
                              try {
                                await axios.delete(`/api/registrations/${reg._id}`);
                                showToast('Registration deleted', 'success');
                                fetchRegistrations();
                              } catch (error) {
                                showToast('Failed to delete registration', 'error');
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Game Modal */}
      <Modal
        isOpen={showGameModal}
        onClose={() => {
          setShowGameModal(false);
          setGameForm({
            name: '',
            description: '',
            registrationOpen: true,
            gameType: 'registrable'
          });
        }}
        title="Add New Game"
      >
        <form onSubmit={handleCreateGame}>
          <div className="form-group">
            <label className="form-label">Game Name</label>
            <input
              type="text"
              className="form-input"
              value={gameForm.name}
              onChange={(e) =>
                setGameForm({ ...gameForm, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows="3"
              value={gameForm.description}
              onChange={(e) =>
                setGameForm({ ...gameForm, description: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Game Type</label>
            <select
              className="form-select"
              value={gameForm.gameType}
              onChange={(e) =>
                setGameForm({ ...gameForm, gameType: e.target.value })
              }
            >
              <option value="registrable">Registrable</option>
              <option value="display-only">Display Only</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              <input
                type="checkbox"
                checked={gameForm.registrationOpen}
                onChange={(e) =>
                  setGameForm({
                    ...gameForm,
                    registrationOpen: e.target.checked
                  })
                }
                style={{ marginRight: '8px' }}
              />
              Registration Open
            </label>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary">
              Create Game
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowGameModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Game Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedGame(null);
        }}
        title="Edit Game"
      >
        <form onSubmit={handleUpdateGame}>
          <div className="form-group">
            <label className="form-label">Game Name</label>
            <input
              type="text"
              className="form-input"
              value={gameForm.name}
              onChange={(e) =>
                setGameForm({ ...gameForm, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows="3"
              value={gameForm.description}
              onChange={(e) =>
                setGameForm({ ...gameForm, description: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Game Type</label>
            <select
              className="form-select"
              value={gameForm.gameType}
              onChange={(e) =>
                setGameForm({ ...gameForm, gameType: e.target.value })
              }
            >
              <option value="registrable">Registrable</option>
              <option value="display-only">Display Only</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              <input
                type="checkbox"
                checked={gameForm.registrationOpen}
                onChange={(e) =>
                  setGameForm({
                    ...gameForm,
                    registrationOpen: e.target.checked
                  })
                }
                style={{ marginRight: '8px' }}
              />
              Registration Open
            </label>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary">
              Update Game
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowEditModal(false)}
            }
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
