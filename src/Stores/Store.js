import Reflux from 'reflux';
import _ from 'lodash';

import Actions from '../Actions/Actions';

export default Reflux.createStore({
  listenables: Actions,

  getInitialState() {
    return {
      winCombinations: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
      winner: null,
      players: [],
      availablePlayers: [],
      currentPlayer: null,
      opponent: null,
      isPlayerTurn: false,
      turn: null,
      items: []
    };
  },

  init() {
    this.data = this.getInitialState();
  },

  setWinner() {
    let items = this.data.items;

    this.data.winCombinations.some((comb) => {
      let testArr = [items[comb[0]].value, items[comb[1]].value, items[comb[2]].value];

      if (this.isWinner(testArr)) {
        this.data.winner = items[comb[0]].value;
        comb.forEach((index) => {
          this.data.items[index].color = '#F44336';
        });
      }
    });
    this.trigger(this.data);
  },

  isWinner(items) {
    let first = items[0];

    if (items.every((item) => item === null)) {
      return false;
    }

    return items.every((item) => {
      return item === first;
    });
  },

  setAvailablePlayers() {
    this.data.availablePlayers = this.data.players.filter((player) => !player.is_connected);
    if (!this.data.currentPlayer && this.data.availablePlayers.length > 0) {
      this.setCurrentPlayer();
    }
    this.refreshPlayers();
  },

  setCurrentPlayer() {
    let availablePlayers = this.data.availablePlayers;
    let randomIndex = Math.floor(Math.random() * availablePlayers.length);

    this.data.currentPlayer = availablePlayers[randomIndex];
    this.data.opponent = _.differenceBy(this.data.players, [this.data.currentPlayer], 'id')[0];
    this.data.turn = this.data.currentPlayer ? this.data.currentPlayer.play_as : this.data.opponent.play_as;
    this.data.isPlayerTurn = this.data.currentPlayer ? this.data.currentPlayer.is_player_turn : false;
    this.trigger(this.data);
  },

  refreshPlayers() {
    this.data.currentPlayer = _.find(this.data.players, ['id', this.data.currentPlayer.id]);
    this.data.opponent = _.find(this.data.players, ['id', this.data.opponent.id]);
    this.data.isPlayerTurn = this.data.currentPlayer ? this.data.currentPlayer.is_player_turn : false;
    this.trigger(this.data);
  },

  onUpdateField(resp) {
    console.info('onUpdateField: ', resp);
  },

  onUpdateFieldCompleted(resp) {
    console.info('onUpdateFieldCompleted: ', resp);
    Actions.fetchBoard();
  },

  onUpdateFieldFailure(resp) {
    console.info('onUpdateFieldFailure: ', resp);
  },

  onFetchBoard() {
    console.info('onFetchBoard');
  },

  onFetchBoardCompleted(dataObjects) {
    console.info('onFetchBoardCompleted: ', dataObjects);
    this.data.items = dataObjects.map((item) => {
      item.color = '#00BCD4';
      return item;
    });
    this.setWinner();
  },

  onFetchBoardFailure() {
    console.info('onFetchBoardFailure');
  },

  onClearBoardCompleted() {
    console.info('onClearBoardCompleted');
    this.data.winner = null;
    this.trigger(this.data);
  },

  onFetchPlayers() {
    console.info('onFetchPlayers');
  },

  onFetchPlayersCompleted(players) {
    console.info('onFetchPlayersCompleted');
    this.data.players = players;
    this.setAvailablePlayers();
  },

  onFetchPlayersFailure() {
    console.info('onFetchPlayersFailure');
  },

  onSwitchTurn() {
    console.info('onSwitchTurn');
  },

  onSwitchTurnCompleted() {
    console.info('onSwitchTurnCompleted');
  },

  onSwitchTurnFailure() {
    console.info('onSwitchTurnFailure');
  },

  onDisconnectPlayer() {
    console.info('onDisconnectPlayer');
  },

  onDisconnectPlayerCompleted() {
    console.info('onDisconnectPlayerCompleted');
    Actions.fetchBoard();
    Actions.fetchPlayers();
  },

  onDisconnectPlayerFailure() {
    console.info('onDisconnectPlayerFailure');
  },

  onEnableBoardPoll() {
    console.info('onEnablePoll');
  },

  onEnableBoardPollCompleted(channel) {
    console.info('onEnablePollCompleted');
    let poll = channel.poll();

    poll.on('message', (data) => {
      console.error('poll board message', data);
      Actions.fetchBoard();
    });
  },

  pnEnableBoardPollFailure() {
    console.info('pnEnablePollFailure');
  },

  onEnablePlayersPoll() {
    console.info('onEnablePoll');
  },

  onEnablePlayersPollCompleted(channel) {
    console.info('onEnablePollCompleted');
    let poll = channel.poll();

    poll.on('message', (data) => {
      console.error('poll players message', data);
      Actions.fetchPlayers();
    });
  },

  pnEnablePlayersPollFailure() {
    console.info('pnEnablePollFailure');
  }
});
