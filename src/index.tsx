import { createRoot } from "react-dom/client";
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { Provider } from "react-redux";
import store from "./store/index";
import HttpsRedirect from "react-https-redirect";
import { Config, DAppProvider } from "@usedapp/core";
import { BrowserRouter } from "react-router-dom";
import { getDefaultProvider } from "@ethersproject/providers";
import App from "./App";
import { CHAINID, SUBGRAPH_URI, ENDPOINT } from "./settings";
import NotificationProvider from "components/Notifications/NotificationProvider";
import "./index.css";
import { Chains } from "./constants/constants";

const main_subgraph = new HttpLink({
  uri: SUBGRAPH_URI
});

let config: Config = {
  networks: [Chains[CHAINID]],
  readOnlyChainId: CHAINID,
  readOnlyUrls: {
    [CHAINID]: ENDPOINT || getDefaultProvider(CHAINID)
  },
  autoConnect: true
}
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: main_subgraph
})

const root = createRoot(document.getElementById("root")!)
root.render(
  <DAppProvider config={config}>
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