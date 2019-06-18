import { storiesOf } from '@storybook/react';
import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { globalStyles } from '../../theme/globalStyles';
import Login from './index';

const store = createStore(() => {});

storiesOf('Voter dashboard', module)
  .addParameters({ viewport: { defaultViewport: 'responsive' } })
  .add(
    'Login page',
    (): JSX.Element => (
      <Provider store={store}>
        <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
          <Login />
        </MedulasThemeProvider>
      </Provider>
    ),
  );