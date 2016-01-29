import Reflux from 'reflux';
import Connection from '../Utils/Connection';
import Config from '../Utils/Config';
import D from 'd.js';

let Actions = Reflux.createActions({
  enableBoardPoll: {
    children: ['completed', 'failure'],
    asyncResult: true
  },
  enablePlayersPoll: {
    children: ['completed', 'failure'],
    asyncResult: true
  },
  fetchBoard: {
    children: ['completed', 'failure'],
    asyncResult: true
  },
  updateField: {
    children: ['completed', 'failure'],
    asyncResult: true
  },
  clearBoard: {
    children: ['completed', 'failure'],
    asyncResult: true
  },
  connectPlayer: {
    children: ['completed', 'failure'],
    asyncResult: true
  },
  disconnectPlayer: {
    children: ['completed', 'failure'],
    asyncResult: true
  },
  fetchPlayers: {
    children: ['completed', 'failure'],
    asyncResult: true
  },
  switchTurn: {
    children: ['completed', 'failure'],
    asyncResult: true
  },
  setWinner: {
    children: ['completed', 'failure'],
    asyncResult: true
  },
  clearWinner: {
    children: ['completed', 'failure'],
    asyncResult: true
  }
});

let boardParams = {
  instanceName: Config.instanceName,
  className: Config.boardClassName
};

let playersParams = {
  instanceName: Config.instanceName,
  className: Config.playersClassName
};

let channelParams = {
  instanceName: Config.instanceName,
  name: 'tictactoe'
};

/* eslint-disable */
Actions.enableBoardPoll.listen(() => {
  Connection.Channel.please().get(channelParams)
    .then(Actions.enableBoardPoll.completed)
    .catch(Actions.enableBoardPoll.failure);
});

Actions.enablePlayersPoll.listen(() => {
  Object.assign(channelParams, {name: 'tictactoeplayers'});
  Connection.Channel.please().get(channelParams)
    .then(Actions.enablePlayersPoll.completed)
    .catch(Actions.enablePlayersPoll.failure);
});

Actions.updateField.listen((objectId, value) => {
  Object.assign(boardParams, {id: objectId});
  Connection.DataObject.please().update(boardParams, {value})
    .then(Actions.updateField.completed)
    .catch(Actions.updateField.failure);
});

Actions.fetchBoard.listen(() => {
  Connection.DataObject.please().list(boardParams)
    .then(Actions.fetchBoard.completed)
    .catch(Actions.fetchBoard.failure);
});

Actions.clearBoard.listen((objectIds) => {
  let promises = objectIds.map((objectId) => {
    Object.assign(boardParams, {id: objectId});
    return Connection.DataObject.please().update(boardParams, {value: null});
  });

  D.all(promises)
    .success(Actions.clearBoard.completed)
    .error(Actions.clearBoard.failure);
});

Actions.fetchPlayers.listen(() => {
  Connection.DataObject.please().list(playersParams)
    .then(Actions.fetchPlayers.completed)
    .catch(Actions.fetchPlayers.failure);
});

Actions.connectPlayer.listen((currentPlayerId) => {
  Object.assign(playersParams, {id: currentPlayerId});
  Connection.DataObject.please().update(playersParams, {is_connected: true})
    .then(Actions.connectPlayer.completed)
    .catch(Actions.connectPlayer.failure);
});

Actions.disconnectPlayer.listen((currentPlayerId) => {
  Object.assign(playersParams, {id: currentPlayerId});
  Connection.DataObject.please().update(playersParams, {is_connected: false, is_winner: false})
    .then(Actions.disconnectPlayer.completed)
    .catch(Actions.disconnectPlayer.failure);
});

Actions.switchTurn.listen((currentPlayerId, nextPlayerId) => {
  let currentPlayerData = Object.assign({}, playersParams, {id: currentPlayerId});
  let nextPlayerData = Object.assign({}, playersParams, {id: nextPlayerId});
  let promises = [];

  promises.push(Connection.DataObject.please().update(currentPlayerData, {is_player_turn: false}));
  promises.push(Connection.DataObject.please().update(nextPlayerData, {is_player_turn: true}));

  D.all(promises)
    .success(Actions.switchTurn.completed)
    .error(Actions.switchTurn.failure);
});

Actions.setWinner.listen((playerId) => {
  Object.assign(playersParams, {id: playerId});
  Connection.DataObject.please().update(playersParams, {is_winner: true})
    .then(Actions.setWinner.completed)
    .catch(Actions.setWinner.failure);
});

Actions.clearWinner.listen((playersIds) => {
  let promises = playersIds.map((playerId) => {
    Object.assign(playersParams, {id: playerId});
    return Connection.DataObject.please().update(playersParams, {is_winner: false});
  });

  D.all(promises)
    .success(Actions.clearWinner.completed)
    .error(Actions.clearWinner.failure);
});

export default Actions;
