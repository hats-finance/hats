import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GET_VAULTS, GET_REWARDS_TOKEN } from "./graphql/subgraph";
import { useQuery } from "@apollo/react-hooks";
import { changeScreenSize, updateSelectedAddress, toggleNotification, updateVaults, updateRewardsToken } from './actions/index';
import { getNetworkNameByChainId } from "./utils";
import { NETWORK, DATA_POLLING_INTERVAL } from "./settings";
import { NotificationType, ScreenSize, SMALL_SCREEN_BREAKPOINT } from "./constants/constants";
import Welcome from "./components/Welcome";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Honeypots from "./components/Honeypots";
import VulnerabilityAccordion from "./components/Vulnerability/VulnerabilityAccordion";
import Notification from "./components/Shared/Notification";
import "./styles/App.scss";

function App() {
  const dispatch = useDispatch();
  const currentScreenSize = useSelector(state => state.layoutReducer.screenSize);
  const showNotification = useSelector(state => state.layoutReducer.notification.show);
  const provider = useSelector(state => state.web3Reducer.provider) ?? "";
  const [hasSeenWelcomePage, setHasSeenWelcomePage] = useState(localStorage.getItem("hasSeenWelcomePage"));

  React.useEffect(() => {
    const network = getNetworkNameByChainId(provider.chainId);
    if (provider && network !== NETWORK) {
      dispatch(toggleNotification(true, NotificationType.Error, `Please change network to ${NETWORK}`));
    }
  }, [dispatch, provider])

  const screenSize = window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`);
  screenSize.addEventListener("change", screenSize => {
    dispatch(changeScreenSize(screenSize.matches ? ScreenSize.Large : ScreenSize.Small));
  });

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      dispatch(updateSelectedAddress(accounts[0]));
    });
  
    window.ethereum.on("chainChanged", (chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      window.location.reload();
    });
  }

  const { loading, error, data } = useQuery(GET_VAULTS, { pollInterval: DATA_POLLING_INTERVAL });

  React.useEffect(() => {
    if (!loading && !error && data && data.vaults) {
      //console.log({ vaults: data.vaults });
      dispatch(updateVaults(data.vaults));
    }
  }, [loading, error, data, dispatch]);

  const { loading: loadingRewardsToken, error: errorRewardsToken, data: dataRewardsToken } = useQuery(GET_REWARDS_TOKEN);

  React.useEffect(() => {
    if (!loadingRewardsToken && !errorRewardsToken && dataRewardsToken && dataRewardsToken.masters) {
      dispatch(updateRewardsToken(dataRewardsToken.masters[0].rewardsToken));
    }
  }, [loadingRewardsToken, errorRewardsToken, dataRewardsToken, dispatch]);

  return (
    <React.Fragment>
      {hasSeenWelcomePage !== "1" && <Welcome setHasSeenWelcomePage={setHasSeenWelcomePage} />}
      <Header />
      {currentScreenSize === ScreenSize.Large && <Sidebar />}
      <Switch>
        <Route path="/" exact>
          <Redirect to="/honeypots" />
        </Route>
        <Route path="/honeypots">
          <Honeypots />
        </Route>
        <Route path="/gov">
          <div>GOV</div>
        </Route>
        <Route path="/vulnerability">
          <VulnerabilityAccordion />
        </Route>
      </Switch>
      {showNotification && <Notification />}
    </React.Fragment>
  );
}

export default App;

// async function readOnChainData() {
//   // Should replace with the end-user wallet, e.g. Metamask
//   const defaultProvider = getDefaultProvider();
//   // Create an instance of an ethers.js Contract
//   // Read more about ethers.js on https://docs.ethers.io/v5/api/contract/contract/
//   const ceaErc20 = new Contract(addresses.ceaErc20, abis.erc20, defaultProvider);
//   // A pre-defined address that owns some CEAERC20 tokens
//   const tokenBalance = await ceaErc20.balanceOf("0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C");
//   console.log({ tokenBalance: tokenBalance.toString() });
// }

// <button onClick={() => readOnChainData()}>Read On-Chain Balance</button>
