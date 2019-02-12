import React from 'react';

const GameOver = ({
  score,
  initGame,
  level
}) => (
  <div className="beater__gameover">
    <h1 className="beater__gameover-title">Game Over</h1>
    <h2>Your Final Score: {score}</h2>
    <h2>Level Reached: {level}</h2>
    <button
      className="beater__main-start-button"
      onClick={initGame}
    >
    Try Again
    </button>
  </div>
);

export default GameOver;
