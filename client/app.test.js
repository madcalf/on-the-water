// This is just a test...
import React from 'react';
import {
  render,
  screen,
  waitFor,
  waitForElement,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store';
import App from './app';

describe('App Test', () => {
  it('renders App component', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    // screen.debug();
  });

  // it('renders valid Current markers', async () => {
  //   await waitFor(() => {
  //     expect(findByTestId('station-SFB1201')).toBeInTheDocument();
  //   });
  // });
});
