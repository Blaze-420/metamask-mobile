import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import PropTypes from 'prop-types';
import App from '../../Nav/App';
import ErrorBoundary from '../ErrorBoundary';
import { useAppTheme, ThemeContext } from '../../../util/theme';
import { ToastContextWrapper } from '../../../component-library/components/Toast';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AssetPollingProvider } from '../../hooks/AssetPolling/AssetPollingProvider';

const Root = () => {
  const theme = useAppTheme();

  return (
    // <SafeAreaProvider>
      <ThemeContext.Provider value={theme}>
        <ToastContextWrapper>
          <AssetPollingProvider>
            <ErrorBoundary view="Root">
              <App />
            </ErrorBoundary>
          </AssetPollingProvider>
        </ToastContextWrapper>
      </ThemeContext.Provider>
    // </SafeAreaProvider>
  );
};

export const ConnectedRoot = ({ store, persistor }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Root />
      </PersistGate>
    </Provider>
  );
};

ConnectedRoot.propTypes = {
  store: PropTypes.object.isRequired,
  persistor: PropTypes.object.isRequired,
};
