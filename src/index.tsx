import ReactDOM from "react-dom";
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { Provider } from "react-redux";
import store from "./store/index";
import "./index.css";
import App from "./App";
import { LP_UNISWAP_URI, NETWORK, SUBGRAPH_URI, ENDPOINT, AVAILABLE_NETWORKS } from "./settings";
import HttpsRedirect from "react-https-redirect";
import { LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT } from "./constants/constants";
import { ChainId, Config, DAppProvider } from "@usedapp/core";
import { getChainById } from "@usedapp/core/dist/esm/src/helpers";
import { BrowserRouter } from "react-router-dom";
import { getDefaultProvider } from "@ethersproject/providers";

const main_subgraph = new HttpLink({
  uri: SUBGRAPH_URI
});

const lp_uniswap_subgraph = new HttpLink({
  uri: LP_UNISWAP_URI
});

const apolloLink = ApolloLink.split(operation => operation.getContext().clientName === LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT, lp_uniswap_subgraph, main_subgraph);

console.log(`Using ${ChainId[NETWORK]} network`);

let config: Config = {
  networks: AVAILABLE_NETWORKS.map(network => getChainById(network)!),
  readOnlyChainId: NETWORK,
  readOnlyUrls: {
    [NETWORK]: window.location.hostname === "localhost" ? getDefaultProvider(NETWORK) : ENDPOINT
  },
  autoConnect: true
}
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: apolloLink
})

ReactDOM.render(
  <DAppProvider config={config}>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <HttpsRedirect>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HttpsRedirect>
      </ApolloProvider>
    </Provider>
  </DAppProvider>,
  document.getElementById("root")
);
