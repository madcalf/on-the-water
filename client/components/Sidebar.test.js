// This is just a test...
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store';
import Sidebar from './Sidebar';

describe('Sidebar Test', () => {
  it('renders Sidebar component', () => {
    render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    );
    // expect(screen.getAllByRole('heading')[0]).toBeInTheDocument();
    // screen.debug();
  });
});
