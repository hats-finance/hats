import { createRoot } from "react-dom/client";
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { Provider } from "react-redux";
import store from "./store/index";
import HttpsRedirect from "react-https-redirect";
import { Chain, ChainId, Config, DAppProvider, Mainnet, Rinkeby } from "@usedapp/core";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import NotificationProvider from "components/Notifications/NotificationProvider";
import "./index.css";
import { Endpoint, Chains, Subgraph, UNISWAP_V3_SUBGRAPH } from "./constants/constants";
import { getMainDefinition } from "@apollo/client/utilities";
import { CHAINID } from "settings";

if (process.env.REACT_APP_ENDPOINT_MAINNET) {
  Endpoint[Mainnet.chainId] = process.env.REACT_APP_ENDPOINT_MAINNET;
}
if (process.env.REACT_APP_ENDPOINT_RINKEBY) {
  Endpoint[Rinkeby.chainId] = process.env.REACT_APP_ENDPOINT_RINKEBY;
}

const defaultChain: Chain = Chains[CHAINID];

const subgraphByChain = new ApolloLink(operation => {
  const { chainId } = operation.getContext();
  const link = new HttpLink({ uri: Subgraph[chainId || defaultChain.chainId] });
  return link.request(operation);
});

const linkByDirectives = {
  default: subgraphByChain,
  uniswapv3: new HttpLink({ uri: UNISWAP_V3_SUBGRAPH }),
}

const uriByDirective = new ApolloLink(operation => {
  const { query } = operation;
  const foundDirectives = getMainDefinition(query).directives;
  const directive = foundDirectives?.find(d => Object.keys(linkByDirectives).includes(d.name.value));
  if (directive) {
    return linkByDirectives[directive.name.value].request(operation);
  }
  return linkByDirectives.default.request(operation);

})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: uriByDirective
})

let config: Config = {
  networks: Object.values(Chains),
  readOnlyChainId: defaultChain.chainId,
  readOnlyUrls: Endpoint,
  autoConnect: true
}

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