import React from 'react';

import Spinner from './Spinner';

export default React.createClass({

  displayName: 'Loading',

  getDefaultProps() {
    return {
      visible: false
    };
  },

  getStyles() {
    return {
      textAlign: 'center',
      color: '#607D8B',
      fontSize: 20,
      height: 40,
      width: '100%'
    };
  },

  renderContent() {
    if (this.props.visible) {
      return (
        <div>
          Pending...
          <Spinner />
        </div>
      );
    }
    return null;
  },

  render() {
    return (
      <div style={this.getStyles()}>
        {this.renderContent()}
      </div>
    );
  }
});
