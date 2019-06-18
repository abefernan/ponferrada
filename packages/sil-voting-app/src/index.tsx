import MedulasThemeProvider from 'medulas-react-components/lib/theme/MedulasThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Routes from './routes';
import { globalStyles } from './theme/globalStyles';

const store = createStore(() => {});
const rootEl = document.getElementById('root');

const render = (Component: React.ComponentType): void => {
  ReactDOM.render(
    <Provider store={store}>
      <MedulasThemeProvider injectFonts injectStyles={globalStyles}>
        <Component />
      </MedulasThemeProvider>
    </Provider>,
    rootEl,
  );
};

render(Routes);

if (module.hot) {
  module.hot.accept(
    './routes',
    (): void => {
      const NextApp = require('./routes').default;
      render(NextApp);
    },
  );
}