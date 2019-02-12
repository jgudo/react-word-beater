import React from 'react';

const MainScreen = props => (
  <div className="beater__main">
    <h1 className="beater__main-title">Word Beater</h1>
    <p className="beater__main-subtitle">
      Do you have what is takes to become the fastest and accurate typist?
    </p>
    <p className="beater__main-subtitle">
      Type every single word correctly in a given time limit to become a master of word beater!
    </p>
    <button
      className="beater__main-start-button"
      onClick={props.initGame}
    >
    Start Game
    </button>
  </div>
);

export default MainScreen;
