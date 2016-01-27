import React from 'react';

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
      color: '#4CAF50',
      fontSize: 30,
      height: 40,
      width: '100%'
    };
  },

  renderContent() {
    if (this.props.visible) {
      return (
        <div>
          Pending...
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
