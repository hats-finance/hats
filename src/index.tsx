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

const root = createRoot(document.getElementById("root")!)
root.render(
  <DAppProvider config={ethersConfig}>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <HttpsRedirect>
          <BrowserRouter>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </BrowserRouter>
        </HttpsRedirect>
      </ApolloProvider>
    </Provider>
  </DAppProvider>,

);

/** Currently not in use - this is to support multiple subgraphs */

// const lp_uniswap_subgraph = new HttpLink({
//   uri: LP_UNISWAP_URI
// });

//const apolloLink = ApolloLink.split(operation => operation.getContext().clientName === LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT, lp_uniswap_subgraph, main_subgraph);