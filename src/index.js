import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store/index';
import "./index.css";
import App from "./App";
import { SUBGRAPH_URI } from "./settings";

// You should replace this url with your own and put it into a .env file
const client = new ApolloClient({
  uri: SUBGRAPH_URI
});

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </Provider>,
  document.getElementById("root"),
);
