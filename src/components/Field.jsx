import React from 'react';
import Radium from 'radium';

export default Radium(React.createClass({

  displayName: 'Field',

  getInitialState() {
    return {
      value: null
    };
  },

  getDefaultProps() {
    return {
      backgroundColor: '#00BCD4'
    };
  },


  getStyles() {
    return {
      field: {
        width: 100,
        height: 100,
        fontSize: 50,
        lineHeight: '100px',
        textAlign: 'center',
        verticalAlign: 'middle',
        backgroundColor: this.props.backgroundColor,
        borderRadius: '5px',
        margin: 2,
        cursor: 'pointer',
        color: '#E4E4E4',
        ':hover': {
          opacity: '0.8'
        }
      },
      fieldDisabled: {
        cursor: 'not-allowed'
      }
    };
  },

  handleClick() {
    if (typeof this.props.handleClick === 'function' && !this.props.disabled) {
      this.props.handleClick();
    }
  },

  render() {
    let styles = this.getStyles();

    return (
      <div
        onClick={this.handleClick}
        style={[styles.field, this.props.disabled && styles.fieldDisabled]}>
        {this.props.value}
      </div>
    );
  }
}));
