import React, { Fragment } from 'react';

import Sidebar from './components/Sidebar';
import Main from './components/Main';

const App = () => {
  return (
    <Fragment>
      <Sidebar />
      <Main />
    </Fragment>
  );
};

export default App;
