import { useEffect } from "react";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { useTranslation } from "react-i18next";
import HttpsRedirect from "react-https-redirect";
import { BrowserRouter } from "react-router-dom";
import { WagmiConfig } from "wagmi";
import { client } from "config/apollo";
import { wagmiClient } from "config/wagmi";
import { VaultsProvider } from "hooks/vaults/useVaults";
import { ConfirmDialogProvider } from "hooks/useConfirm";
import { GlobalStyle } from "styles";
import { KeystoreProvider } from "components/Keystore";
import { KeystoreProvider as KeystoreProviderv2 } from "components/Keystore.v2/KeystoreProvider";
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
    <WagmiConfig client={wagmiClient}>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <VaultsProvider>
            <HttpsRedirect>
              <BrowserRouter>
                <GlobalStyle />
                <NotificationProvider>
                  <KeystoreProvider>
                    <KeystoreProviderv2>
                      <ConfirmDialogProvider>
                        <App />
                      </ConfirmDialogProvider>
                    </KeystoreProviderv2>
                  </KeystoreProvider>
                </NotificationProvider>
              </BrowserRouter>
            </HttpsRedirect>
          </VaultsProvider>
        </ApolloProvider>
      </Provider>
    </WagmiConfig>
  );
}

export default Root;
