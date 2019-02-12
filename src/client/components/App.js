import React, { Component } from 'react';
import word from '../helpers/random-word';

export default class App extends Component {
  state = {
    gameStarted: false,
    currentWord: undefined,
    typedValue: '',
    score: 0,
    level: 1,
    timer: 20,
    timerBase: 20,
    plusScore: 10,
    gameOver: false
  };

  componentDidUpdate() {
    const { 
      currentWord, 
      typedValue, 
      plusScore, 
      timerBase
    } = this.state;

    if (typedValue === currentWord) {
      this.setState(prevState => ({
        currentWord: word(),
        typedValue: '',
        score: prevState.score + plusScore,
        timer: timerBase
      }));
    }
  }

  initGame = () => {
    this.setState(() => ({ 
      gameStarted: true,
      gameOver: false,
      currentWord: word(),
      score: 0,
      level: 1
    }));

    document.addEventListener('click', (e) => {
      // console.log(e.target);
      e.stopImmediatePropagation();
      if (this.state.gameStarted) this.wordTypeInput.focus();
    });

    // Init time
    this.initTimer();
  };

  initTimer = () => {
    const gameTimer = setInterval(() => {
      this.setState(() => ({ timer: this.state.timer - 1 }));
      if (this.state.timer <= 0 || this.state.gameOver) {
        clearInterval(gameTimer);
        this.setState(() => ({ 
          gameOver: true,
          gameStarted: false, 
          timer: 20,
          typedValue: '',
          currentWord: undefined
        }));
      }  
    }, 1000);
  }
  
  onTypeHandler = (e) => {
    const input = e.target.value;
    this.setState(() => ({ typedValue: input }));
  };

  render() {
    const { 
      gameStarted,
      gameOver, 
      currentWord,
      timer,
      score,
      typedValue,
      level
    } = this.state;
    return (
      <div>
        {(!gameStarted && !gameOver) && (
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
              onClick={this.initGame}
            >
            Start Game
            </button>
          </div>
        )}

        {gameStarted && (
          <div className="beater__game">
            <h1 className="beater__game-current">{currentWord}</h1>
            <h4>
              <span>Seconds Remaining: </span>
              {timer}
            </h4>
            <h4>
              <span>Score:</span>
              {score}
            </h4>
            <input
              autoFocus
              className="beater__game-input"
              onChange={this.onTypeHandler}
              /* eslint-disable */
              ref={el => this.wordTypeInput = el} 
              /* eslint-enable */
              value={typedValue}
              type="text"
            />
          </div>
        )}

        {gameOver && (
          <div className="beater__gameover">
            <h1>Game Over</h1>
            <h2>Your Final Score: {score}</h2>
            <h2>Level Reached: {level}</h2>
            <button
              className="beater__main-start-button"
              onClick={this.initGame}
            >
            Try Again
            </button>
          </div>
        )}
      </div>
    );
  }
}
