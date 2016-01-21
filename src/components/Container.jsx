import React from 'react';

export default React.createClass({

  displayName: 'Container',

  getStyles() {
    return {
      container: {
        margin: '50px auto',
        width: '50%',
        padding: 30,
        border: '1px solid #BDBDBD',
        borderRadius: '5px'
      }
    };
  },

  render() {
    let styles = this.getStyles();

    return (
      <div style={styles.container}>
        {this.props.children}
      </div>
    );
  }
});
