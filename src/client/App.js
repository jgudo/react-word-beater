import React, { Component } from 'react';

import MainScreen from './components/MainScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';
import Music from './components/Music';
import Countdowm from './components/Countdown';
import Loader from './components/Loader';
import { generateWord, generateGreet } from './helpers/random-word';

import correctBgm from './audios/correct.mp3';
import gameoverBgm from './audios/gameover.mp3';
import gameBgm from './audios/happy.mp3';

class App extends Component {
  constructor() {
    super();

    this.state = {
      gameStarted: false,
      currentWord: undefined,
      countdownFinished: false,
      typedValue: '',
      score: 0,
      level: 1,
      timer: 20,
      timerBase: 20,
      plusScore: 10,
      gameOver: false,
      audioMuted: false,
      greet: 'awesome!',
      highScore: undefined,
      lastScore: undefined,
      isLoaded: false
    };

    this.sound = {
      gameover: new Audio(gameoverBgm),
      main: new Audio(gameBgm),
      correct: new Audio(correctBgm)
    };

    this.sound.main.volume = 0.1;
    this.sound.main.autoplay = true;
    this.sound.main.loop = true;
  }

  componentDidMount() {  
    if (localStorage.wordBeaterStats) {
      const stats = JSON.parse(localStorage.getItem('wordBeaterStats'));
      this.setState({
        lastScore: stats.lastScore,
        highScore: stats.highScore
      });
    }
    setTimeout(() => {
      this.setState({ isLoaded: true });
    }, 3000);
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
      this.setState({
        currentWord: generateWord(),
        typedValue: '',
        score: prevState.score + plusScore,
        timer: timerBase,
        greet: generateGreet()
      }, this.setInputMaxLength);
      // play correctBgm 
      if (!audioMuted) {
        this.sound.correct.currentTime = 0;
        this.sound.correct.play();
      }
    
      if (score >= 4490) {
        this.setGameStateOnComplete(3, 6, 3, 25); // lvl 6: 3s
      } else if (score >= 3990) {
        this.setGameStateOnComplete(6, 5, 6, 20); // lvl 5: 6s
      } else if (score >= 2490) {
        this.setGameStateOnComplete(9, 4, 9, 20); // lvl 4: 9s
      } else if (score >= 1490) {
        this.setGameStateOnComplete(12, 3, 12, 20); // lvl 3: 12s
      } else if (score >= 490) {
        this.setGameStateOnComplete(15, 2, 15, 15); // lvl 2: 15s
      }
    } 
  
    // Contro main sound
    if (audioMuted) {
      this.sound.main.pause();
      this.sound.main.currentTime = 0;
    } else {
      this.sound.main.play();
    }
  }

  setGameStateOnComplete = (tb, lvl, t, ps = 10) => {
    this.setState({
      timerBase: tb,
      level: lvl,
      timer: t,
      plusScore: ps
    });
  };
 
  initGame = () => {
    this.setState({ 
      gameStarted: true,
      gameOver: false,
      currentWord: generateWord(),
      score: 0,
      level: 1
    });

    // Adjust main sound
    this.sound.main.volume = 0.05;

    // Prevent losing focus
    document.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      if (this.state.gameStarted && this.state.countdownFinished) this.wordTypeInput.focus();
    });
  };

  quitGame = () => {
    this.setState({
      gameStarted: false,
      gameOver: false
    });
  };

  updateHighScore = () => {
    if (localStorage.wordBeaterStats) {
      const stats = JSON.parse(localStorage.getItem('wordBeaterStats'));
      const highScore = stats.highScore || 0;
      const newHighScore = this.state.score > highScore ? this.state.score : highScore;

      this.setState({
        highScore: newHighScore,
        lastScore: stats.lastScore
      });

      localStorage.setItem('wordBeaterStats', JSON.stringify({
        highScore: newHighScore,
        lastScore: this.state.score
      }));
    } else {
      localStorage.setItem('wordBeaterStats', JSON.stringify({
        highScore: this.state.score,
        lastScore: this.state.score
      }));
    }
  };

  initTimer = () => {
    this.setState({ countdownFinished: true });
    this.setInputMaxLength();

    const gameTimer = setInterval(() => {
      this.setState({ timer: this.state.timer - 1 });

      if (this.state.timer <= 0 || this.state.gameOver) {
        clearInterval(gameTimer);
        this.updateHighScore();

        this.setState({ 
          gameOver: true,
          countdownFinished: false,
          gameStarted: false, 
          timer: 20,
          timerBase: 20,
          typedValue: '',
          plusScore: 10,
          currentWord: undefined,
          greet: 'awesome!',
          correct: false
        });

        // Control sound
        if (!this.state.audioMuted) this.sound.gameover.play();
        this.sound.main.volume = 0.1;
      }  
    }, 1000);
  };

  onTypeHandler = (e) => {
    const input = e.target.value.toLowerCase().trim();
   
    this.setState({ typedValue: input });
  };

  setInputMaxLength = () => {
    this.wordTypeInput.setAttribute('maxlength', this.state.currentWord.length);
  };

  audioHandler = () => {
    this.setState({ audioMuted: !this.state.audioMuted });
  };

  render() {
    const { 
      gameStarted,
      gameOver, 
      audioMuted,
      isLoaded,
      countdownFinished
    } = this.state;

    /* eslint-disable no-return-assign */
    return (
      <React.Fragment>
        {isLoaded ? (
          <div className={isLoaded ? 'beater fadeIn' : 'beater'}>
            <Music 
                audioHandler={this.audioHandler}
                audioMuted={audioMuted}
            />
            {(gameStarted && !countdownFinished) && (
              <Countdowm initTimer={this.initTimer} />
            )}
            {(gameStarted && countdownFinished) && (
              <Game 
                  gameData={this.state}
                  onTypeHandler={this.onTypeHandler}
                  wordTypeInput={el => this.wordTypeInput = el}
              />
            )}
            {gameOver && (
              <GameOver 
                  gameData={this.state}
                  initGame={this.initGame}
                  quitGame={this.quitGame}
              />
            )}
            {(!gameStarted && !gameOver) && (
              <MainScreen initGame={this.initGame} />
            )}
          </div>
        ) : (
          <Loader />
        )}
      </React.Fragment>
    );
  }
}

export default App;
