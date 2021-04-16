import React, { Fragment } from 'react';

import Sidebar from './components/Sidebar';
import Routes from './routes';

const App = () => {
  return (
    <Fragment>
      <Sidebar />
      <Routes />
    </Fragment>
  );
};

export default App;
