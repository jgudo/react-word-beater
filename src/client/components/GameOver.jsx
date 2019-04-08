import React from 'react';
import PropTypes from 'prop-types';

const GameOver = (props) => {
  const { 
    gameData: {
      highScore,
      lastScore,
      score,
      level
    }, 
    initGame, 
    quitGame 
  } = props;

  return (
    <div 
        className="beater__gameover fadeIn"
    >
      <h1 className="beater__gameover-title">Game Over</h1>
      <div className="beater__gameover-summary">
        <h2>Your Final Score:</h2>
        <h2>{score}</h2>
      </div>
      <div className="beater__gameover-summary">
        <h2>Level Reached:</h2>
        <h2>{level}</h2>
      </div>
      {highScore && (
        <div className="beater__gameover-summary">
          <h2>Your High Score:</h2>
          <h2>{highScore}</h2>
        </div>
      )}
      {lastScore && (
        <div className="beater__gameover-summary">
          <h2>Your Last Score:</h2>
          <h2>{lastScore}</h2>
        </div>
      )}
      
      <div className="beater__main-actions">
        <button
            className="beater__main-start-button"
            onClick={initGame}
        >
        Try Again
        </button>
        <button
            className="beater__main-quit-button"
            onClick={quitGame}
        >
        Quit
        </button>
      </div>
    </div>
  );
};

GameOver.propTypes = {
  gameData: PropTypes.shape({
    gameOver: PropTypes.bool,
    score: PropTypes.number,
    level: PropTypes.number
  }),
  initGame: PropTypes.func,
  quitGame: PropTypes.func
};

export default GameOver;
