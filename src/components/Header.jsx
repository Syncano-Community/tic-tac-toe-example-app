import React from 'react';

import Spinner from './Spinner';

export default React.createClass({

  displayName: 'Header',

  getStyles() {
    return {
      base: {
        color: '#607D8B',
        textAlign: 'center',
        fontWeight: 500,
        fontSize: 20
      },
      winner: {
        fontSize: 40,
        fontWeight: 400
      }
    };
  },

  renderContent() {
    const styles = this.getStyles();
    const player = this.props.player;
    const winner = this.props.winner;

    if (winner) {
      const winnerName = winner && player && winner.id === player.id ? 'You win!' : `${winner.name} wins!`;

      return (
        <div style={styles.winner}>
          {winnerName}
        </div>
      );
    }
    if (this.props.isGameOver && !winner) {
      return (
        <div style={styles.winner}>
          DRAW!
        </div>
      );
    }
    if (!this.props.hasOpponent) {
      return (
        <div style={styles.winner}>
          Waiting for opponent...
          <Spinner />
        </div>
      );
    }

    return (
      <div>
        <p>{this.props.player ? `You are currently playing as ${this.props.player.play_as}` : null}</p>
        <p>{this.props.winner ? `The winner is ${this.props.winner.name}` : `Now it's ${this.props.turn} turn`}</p>
      </div>
    );
  },

  render() {
    let styles = this.getStyles();

    return (
      <div style={styles.base}>
        {this.renderContent()}
      </div>
    );
  }
});
