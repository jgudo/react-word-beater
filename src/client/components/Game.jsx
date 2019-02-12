import React from 'react';

const Game = ({
  gameData,
  onTypeHandler,
  onKeyUpHandler,
  wordTypeInput,
  visibleCurrentWord
}) => (
  <div className="beater__game">
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
          <h2>
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
          <h2>
            {gameData.score}
          </h2>
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

export default Game;
