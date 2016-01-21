import React from 'react';
import Reflux from 'reflux';

import Actions from '../Actions/Actions';
import Store from '../Stores/Store';

import Field from './Field';

export default React.createClass({

  displayName: 'Board',

  mixins: [Reflux.connect(Store)],

  componentWillMount() {
    Actions.fetchBoard();
    Actions.enableBoardPoll();
    Actions.enablePlayersPoll();
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextState.currentPlayer) {
      Actions.connectPlayer(nextState.currentPlayer.id);
    }
  },

  getStyles() {
    return {
      board: {
        border: '1px solid #777',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 312,
        margin: '0px auto'
      }
    };
  },

  handleClearBoard() {
    let dataObjectsIds = this.state.items.map((dataObject) => dataObject.id);

    Actions.clearBoard(dataObjectsIds);
  },

  handleFieldClick(dataObjectId, index) {
    let state = this.state;
    let value = state.currentPlayer.is_player_turn ? state.turn : state.turn;

    if (state.items[index].value === null) {
      Actions.updateField(dataObjectId, value);
      Actions.switchTurn(state.currentPlayer.id, state.opponent.id);
      state.items[index].value = value;
      state.currentPlayer.is_player_turn = !state.currentPlayer.is_player_turn;
      this.setState(state);
    }
  },

  renderFields() {
    let fields = this.state.items.map((item, index) => {
      return (
        <Field
          key={`field${item.id}`}
          ref={`field${item.id}`}
          value={item.value}
          backgroundColor={item.color}
          disabled={!this.state.isPlayerTurn || this.state.winner || item.value}
          handleClick={this.handleFieldClick.bind(null, item.id, index)}/>
      );
    });

    return fields;
  },

  render() {
    let styles = this.getStyles();
    let turn = this.state.turn;
    let state = this.state;

    console.error(
      'players: ', state.players,
      'available: ', state.availablePlayers,
      'current: ', state.currentPlayer ? state.currentPlayer.id : null,
      'oponent: ', state.opponent ? state.opponent.id : null,
      'isPLayerTurn', state.isPlayerTurn
    );
    return (
      <div>
        <div style={styles.board}>
          {this.renderFields()}
        </div>
        <div>
          {`Now it's player ${turn} turn`}
        </div>
        <div>
          <button onClick={this.handleClearBoard}>
            Clear board
          </button>
        </div>
      </div>
    );
  }
});
