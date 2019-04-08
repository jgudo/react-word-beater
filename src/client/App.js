import React, { Component } from 'react';
import word from './helpers/random-word';
import MainScreen from './components/MainScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';
import Music from './components/Music';
import Countdowm from './components/Countdown';
import Loader from './components/Loader';

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
        currentWord: word(),
        typedValue: '',
        score: prevState.score + plusScore,
        timer: timerBase
      });
      // play correctBgm 
      if (!audioMuted) {
        this.sound.correct.currentTime = 0;
        this.sound.correct.play();
      }
      // Show greet
      this.showGreet();
    
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

  setGameStateOnComplete = (
    timerBase, 
    level, 
    timer, 
    plusScore = 10
  ) => {
    this.setState({
      timerBase,
      level,
      timer,
      plusScore
    });
  };
 
  initGame = () => {
    this.setState({ 
      gameStarted: true,
      gameOver: false,
      currentWord: word(),
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

    // Init time
    // this.initTimer();
  };

  quitGame = () => {
    this.setState({
      gameStarted: false,
      gameOver: false
    });
  };

  initTimer = () => {
    this.setState({ countdownFinished: true });
    const gameTimer = setInterval(() => {
      this.setState({ timer: this.state.timer - 1 });

      if (this.state.timer <= 0 || this.state.gameOver) {
        clearInterval(gameTimer);

        if (localStorage.wordBeaterStats) {
          const stats = JSON.parse(localStorage.getItem('wordBeaterStats'));
          const highScore = stats.highScore || 0;
          const lastScore = stats.lastScore || this.state.score;

          const newHighScore = this.state.score > highScore ? this.state.score : highScore;

          this.setState({
            highScore: newHighScore,
            lastScore
          });

          localStorage.setItem('wordBeaterStats', JSON.stringify({
            highScore: newHighScore,
            lastScore
          }));
        } else {
          localStorage.setItem('wordBeaterStats', JSON.stringify({
            highScore: this.state.score,
            lastScore: this.state.score
          }));
        }

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

  // greetings upon correct typed word
  showGreet = () => {
    const greets = [
      'nice!', 'awesome!', 'excellent!', 'fantastic!',
      'incredible!', 'marvelous!', 'wonderful!', 'incredible!',
      'amazing!', 'impressive!', 'wowowee!', 'perfect!'
    ];
    const random = Math.floor(Math.random() * greets.length);

    this.setState({ greet: greets[random] });
  };

  onTypeHandler = (e) => {
    const input = e.target.value.toLowerCase().trim();

    this.wordTypeInput.setAttribute('maxlength', this.state.currentWord.length);
    this.setState({ typedValue: input });
  };

  audioHandler = () => {
    this.setState(prevState => ({ audioMuted: !prevState.audioMuted }));
  };

  render() {
    const { 
      gameStarted,
      gameOver, 
      audioMuted,
      isLoaded,
      countdownFinished
    } = this.state;

    return (
      <div className={isLoaded ? 'beater fadeIn' : 'beater'}>
        {!isLoaded && <Loader />}
        {(gameStarted && !countdownFinished) && (
          <Countdowm initTimer={this.initTimer} />
        )}
        {(gameStarted && countdownFinished) && (
          <React.Fragment>
            <Game 
                /* eslint-disable no-return-assign */
                gameData={this.state}
                onTypeHandler={this.onTypeHandler}
                wordTypeInput={el => this.wordTypeInput = el}
            />
            <Music 
                audioHandler={this.audioHandler}
                audioMuted={audioMuted}
            />
          </React.Fragment>
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
    );
  }
}

export default App;
