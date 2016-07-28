# Tic-Tac-Toe
Tic Tac Toe game based on ReactJS and Syncano

## Prolog
Online computer games market is really huge and playing alone or with a friend in the same room is kind of a prehistory. Currently, an infinite number of games offer online multiplayer gameplay. Multiplayer mode is not so hard to do, but only if we use proper tools. This TicTacToe app will show you how to do it.

## Technical info
- Visual layer was written in React.
- Players data and current board status is a representation of Data Objects created on Syncano platform. 
- The Flux architecture is kept by Actions and Stores provided by Reflux.  

## Before we begin
To make this application work some steps need to be done: 
- First you need to have Node.js v6.2.2 installed. You can find it [here](https://nodejs.org/en/)
- You will also need application files. They're available in [this](https://github.com/Syncano-Community/tic-tac-toe-example-app) repository or can be downloaded [here](https://github.com/Syncano-Community/tic-tac-toe-example-app/archive/master.zip).
- When you unzip the repository files run your command line and move to destination where you've unzipped application files
- Run `npm install` command - this will install all required packages. 
- Run `npm start` command to start the Webpack server. 

That's all! Tic-Tac-Toe application runs on `localhost:8080` so you can go and play, but remember! This game requires two players :). Of course you can hack this by opening another tab with `localhost:8080` and play with yourself.

If you'd like to see a working live example, go [here](https://syncano-community.github.io/tic-tac-toe-example-app/).

# How does it work?

## Syncano backend
To better understand how the application works you can check out the already set up Syncano backend by installing the Demo App. First, you'll need to have a Syncano account, which can be created [here](https://dashboard.syncano.io/#/signup). If you already have one, just go to Syncano [dashboard](https://dashboard.syncano.io) and login. Go to Demo Apps in header section and install the one named Tic-Tac-Toe. Now you should see a `tic-tac-toe` Instance on the Shared Instances list. It contains all the data to make your application work.

If you would like to use your own Instance, you will have to edit `src/Utils/Config.js` file with your data.

## Connecting new players
Players in the game are represented by Syncano Data Objects. Two players can play simultaneously and each one of them has `is_connected` field. This field is telling application if another player can join the game. If both players have this field set to `true`, application will display proper notification. After a new player joins the game, `connectPlayer` Action will be called. `Actions.connectPlayer()` is updating Data Object `is_connected` field from  `false` to `true`.

`connectPlayer` action:
```js
import Reflux from 'reflux';
import Connection from '../Utils/Connection';
import Config from '../Utils/Config';

  ...

let Actions = Reflux.createActions({
  connectPlayer: {
    children: ['completed', 'failure'],
    asyncResult: true
  },

  ...

});
Actions.connectPlayer.listen((currentPlayerId) => {
  Object.assign(playersParams, {id: currentPlayerId});
  Connection.DataObject.please().update(playersParams, {is_connected: true})
    .then(Actions.connectPlayer.completed)
    .catch(Actions.connectPlayer.failure);
});
```

## Fetching initial data
First of all, let's talk about components. I'm not going through every single component because most of them  - if you know even basics of React - are really simple - take `props` and show them in a proper place. One of them - `Board.jsx` - is a bit more complicated and needs special attention. It joins most of the other components inside and holds some logic around updating Data Objects.
 
First method in Board.jsx file is `ComponentWillMount()`:

```js
componentWillMount() {
  Actions.fetchBoard();
  Actions.enableBoardPoll();
  Actions.enablePlayersPoll();
}
```

As you can see, it calls 3 `Actions` methods: 
- `Actions.fetchBoard()` - handles getting Data Objects properly
- `Actions.enableBoardPoll()` - listens on changes in `Data Objects` holding board data
- `Actions.enablePlayersPoll()` - listens on changes in `Data Objects` holding players info

The data flow looks like this:
- `Actions` get the data from Syncano
- `Stores` are listening to these `Actions`
- When the `Store` sees that an `Action` was completed, it pushes the data into a component
- The component renders after it receives new data



`fetchBoard` action:

```js
import Reflux from 'reflux';
import Connection from '../Utils/Connection';
import Config from '../Utils/Config';

  ...

let Actions = Reflux.createActions({
  fetchBoard: {
    children: ['completed', 'failure'],
    asyncResult: true
  },

  ...

});

let boardParams = {
  instanceName: Config.instanceName,
  className: Config.boardClassName
};

  ...

Actions.fetchBoard.listen(() => {
  Connection.DataObject.please().list(boardParams)
    .then(Actions.fetchBoard.completed)
    .catch(Actions.fetchBoard.failure);
});
```

`enableBoardPoll` action:

```js
Actions.enableBoardPoll.listen(() => {
  Connection.Channel.please().get(channelParams)
    .then(Actions.enableBoardPoll.completed)
    .catch(Actions.enableBoardPoll.failure);
});
```

`enablePlayersPoll` action:

```js
Actions.enablePlayersPoll.listen(() => {
  Object.assign(channelParams, {name: 'tictactoeplayers'});
  Connection.Channel.please().get(channelParams)
    .then(Actions.enablePlayersPoll.completed)
    .catch(Actions.enablePlayersPoll.failure);
});
```
Now when players are connected, and we have data fetched, we can see what is happening after a player clicks on a field on the game board (`handleFieldClick()` method). The clicked field is updated in Syncano via `updateFileld` action and turn is switched via `switchTurn` action. If you look at `Data Objects` in `tictactoeplayers` class in Syncano you will notice that there is a field named `is_player_turn`. `updateFiled` action calls this field and it's updated in both Data Objects to simulate switching turn. As you can see there's a `setState` method inside. It updates clicked field value locally, so that the user doesn't have to wait for API call response. It will be also updated for the opponent after the API call is finished.

```js
handleFieldClick(dataObjectId, index) {
  let state = this.state;
  let value = state.turn;

  if (state.items[index].value === null) {
    state.items[index].value = value;
    this.setState(state, () => {
    });
    Actions.updateField(dataObjectId, value);
    Actions.switchTurn(state.currentPlayer.id, state.opponent.id);
  }
}
```

Now it's time to look on the opponent side. To understand how the opponent will see the response to our click, we have to look into the `Store` and find methods named `onEnableBoardPollCompleted()` and `onEnablePlayersPollCompleted()`. We can see, that when an update on `Data Objects` appears, proper `Action` that fetches the `Data Objects` will be called. This will update the whole board and opponent will see changes on his board.

Actions that enable listening on `Data Objects` changes:

```js
onEnableBoardPollCompleted(channel) {
  let poll = channel.poll();

  poll.on('message', () => {
    Actions.fetchBoard();
  });
},

onEnablePlayersPollCompleted(channel) {
  let poll = channel.poll();

  poll.on('message', () => {
    Actions.fetchPlayers();
  });
}
```

When you look on `renderFields` method, you will see that the field can be disabled in few cases. One of them is checking who's turn it is. Do you remember `switchTurn` action? Great! Its updating players `Data Objects`. Because we have enabled listening on those `Data Objects` changes, both clients will be notified about those change. Thanks to this, only one player will be able to make a move.

## Determining a winner
Every game should have a winner! Fortunately the rules of this game are not complicated so we can define all winning cases (see the `src/Stores/Store.js` file):


```js
winCombinations: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
```

`winCombinations` is an array of arrays. Each array element contains board indexes that make a winning combination. For example a `[0, 3, 6]` combination is:
```js
X  -  -
X  -  -
X  -  -
```
So it's a winner!

Checking winning combinations method:

```js
checkWinner() {
  let items = this.data.items; // Data Objects fetched from 'tictactoe' Syncano class
  let currentPlayer = this.data.currentPlayer; // Data Object representing current player

  this.data.winCombinations.some((comb) => { // iterate over winning combinations
    let testArr = [items[comb[0]].value, items[comb[1]].value, items[comb[2]].value]; // 3 board values with indexes from current winning combination

    if (currentPlayer && this.isWinner(testArr)) {
      let winner = _.find(this.data.players, ['play_as', testArr[0]]);

      Actions.setWinner(winner.id); // mark player as winner in Syncano
      comb.forEach((index) => {
        this.data.items[index].color = '#F44336'; // mark winning fields in other color
      });
    }
  });
  this.data.isGameOver = this.isGameOver(); // helper value representing finished game
  this.trigger(this.data); // trigger data into listening components
},

isWinner(items) {
  let first = items[0];

  if (items.every((item) => item === null) || this.data.winner) {
    return false;
  }

  return items.every((item) => { // check if every item from test array is equal to first - true means that we have a winner
    return item === first;
  });
},
```

## Disconnecting players
Alright. We've finished playing and we want to let others play this game. No problem! The Demo App you have installed at the beginning contains Schedule which triggers a Script every 2 minutes. This Script is checking players activity, and if any player didn't make move for 2 minutes, he will be disconnected.

Script cleaning inactive players:

```js
var Moment = require('moment');
var _ = require('lodash');
var Syncano = require('syncano');
var connection = new Syncano({apiKey: CONFIG.apiKey, instance: CONFIG.instanceName});

connection.class(CONFIG.className).dataobject().list().then(function(resp) {
  var players = resp.objects;

  _.forEach(players, function(player) {
    var lastActivity = player.updated_at;

    if (Moment(Date.now()).diff(lastActivity, 'minutes') > 5) {
      connection.class(CONFIG.className).dataobject(player.id).update({is_connected: false}, function(resp) {
        console.log(player.name + ' disconnected...');
      })
    }
  });
})
```


## Summary
I'm sure you want to ask why only two players can play this game. Don't worry :) it will happen soon. Stay tuned and we will expand this app with new features like rooms, that allow multiple users play the game at the same time.

You can find the whole code on [GitHub](https://github.com/Syncano-Community/tic-tac-toe-example-app/archive/master.zip)
