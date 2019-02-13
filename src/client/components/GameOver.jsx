import React from 'react';

const GameOver = ({ gameData, initGame }) => (
  <div 
    className={gameData.gameOver ? 'beater__gameover fadeIn' : 'beater__gameover'}
  >
    <h1 className="beater__gameover-title">Game Over</h1>
    <h2>Your Final Score: {gameData.score}</h2>
    <h2>Level Reached: {gameData.level}</h2>
    <button
      className="beater__main-start-button"
      onClick={initGame}
    >
    Try Again
    </button>
  </div>
);

export default GameOver;
