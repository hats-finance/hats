import ReactDOM from "react-dom";
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store/index";
import "./index.css";
import App from "./App";
import MobileNotification from "./components/MobileNotification";
import { LIQUIDITY_POOLS_URI, SUBGRAPH_URI } from "./settings";
import { isMobile } from "./utils";
import HttpsRedirect from "react-https-redirect";
import { LIQUIDITY_POOL_APOLLO_CONTEXT } from "./constants/constants";

const hats_subgraph = new HttpLink({
  uri: SUBGRAPH_URI
});

const liquidity_pools = new HttpLink({
  uri: LIQUIDITY_POOLS_URI
});

const apolloLink = ApolloLink.split(operation => operation.getContext().clientName === LIQUIDITY_POOL_APOLLO_CONTEXT, liquidity_pools, hats_subgraph );

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: apolloLink
})

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <HttpsRedirect>
        <Router>
          {isMobile() ? <MobileNotification /> : <App />}
        </Router>
      </HttpsRedirect>
    </ApolloProvider>
  </Provider>,
  document.getElementById("root"),
);
