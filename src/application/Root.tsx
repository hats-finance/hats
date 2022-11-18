import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { DAppProvider } from "@usedapp/core";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import HttpsRedirect from "react-https-redirect";
import { BrowserRouter } from "react-router-dom";
import { ethersConfig } from "config/ethers";
import { client } from "config/apollo";
import { VaultsProvider } from "hooks/vaults/useVaults";
import { GlobalStyle } from "styles";
import { KeystoreProvider } from "components/Keystore";
import { NotificationProvider } from "components/Notifications/NotificationProvider";
import App from "./App";
import store from "../store";
import "i18n.ts";

function Root() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const language = window.localStorage.getItem("i18nextLng");
    if (language && language !== i18n.language) i18n.changeLanguage(language);
  }, [i18n]);

  return (
    <DAppProvider config={ethersConfig}>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <VaultsProvider>
            <HttpsRedirect>
              <BrowserRouter>
                <GlobalStyle />
                <NotificationProvider>
                  <KeystoreProvider>
                    <App />
                  </KeystoreProvider>
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
