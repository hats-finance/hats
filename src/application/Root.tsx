import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { DAppProvider } from '@usedapp/core';
import HttpsRedirect from 'react-https-redirect';
import { BrowserRouter } from 'react-router-dom';
import { ethersConfig } from 'config/ethers';
import { client } from 'config/apollo';
import { VaultsProvider } from 'hooks/useVaults';
import { GlobalStyle } from 'styles';
import NotificationProvider from 'components/Notifications/NotificationProvider';
import App from './App';
import store from '../store';

function Root() {
  return (
    <DAppProvider config={ethersConfig}>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <VaultsProvider>
            <HttpsRedirect>
              <BrowserRouter>
                <GlobalStyle />
                <NotificationProvider>
                  <App />
                </NotificationProvider>
              </BrowserRouter>
            </HttpsRedirect>
          </VaultsProvider>
        </ApolloProvider>
      </Provider>
    </DAppProvider>
  );
}

export default Root;
