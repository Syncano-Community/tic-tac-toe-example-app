import React from 'react';
import Radium from 'radium';

export default Radium(React.createClass({

  displayName: 'Button',

  getStyles() {
    return {
      color: '#F5F5F5',
      backgroundColor: '#689F38',
      width: 100,
      height: 40,
      borderRadius: 4,
      lineHeight: '40px',
      verticalAlign: 'middle',
      textAlign: 'center',
      ':hover': {
        cursor: 'pointer',
        opacity: '0.8'
      }
    };
  },

  render() {
    return (
      <div
        style={this.getStyles()}
        onClick={this.props.handleClick}>
        {this.props.label.toUpperCase()}
      </div>
    );
  }
}));
