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
      isGameOver: false,
      items: []
    };
  },

  init() {
    this.data = this.getInitialState();
  },

  checkWinner() {
    let items = this.data.items;
    let currentPlayer = this.data.currentPlayer;

    this.data.winCombinations.some((comb) => {
      let testArr = [items[comb[0]].value, items[comb[1]].value, items[comb[2]].value];

      if (currentPlayer && this.isWinner(testArr)) {
        let winner = _.find(this.data.players, ['play_as', testArr[0]]);

        Actions.setWinner(winner.id);
        comb.forEach((index) => {
          this.data.items[index].color = '#F44336';
        });
      }
    });
    this.trigger(this.data);
  },

  isWinner(items) {
    let first = items[0];

    if (items.every((item) => item === null) || this.data.winner) {
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
    this.data.isPlayerTurn = this.data.currentPlayer ? this.data.currentPlayer.is_player_turn : false;
    this.data.turn = this.data.isPlayerTurn ? this.data.currentPlayer.play_as : this.data.opponent.play_as;
    this.trigger(this.data);
  },

  refreshPlayers() {
    if (!this.data.currentPlayer) {
      return;
    }
    this.data.currentPlayer = _.find(this.data.players, ['id', this.data.currentPlayer.id]);
    this.data.opponent = _.find(this.data.players, ['id', this.data.opponent.id]);
    this.data.isPlayerTurn = this.data.currentPlayer ? this.data.currentPlayer.is_player_turn : false;
    this.data.turn = this.data.isPlayerTurn ? this.data.currentPlayer.play_as : this.data.opponent.play_as;
    this.data.isGameOver = this.isGameOver();
    this.data.winner = _.find(this.data.players, ['is_winner', true]);
    this.trigger(this.data);
  },

  isGameOver() {
    let data = this.data;

    return (data.items && !_.some(data.items, ['value', null])) || _.some(data.players, ['is_winner', true]);
  },

  onUpdateField() {
    this.trigger(this.data);
  },

  onUpdateFieldCompleted(resp) {
    console.info('onUpdateFieldCompleted: ', resp);
    Actions.fetchBoard();
    Actions.fetchPlayers();
  },

  onFetchBoardCompleted(dataObjects) {
    console.info('onFetchBoardCompleted: ', dataObjects);
    this.data.items = dataObjects.map((item) => {
      item.color = '#00BCD4';
      return item;
    });
    this.checkWinner();
  },

  onFetchPlayersCompleted(players) {
    console.info('onFetchPlayersCompleted');
    this.data.players = players;
    this.setAvailablePlayers();
  },

  onDisconnectPlayer() {
    console.error('asdasd');
  },

  onDisconnectPlayerCompleted() {
    console.info('onDisconnectPlayerCompleted');
    Actions.fetchBoard();
    Actions.fetchPlayers();
  },

  onEnableBoardPollCompleted(channel) {
    console.info('onEnablePollCompleted');
    let poll = channel.poll();

    poll.on('message', (data) => {
      console.error('poll board message', data);
      Actions.fetchBoard();
    });
  },

  onEnablePlayersPollCompleted(channel) {
    console.info('onEnablePollCompleted');
    let poll = channel.poll();

    poll.on('message', (data) => {
      console.error('poll players message', data);
      Actions.fetchPlayers();
    });
  },

  onSetWinnerCompleted(player) {
    this.data.winner = player;
  },

  onClearWinnerCompleted() {
    this.data.winner = null;
    this.trigger(this.data);
  }
});
