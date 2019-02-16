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

    this.sound = {
      gameover: new Audio('/audios/gameover.mp3'),
      main: new Audio('./audios/happy.mp3'),
      correct: new Audio('/audios/correct.mp3')
    };

    this.sound.main.volume = 0.1;
    this.sound.main.autoplay = true;
    this.sound.main.loop = true;
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

  componentDidMount() {
    this.registerSW();
    
    if (loader) {
      setTimeout(() => {
        loader.classList.add('available');
      }, 2500);
      setTimeout(() => {
        loader.outerHTML = '';
      }, 3000);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { 
      currentWord, 
      typedValue,
      plusScore,
      score,
      timerBase,
      audioMuted,
      gameStarted
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
        this.sound.correct.currentTime = 0;
        this.sound.correct.play();
      }
      // Show greet
      this.showGreet();
    
      if (score >= 4490) {
        this.setGameStateOnComplete(3, 6, 3, 25);
      } else if (score >= 3990) {
        this.setGameStateOnComplete(6, 5, 6, 20);
      } else if (score >= 2490) {
        this.setGameStateOnComplete(9, 4, 9, 20);
      } else if (score >= 1490) {
        this.setGameStateOnComplete(12, 3, 12, 20);
      } else if (score >= 490) {
        this.setGameStateOnComplete(15, 2, 15, 15);
      }    
    } 
  
    // Contro main sound
    if (audioMuted) {
      this.sound.main.pause();
      this.sound.main.currentTime = 0;
    } else {
      this.sound.main.play();
    }

    if (gameStarted) {
      if (prevState.score < score) {
        this.plusScoreRef.classList.add('plusPoints');
      } else {
        this.plusScoreRef.classList.remove('plusPoints');
      }
    }
  }
  
  registerSW = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('SW registered: ', registration);
      }).catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
    }
  };

  setGameStateOnComplete = (timerBase, level, timer, plusScore = 10) => {
    this.setState(() => ({
      timerBase,
      level,
      timer,
      plusScore
    }));
  };
 
  initGame = () => {
    this.setState(() => ({ 
      gameStarted: true,
      gameOver: false,
      currentWord: word(),
      score: 0,
      level: 1
    }));

    // Adjust main sound
    this.sound.main.volume = 0.05;

    // Prevent losing focus
    document.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      if (this.state.gameStarted) this.wordTypeInput.focus();
    });

    // Init time
    this.initTimer();
  };

  quitGame = () => {
    this.setState(() => ({
      gameStarted: false,
      gameOver: false
    }));
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
          timerBase: 20,
          typedValue: '',
          plusScore: 10,
          currentWord: undefined,
          greet: '',
          correct: false
        }));

        // Control sound
        if (!this.state.audioMuted) this.sound.gameover.play();
        this.sound.main.volume = 0.1;
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
    this.wordTypeInput.setAttribute('maxlength', this.state.currentWord.length);
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
            gameData={this.state}
            plusScoreRef={el => this.plusScoreRef = el}
            wordTypeInput={el => this.wordTypeInput = el}
            visibleCurrentWord={el => this.visibleCurrentWord = el}
            /* eslint-enable */
            onTypeHandler={this.onTypeHandler}
            onKeyUpHandler={this.onKeyUpHandler}  
          />
        )}

        {gameOver && (
          <GameOver 
            initGame={this.initGame}
            gameData={this.state}
            quitGame={this.quitGame}
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
