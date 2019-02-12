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

  componentDidUpdate(prevProps, prevState) {
    const { 
      currentWord, 
      typedValue,
      plusScore,
      score,
      timerBase
    } = this.state;

    if (typedValue === currentWord) {
      this.setState(() => ({
        currentWord: word(),
        typedValue: '',
        score: prevState.score + plusScore,
        timer: timerBase
      }));

      if (score >= 490) {
        this.setState(() => ({
          timerBase: 15,
          level: 2,
          timer: 15
        }));
      } else if (score >= 1190) {
        this.setState(() => ({
          timerBase: 12,
          level: 3, 
          timer: 12
        }));
      } else if (score >= 2490) {
        this.setState(() => ({
          timerBase: 9,
          level: 4, 
          timer: 9
        }));
      } else if (score >= 3990) {
        this.setState(() => ({
          timerBase: 6,
          level: 5, 
          timer: 6
        }));
      } else if (score >= 4490) {
        this.setState(() => ({
          timerBase: 3,
          level: 6, 
          timer: 3
        }));
      }
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
    const input = e.target.value.toLowerCase().trim();
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
            <div className="beater__game-wrapper">
              <div className="beater__game-current">
                <h1>{currentWord}</h1>
              </div>
              <div className="beater__game-widgets">
                <div className="beater__game-widgets-wrapper">
                  <span>Level</span>
                  <h2>
                    {level}
                  </h2>
                </div>
                <div className="beater__game-widgets-wrapper">
                  <span>Time </span>
                  <h2>
                    {timer}
                  </h2>
                </div>
                <div className="beater__game-widgets-wrapper">
                  <span>Score</span>
                  <h2>
                    {score}
                  </h2>
                </div>
              </div>
              <input
                autoFocus
                className="beater__game-input"
                onChange={this.onTypeHandler}
                /* eslint-disable */
                ref={el => this.wordTypeInput = el} 
                /* eslint-enable */
                placeholder="Start Typing Now!"
                value={typedValue}
                type="text"
              />
            </div>
          </div>
        )}

        {gameOver && (
          <div className="beater__gameover">
            <h1 className="beater__gameover-title">Game Over</h1>
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
