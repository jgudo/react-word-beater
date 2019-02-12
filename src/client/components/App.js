import React, { Component } from 'react';
import word from '../helpers/random-word';
import MainScreen from './MainScreen';
import Game from './Game';
import GameOver from './GameOver';

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
    gameOver: false,
    correct: false,
    greet: ''
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
        timer: timerBase,
        correct: true
      }));

      this.showGreet();

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
          currentWord: undefined,
          greet: '',
          correct: false
        }));
      }  
    }, 1000);
  }

  showGreet = () => {
    const greets = [
      'nice!', 'awesome!', 'excellent!', 'fantastic!',
      'incredible!', 'marvelous!', 'wonderful!', 'incredible!',
      'amazing!', 'impressive!', 'wowowee!', 'perfect!'
    ];
    const random = Math.floor(Math.random() * greets.length);
    this.setState(() => ({ greet: greets[random] }));
  };

  onKeyUpHandler = (e) => {
    const input = e.target.value;
    const regExp = new RegExp(input, 'g');

    this.visibleCurrentWord.innerHTML = this.state.currentWord;
    if (input.trim() !== '') {
      this.visibleCurrentWord.innerHTML = this.state.currentWord.replace(regExp, (match) => {
        return `<span class="matched">${match}</span>`;
      });
    }
  }
  
  onTypeHandler = (e) => {
    const input = e.target.value.toLowerCase().trim();
    this.setState(() => ({ 
      typedValue: input,
      correct: this.state.currentWord !== this.state.typedValue && false  
    }));
  };

  render() {
    const { 
      gameStarted,
      gameOver, 
      score,
      level
    } = this.state;

    return (
      <div>
        {(!gameStarted && !gameOver) && (
          <MainScreen initGame={this.initGame} />
        )}
        {gameStarted && (
          <Game 
            /* eslint-disable */
            wordTypeInput={el => this.wordTypeInput = el}
            gameData={this.state}
            visibleCurrentWord={el => this.visibleCurrentWord = el}
            /* eslint-enable */
            onTypeHandler={this.onTypeHandler}
            onKeyUpHandler={this.onKeyUpHandler}  
          />
        )}

        {gameOver && (
          <GameOver 
            score={score}
            level={level}
            initGame={this.initGame}
          />
        )}
      </div>
    );
  }
}
