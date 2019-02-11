import React, { Component } from 'react';
import word from '../helpers/random-word';

export default class App extends Component {
  state = {
    gameStarted: false,
    currentWord: '',
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
      currentWord: word()
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
      if (this.state.timer <= 0) {
        clearInterval(gameTimer);
        this.setState(() => ({ 
          gameOver: true,
          gameStarted: false, 
          timer: 10,
          typedValue: '' 
        }));
      } 
    }, 1000);
  }
  
  onTypeHandler = (e) => {
    const input = e.target.value;
    this.setState(() => ({ typedValue: input }));
  };

  render() {
    return (
      <div>
        {!this.state.gameStarted && (
          <div className="beater__main">
            <h1>Word Beater</h1>
            <p>Do you have what is takes to become the fastest and accurate typist?</p>
            <p>Type every single word correctly in a given time limit to become a master of word beater!</p>
            <button
              onClick={this.initGame}
            >
            Start Game
            </button>
          </div>
        )}

        {this.state.gameStarted && (
          <div>
            <h1>{this.state.currentWord}</h1>
            <span>Seconds Remaining: </span><h4>{this.state.timer}</h4>
            <input
              autoFocus
              onChange={this.onTypeHandler}
              /* eslint-disable */
              ref={el => this.wordTypeInput = el} 
              /* eslint-enable */
              value={this.state.typedValue}
              type="text"
            />
          </div>
        )}
      </div>
    );
  }
}
