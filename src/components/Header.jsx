import React from 'react';

export default React.createClass({

  displayName: 'Header',

  getStyles() {
    return {
      base: {
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
    let styles = this.getStyles();

    if (this.props.winner) {
      return (
        <div style={styles.winner}>
          {`${this.props.winner.name} wins!`}
        </div>
      );
    }
    if (!this.props.hasOpponent) {
      return (
        <div className="pulse">
          Waiting for opponent...
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
