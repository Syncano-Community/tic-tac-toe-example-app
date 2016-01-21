import React from 'react';
import Reflux from 'reflux';
import ReactDOM from 'react-dom';

import Store from './Stores/Store';
import Actions from './Actions/Actions';

import {Container, Board, NoSlots} from './components';

import './style/style.css';

let App = React.createClass({

  displayName: 'App',

  mixins: [Reflux.connect(Store)],

  componentWillMount() {
    Actions.fetchPlayers();
  },


  render() {
    return (
      <Container>
        {this.state.availablePlayers.length === 0 ? <NoSlots /> : <Board />}
      </Container>
    );
  }
});


ReactDOM.render(<App />, document.getElementById('app'));
