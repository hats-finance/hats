import { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GET_VAULTS, GET_MASTER_DATA } from "./graphql/subgraph";
import { useQuery } from "@apollo/client";
import { changeScreenSize, updateSelectedAddress, toggleNotification, updateVaults, updateRewardsToken, updateHatsPrice, updateWithdrawSafetyPeriod } from './actions/index';
import { getNetworkNameByChainId, getTokenPrice, calculateApy, getWithdrawSafetyPeriod } from "./utils";
import { NETWORK, DATA_POLLING_INTERVAL } from "./settings";
import { NotificationType, RoutePaths, ScreenSize, SMALL_SCREEN_BREAKPOINT } from "./constants/constants";
import Welcome from "./components/Welcome";
import Cookies from "./components/Cookies";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Honeypots from "./components/Honeypots";
import Gov from "./components/Gov";
import VulnerabilityAccordion from "./components/Vulnerability/VulnerabilityAccordion";
import LiquidityPools from "./components/LiquidityPools";
import TermsOfService from "./components/TermsOfService";
import Notification from "./components/Shared/Notification";
import "./styles/App.scss";
import { RootState } from "./reducers";
import { IVault } from "./types/types";

function App() {
  const dispatch = useDispatch();
  const currentScreenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const showNotification = useSelector((state: RootState) => state.layoutReducer.notification.show);
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const provider = useSelector((state: RootState) => state.web3Reducer.provider) ?? "";
  const [hasSeenWelcomePage, setHasSeenWelcomePage] = useState(localStorage.getItem("hasSeenWelcomePage"));
  const [acceptedCookies, setAcceptedCookies] = useState(localStorage.getItem("acceptedCookies"));

  useEffect(() => {
    const network = getNetworkNameByChainId(provider?.chainId);
    if (provider && provider?.chainId && network !== NETWORK) {
      dispatch(toggleNotification(true, NotificationType.Error, `Please change network to ${NETWORK}`, true));
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

  const { loading: loadingRewardsToken, error: errorRewardsToken, data: dataRewardsToken } = useQuery(GET_MASTER_DATA);

  useEffect(() => {
    const getWithdrawSafetyPeriodData = async () => {
      if (!loadingRewardsToken && !errorRewardsToken && dataRewardsToken && dataRewardsToken.masters) {
        const { rewardsToken, withdrawPeriod, safetyPeriod } = dataRewardsToken.masters[0];
        dispatch(updateRewardsToken(rewardsToken));
        dispatch(updateWithdrawSafetyPeriod(getWithdrawSafetyPeriod(withdrawPeriod, safetyPeriod)));
      }
    }
    getWithdrawSafetyPeriodData();
  }, [loadingRewardsToken, errorRewardsToken, dataRewardsToken, dispatch]);

  useEffect(() => {
    const getHatsPrice = async () => {
      dispatch(updateHatsPrice(await getTokenPrice(rewardsToken)));
    }
    getHatsPrice();
  }, [dispatch, rewardsToken])

  const { loading, error, data } = useQuery(GET_VAULTS, { pollInterval: DATA_POLLING_INTERVAL });
  const hatsPrice = useSelector((state: RootState) => state.dataReducer.hatsPrice);

  useEffect(() => {
    if (!loading && !error && data && data.vaults) {
      let extensibleVaults: IVault[] = [];

      /**
       * The new ApolloClient InMemoryCache policy makes the retrieved data frozen/sealed,
       * meaning it's not extensible and no new fields can be added to the object.
       * Here we're deep-cloning the retrieved data so it'll be extensible.
       */
      for (const vault of data.vaults) {
        extensibleVaults.push(JSON.parse(JSON.stringify(vault)));
      }

      const calculateTokenPricesAndApy = async () => {
        for (const vault of extensibleVaults) {
          vault.parentVault.tokenPrice = await getTokenPrice(vault.parentVault.stakingToken);
          if (hatsPrice) {
            vault.parentVault.apy = await calculateApy(vault.parentVault, hatsPrice);
          }
        }
      }

      calculateTokenPricesAndApy();
      dispatch(updateVaults(extensibleVaults));
    }
  }, [loading, error, data, dispatch, hatsPrice]);

  return (
    <>
      {hasSeenWelcomePage !== "1" && <Welcome setHasSeenWelcomePage={setHasSeenWelcomePage} />}
      {hasSeenWelcomePage && acceptedCookies !== "1" && <Cookies setAcceptedCookies={setAcceptedCookies} />}
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
        <Route path={RoutePaths.terms_of_use}>
          <TermsOfService />
        </Route>
      </Switch>
      {showNotification && hasSeenWelcomePage && <Notification />}
    </>
  );
}

export default App;
