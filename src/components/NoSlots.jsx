import React from 'react';

import Actions from '../Actions/Actions';

export default React.createClass({

  displayName: 'NoSlots',

  getStyles() {
    return {
      textAlign: 'center'
    };
  },

  clearSlots() {
    Actions.disconnectPlayer(16);
    Actions.disconnectPlayer(15);
  },

  render() {
    return (
      <div style={this.getStyles()}>
        Sorry, but there is no slots available. Please try again later.
        <button onClick={this.clearSlots}> ClearSlots </button>
      </div>
    );
  }
});
