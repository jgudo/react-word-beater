import React, { Component } from 'react';
import word from '../helpers/random-word';
import MainScreen from './MainScreen';
import Game from './Game';
import GameOver from './GameOver';
import Music from './Music';

const loader = document.getElementById('loader');

export default class App extends Component {
  constructor() {
    super();

    this.gameOverAudio = new Audio('/audios/gameover.mp3');
    this.correctWordAudio = new Audio('/audios/correct.mp3');
    this.mainSound = new Audio('./audios/happy.mp3');
    this.mainSound.volume = 0.1;
    this.mainSound.loop = true;
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
    greet: '',
    logs: []
  };

  componentDidMount() {
    if (loader) {
      setTimeout(() => {
        loader.classList.add('available');
      }, 2500);
      setTimeout(() => {
        loader.outerHTML = '';
      }, 3000);
    }

    if (!this.state.audioMuted) {
      this.mainSound.play();
    }
  }

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
      if (!audioMuted) {
        this.correctWordAudio.currentTime = 0;
        this.correctWordAudio.play();
      }
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

    // Contro main sound
    if (audioMuted) {
      this.mainSound.pause();
      this.mainSound.currentTime = 0;
    } else {
      this.mainSound.play();
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

    // Adjust main sound
    this.mainSound.volume = 0.05;

    // Prevent losing focus
    document.addEventListener('click', (e) => {
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

        // Control sound
        if (!this.state.audioMuted) this.gameOverAudio.play();
        this.mainSound.volume = 0.1;
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
            gameData={this.state}
            initGame={this.initGame}
          />
        )}
        <Music 
          audioMuted={audioMuted}
          audioHandler={this.audioHandler}
        />
        
      </div>
    );
  }
}
