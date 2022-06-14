import { createRoot } from "react-dom/client";
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { Provider } from "react-redux";
import store from "./store/index";
import HttpsRedirect from "react-https-redirect";
import { ChainId, Config, DAppProvider, useEthers } from "@usedapp/core";
import { BrowserRouter } from "react-router-dom";
import { getDefaultProvider } from "@ethersproject/providers";
import App from "./App";
import { CHAINID, SUBGRAPH_URI, ENDPOINT } from "./settings";
import NotificationProvider from "components/Notifications/NotificationProvider";
import "./index.css";
import { Chains, Subgraph, UNISWAP_V3_SUBGRAPH } from "./constants/constants";
import { getMainDefinition } from "@apollo/client/utilities";

const defaultChain = ChainId.Mainnet;

const subgraphByChain = new ApolloLink(operation => {
  const { chainId } = operation.getContext();
  console.log("chainId", chainId);


  const link = new HttpLink({ uri: Subgraph[chainId || defaultChain] });
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
  //readOnlyChainId: CHAINID,
  readOnlyUrls: {
    [CHAINID]: ENDPOINT || getDefaultProvider(CHAINID)
  },
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