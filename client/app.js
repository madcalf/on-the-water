import React, { Fragment } from 'react';

import Sidebar from './components/Sidebar';
import Routes from './Routes';
import Main from './components/Main';

const App = () => {
  return (
    <Fragment>
      <Sidebar />
      <Main />
      {/* <Routes /> */}
    </Fragment>
  );
};

export default App;
