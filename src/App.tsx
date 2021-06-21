import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GET_VAULTS, GET_REWARDS_TOKEN } from "./graphql/subgraph";
import { useQuery } from "@apollo/react-hooks";
import { changeScreenSize, updateSelectedAddress, toggleNotification, updateVaults, updateRewardsToken, updateHatsPrice, updateLiquidityPool } from './actions/index';
import { getNetworkNameByChainId, getTokenPrice, calculateApy } from "./utils";
import { NETWORK, DATA_POLLING_INTERVAL } from "./settings";
import { NotificationType, RoutePaths, ScreenSize, SMALL_SCREEN_BREAKPOINT } from "./constants/constants";
import Welcome from "./components/Welcome";
//import Cookies from "./components/Cookies";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Honeypots from "./components/Honeypots";
import Gov from "./components/Gov";
import VulnerabilityAccordion from "./components/Vulnerability/VulnerabilityAccordion";
import LiquidityPools from "./components/LiquidityPools";
import Notification from "./components/Shared/Notification";
import "./styles/App.scss";
import { RootState } from "./reducers";
import { IVault } from "./types/types";

function App() {
  const dispatch = useDispatch();
  const currentScreenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const showNotification = useSelector((state: RootState) => state.layoutReducer.notification.show);
  const provider = useSelector((state: RootState) => state.web3Reducer.provider) ?? "";
  const [hasSeenWelcomePage, setHasSeenWelcomePage] = useState(localStorage.getItem("hasSeenWelcomePage"));
  //const [acceptedCookies, setAcceptedCookies] = useState(localStorage.getItem("acceptedCookies"));

  React.useEffect(() => {
    const network = getNetworkNameByChainId(provider.chainId);
    if (provider && network !== NETWORK) {
      dispatch(toggleNotification(true, NotificationType.Error, `Please change network to ${NETWORK}`));
    }
  }, [dispatch, provider])

  const screenSize = window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`);
  screenSize.addEventListener("change", screenSize => {
    dispatch(changeScreenSize(screenSize.matches ? ScreenSize.Desktop : ScreenSize.Mobile));
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

  const { loading: loadingRewardsToken, error: errorRewardsToken, data: dataRewardsToken } = useQuery(GET_REWARDS_TOKEN);

  React.useEffect(() => {
    if (!loadingRewardsToken && !errorRewardsToken && dataRewardsToken && dataRewardsToken.masters) {
      dispatch(updateRewardsToken(dataRewardsToken.masters[0].rewardsToken));
    }
  }, [loadingRewardsToken, errorRewardsToken, dataRewardsToken, dispatch]);

  React.useEffect(() => {
    const getHatsPrice = async () => {
      // TODO: Should be HATS token - e.g. rewards token
      dispatch(updateHatsPrice(await getTokenPrice("0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf")));
    }
    getHatsPrice();
  }, [dispatch])

  const { loading, error, data } = useQuery(GET_VAULTS, { pollInterval: DATA_POLLING_INTERVAL });

  React.useEffect(() => {
    if (!loading && !error && data && data.vaults) {
      dispatch(updateVaults(data.vaults));
      // update first Liquidity Pool we find
      const liquidityPool: IVault = data.vaults.find((element: IVault) => element.liquidityPool);
      dispatch(updateLiquidityPool(liquidityPool.id));
    }
  }, [loading, error, data, dispatch]);

  const vaults = useSelector((state: RootState) => state.dataReducer.vaults);
  const hatsPrice = useSelector((state: RootState) => state.dataReducer.hatsPrice);

  React.useEffect(() => {
    const calculateVaultsApy = async () => {
      for (const vault of vaults) {
        vault.apy = await calculateApy(vault, hatsPrice);
        // TODO: Should be staking token - e.g. vault.stakingToken
        vault.tokenPrice = await getTokenPrice("0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf");
      }
      dispatch(updateVaults(vaults));
    }
    if (hatsPrice && vaults) {
      calculateVaultsApy();
    }
  }, [dispatch, hatsPrice, vaults])

  return (
    <>
      {hasSeenWelcomePage !== "1" && <Welcome setHasSeenWelcomePage={setHasSeenWelcomePage} />}
      {/* {acceptedCookies !== "1" && <Cookies setAcceptedCookies={setAcceptedCookies} />} */}
      <Header />
      {currentScreenSize === ScreenSize.Desktop && <Sidebar />}
      <Switch>
        <Route path="/" exact>
          <Redirect to={RoutePaths.vaults} />
        </Route>
        <Route path={RoutePaths.vaults}>
          <Honeypots />
        </Route>
        <Route path={RoutePaths.gov}>
          <Gov />
        </Route>
        <Route path={RoutePaths.vulnerability}>
          <VulnerabilityAccordion />
        </Route>
        <Route path={RoutePaths.pools}>
          <LiquidityPools />
        </Route>
      </Switch>
      {showNotification && <Notification />}
    </>
  );
}

export default App;
