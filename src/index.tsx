import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import store from "./store/index";
import HttpsRedirect from "react-https-redirect";
import { DAppProvider } from "@usedapp/core";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import NotificationProvider from "components/Notifications/NotificationProvider";
import "./index.css";
import { ethersConfig } from "config/ethers";
import { client } from "config/apollo";
import { VaultsProvider } from "hooks/useVaults";

const root = createRoot(document.getElementById("root")!)
root.render(
  <DAppProvider config={ethersConfig}>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <VaultsProvider>
          <HttpsRedirect>
            <BrowserRouter>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </BrowserRouter>
          </HttpsRedirect>
        </VaultsProvider>
      </ApolloProvider>
    </Provider>
  </DAppProvider>,

);