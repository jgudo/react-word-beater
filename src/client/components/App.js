import React, { Component } from 'react';
import word from '../helpers/random-word';
import MainScreen from './MainScreen';
import Game from './Game';
import GameOver from './GameOver';

export default class App extends Component {
  constructor() {
    super();

    this.gameOverAudio = new Audio('/audios/gameover.mp3');
    this.correctWordAudio = new Audio('/audios/correct.mp3');
  }

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
    audioMuted: false,
    greet: ''
  };

  componentDidUpdate(prevProps, prevState) {
    const { 
      currentWord, 
      typedValue,
      plusScore,
      score,
      timerBase,
      audioMuted
    } = this.state;

    if (typedValue === currentWord) {
      this.setState(() => ({
        currentWord: word(),
        typedValue: '',
        score: prevState.score + plusScore,
        timer: timerBase,
        correct: true
      }));
      // play audio
      if (!audioMuted) this.correctWordAudio.play();
      // Show greet
      this.showGreet();

      if (score >= 490) {
        this.setState(() => ({
          timerBase: 15,
          level: 2,
          timer: 15
        }));
      } else if (score >= 1490) {
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
        if (!this.state.audioMuted) this.gameOverAudio.play();
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

  audioHandler = () => {
    this.setState(prevState => ({ audioMuted: !prevState.audioMuted }));
  };

  render() {
    const { 
      gameStarted,
      gameOver, 
      score,
      level,
      audioMuted
    } = this.state;

    return (
      <div className="beater">
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

        <div className="beater__audio-control">
          <span>MUSIC</span>
          <div 
            className="beater__audio-control-wrapper"
            onClick={this.audioHandler}
            style={{
              background: audioMuted ? 'rgba(255, 255, 255, .2)' : 'rgba(153,218,0, .2)'
            }}
          >
            <div 
              className="beater__audio-control-toggle"
              style={{
                transform: audioMuted ? 'translateX(0)' : 'translateX(100%)',
                background: audioMuted ? '#cacaca' : '#99da00'
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
}
