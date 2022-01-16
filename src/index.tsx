import ReactDOM from "react-dom";
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store/index";
import "./index.css";
import App from "./App";
import { LP_UNISWAP_URI, SUBGRAPH_URI } from "./settings";
import HttpsRedirect from "react-https-redirect";
import { LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT } from "./constants/constants";

const main_subgraph = new HttpLink({
  uri: SUBGRAPH_URI
});

const lp_uniswap_subgraph = new HttpLink({
  uri: LP_UNISWAP_URI
});

const apolloLink = ApolloLink.split(operation => operation.getContext().clientName === LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT, lp_uniswap_subgraph, main_subgraph);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: apolloLink
})

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <HttpsRedirect>
        <Router>
          <App />
        </Router>
      </HttpsRedirect>
    </ApolloProvider>
  </Provider>,
  document.getElementById("root"),
);
