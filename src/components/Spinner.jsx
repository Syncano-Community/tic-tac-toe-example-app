import React from 'react';

export default React.createClass({

  displayName: 'Spinner',

  render() {
    return (
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    );
  }
});
