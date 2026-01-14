import React from 'react';
import './GameCard.css';

const GameCard = ({ game, isRegistered, onRegister, onUnregister }) => {
  const canRegister =
    game.gameType === 'registrable' &&
    game.registrationOpen &&
    !isRegistered;

  return (
    <div className={`game-card ${isRegistered ? 'registered' : ''}`}>
      <div className="game-card-header">
        <h3 className="game-name">{game.name}</h3>
        <div className="game-badges">
          {game.gameType === 'display-only' && (
            <span className="badge badge-info">Display Only</span>
          )}
          {game.registrationOpen ? (
            <span className="badge badge-success">Open</span>
          ) : (
            <span className="badge badge-danger">Closed</span>
          )}
          {isRegistered && (
            <span className="badge badge-warning">Registered</span>
          )}
        </div>
      </div>
      {game.description && (
        <p className="game-description">{game.description}</p>
      )}
      <div className="game-card-actions">
        {canRegister && (
          <button className="btn btn-primary" onClick={onRegister}>
            Register
          </button>
        )}
        {isRegistered && (
          <button className="btn btn-danger" onClick={onUnregister}>
            Cancel Registration
          </button>
        )}
        {game.gameType === 'display-only' && (
          <span className="display-only-text">No registration required</span>
        )}
        {!game.registrationOpen && game.gameType === 'registrable' && (
          <span className="closed-text">Registration closed</span>
        )}
      </div>
    </div>
  );
};

export default GameCard;
