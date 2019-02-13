import React from 'react';

const Game = ({
  gameData,
  onTypeHandler,
  onKeyUpHandler,
  wordTypeInput,
  visibleCurrentWord,
  plusScoreRef
}) => {
  const levelColor = {
    1: '#fff',
    2: '#488ca1',
    3: '#99da00',
    4: '#F9E606',
    5: '#ED06FB',
    6: '#9B1BEA' 
  };

  const textShadow = {
    1: 'rgba(255, 255, 255, .4)',
    2: 'rgba(72, 140, 161, .4)',
    3: 'rgba(153, 218, 0, .4)',
    4: 'rgba(249, 230, 6, .4)',
    5: 'rgba(237, 6, 251, .4)',
    6: 'rgba(155, 27, 234, .4)'
  };

  return (
    <div 
      className={gameData.gameStarted ? 'beater__game fadeIn' : 'beater__game'}
    >
        <div className="beater__game-wrapper">
          <div className="beater__game-greet">
          {gameData.correct && (
            <h2 className={gameData.correct ? 'showGreet' : null}>
              <img src="/images/star.svg" alt=""/>
              {gameData.greet}
              <img src="/images/star.svg" alt=""/>
            </h2>
          )}
          </div>
        <div className="beater__game-current">
          <p>TYPE THE WORD</p>
          <h1 
            ref={visibleCurrentWord}
          >
          {gameData.currentWord}
          </h1>
        </div>
        <div className="beater__game-widgets">
          <div className="beater__game-widgets-wrapper">
            <span>Level</span>
            <h2 style={{
              color: levelColor[gameData.level],
              textShadow: `0 0 15px ${textShadow[gameData.level]}`
            }}>
              {gameData.level}
            </h2>
          </div>
          <div className="beater__game-widgets-wrapper">
            <span>
              Time 
            </span>
            <h2 className={gameData.timer <= 3 ? 'timeRunningOut' : null}>
              {gameData.timer}
            </h2>
          </div>
          <div className="beater__game-widgets-wrapper">
            <span>Score</span>
            <div>
              <h2>
                {gameData.score}
              </h2>
              <span 
                className="plus"
                ref={plusScoreRef}
              >
              +{gameData.plusScore}
              </span>
            </div>
          </div>
        </div>
        <input
          autoFocus
          className="beater__game-input"
          onChange={onTypeHandler}
          ref={wordTypeInput} 
          placeholder="Start Typing Now!"
          onKeyUp={onKeyUpHandler}
          value={gameData.typedValue}
          type="text"
        />
      </div>
  </div>
  );
};

export default Game;
