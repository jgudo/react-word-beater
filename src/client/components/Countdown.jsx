import React, { Component } from 'react';

class Countdown extends Component {
  state = {
    count: 3
  };

  componentWillUnmount() {
    clearInterval(this.gameCountdown);
  }

  gameCountdown = setInterval(() => {
    this.setState({ count: this.state.count - 1 });

    if (this.state.count < 1) {
      this.props.initTimer();
      clearInterval(this.gameCountdown);
    } 
  }, 1000);

  render() {
    console.log(this.state.count);
    return (
      <div className="beater__countdown">
        <h1>Game will start in </h1>
        <h1 className="beater__countdown-count">{this.state.count}</h1>
        <br/>
        <p>Get ready!</p>
      </div>
    );
  }
}

export default Countdown;
