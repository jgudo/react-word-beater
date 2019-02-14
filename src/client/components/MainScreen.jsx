import React from 'react';

const MainScreen = props => (
  <div className="beater__main">
    <h1 className="beater__main-title">Word Beater</h1>
    <p className="beater__main-subtitle">
      Do you have what is takes to become the fastest and accurate typist?
      Type every single word correctly in a given time limit to become a master of word beater!
    </p>
    <button
      className="beater__main-start-button"
      onClick={props.initGame}
    >
    Start Game
    </button>

    <div className="copyright">
      <span>Music used in this game is not mine, downloaded from 
        &nbsp; <a href="zedge.net" target="_blank">Zedge</a> &nbsp;
        and &nbsp;<a href="https://www.youtube.com/watch?v=OrPEoqp4sjg" target="_blank">Alumo Music on Youtube</a>
      </span>
    </div>
  </div>
);

export default MainScreen;
