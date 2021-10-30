import React, { Component, Fragment } from 'react';

const Sidebar = () => {
  return (
    <div id="sidebar">
      <h2>On the Water</h2>
      <h3>Kayak Trip Planning Tool</h3>
      {/* <h3>Some links here...</h3> */}
      <p>Click the button on the top right to change the basemap</p>
      <p>Click the markers to see info about a feature</p>
      <div className="arrow-container"></div>
    </div>
  );
};

export default Sidebar;
