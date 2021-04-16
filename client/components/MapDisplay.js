import React from 'react';
import { connect } from 'react-redux';

/**
 * COMPONENT
 */
export const MapDisplay = (props) => {
  const { username } = props;

  return (
    <div>
      <h1>MAP HERE??</h1>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(MapDisplay);
