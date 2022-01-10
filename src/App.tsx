import { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GET_VAULTS, GET_MASTER_DATA } from "./graphql/subgraph";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import {
  changeScreenSize,
  updateSelectedAddress,
  toggleNotification,
  updateVaults,
  updateRewardsToken,
  updateHatsPrice,
  updateWithdrawSafetyPeriod,
  updateAirdropEligibleTokens,
} from "./actions/index";
import {
  getNetworkNameByChainId,
  getTokenPrice,
  calculateApy,
  getWithdrawSafetyPeriod,
  normalizeAddress,
} from "./utils";
import { NETWORK, DATA_POLLING_INTERVAL } from "./settings";
import {
  IPFS_PREFIX,
  LocalStorage,
  NotificationType,
  RoutePaths,
  ScreenSize,
  SMALL_SCREEN_BREAKPOINT,
} from "./constants/constants";
import Welcome from "./components/Welcome";
import Cookies from "./components/Cookies";
import Header from "./components/Header";
import Sidebar from "./components/Navigation/Sidebar";
import Menu from "./components/Navigation/Menu";
import Honeypots from "./components/Honeypots";
import Gov from "./components/Gov";
import VulnerabilityAccordion from "./components/Vulnerability/VulnerabilityAccordion";
import LiquidityPools from "./components/LiquidityPools/LiquidityPools";
import Notification from "./components/Shared/Notification";
import "./styles/App.scss";
import { RootState } from "./reducers";
import { EligibleTokens, IVault } from "./types/types";
import NFTAirdropNotification from "./components/NFTAirdropNotification/NFTAirdropNotification";
import { getMerkleTree, isRedeemed } from "./actions/contractsActions";
import NFTAirdrop from "./components/NFTAirdrop/NFTAirdrop";
import axios from "axios";

import "./i18n.ts"; // Initialise i18n

function App() {
  const dispatch = useDispatch();
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const currentScreenSize = useSelector(
    (state: RootState) => state.layoutReducer.screenSize
  );
  const showMenu = useSelector(
    (state: RootState) => state.layoutReducer.showMenu
  );
  const showNotification = useSelector(
    (state: RootState) => state.layoutReducer.notification.show
  );
  const rewardsToken = useSelector(
    (state: RootState) => state.dataReducer.rewardsToken
  );
  const provider =
    useSelector((state: RootState) => state.web3Reducer.provider) ?? "";
  const [hasSeenWelcomePage, setHasSeenWelcomePage] = useState(
    localStorage.getItem(LocalStorage.WelcomePage)
  );
  const [acceptedCookies, setAcceptedCookies] = useState(
    localStorage.getItem(LocalStorage.Cookies)
  );

  const { i18n } = useTranslation();
  useEffect(() => {
    const language = window.localStorage.getItem("i18nextLng");
    if (language && language !== i18n.language) i18n.changeLanguage(language);
  }, [i18n]);

  useEffect(() => {
    const network = getNetworkNameByChainId(provider?.chainId);
    if (provider && provider?.chainId && network !== NETWORK) {
      dispatch(
        toggleNotification(
          true,
          NotificationType.Error,
          `Please change network to ${NETWORK}`,
          true
        )
      );
    }
  }, [dispatch, provider]);

  const [showNFTAirdropNotification, setShowNFTAirdropNotification] = useState(false);

  const screenSize = window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`);
  screenSize.addEventListener("change", (screenSize) => {
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

  const {
    loading: loadingRewardsToken,
    error: errorRewardsToken,
    data: dataRewardsToken,
  } = useQuery(GET_MASTER_DATA);

  useEffect(() => {
    const getWithdrawSafetyPeriodData = async () => {
      if (
        !loadingRewardsToken &&
        !errorRewardsToken &&
        dataRewardsToken &&
        dataRewardsToken.masters
      ) {
        const { rewardsToken, withdrawPeriod, safetyPeriod } =
          dataRewardsToken.masters[0];
        dispatch(updateRewardsToken(rewardsToken));
        dispatch(
          updateWithdrawSafetyPeriod(
            getWithdrawSafetyPeriod(withdrawPeriod, safetyPeriod)
          )
        );
      }
    };
    getWithdrawSafetyPeriodData();
  }, [loadingRewardsToken, errorRewardsToken, dataRewardsToken, dispatch]);

  useEffect(() => {
    const getHatsPrice = async () => {
      dispatch(updateHatsPrice(await getTokenPrice(rewardsToken)));
    };
    getHatsPrice();
  }, [dispatch, rewardsToken]);

  const hatsPrice = useSelector(
    (state: RootState) => state.dataReducer.hatsPrice
  );

  const { loading, error, data } = useQuery(GET_VAULTS, {
    pollInterval: DATA_POLLING_INTERVAL,
  });

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
          vault.parentVault.tokenPrice = await getTokenPrice(
            vault.parentVault.stakingToken
          );
          if (hatsPrice) {
            vault.parentVault.apy = await calculateApy(
              vault.parentVault,
              hatsPrice
            );
          }
        }
      };

      calculateTokenPricesAndApy();
      dispatch(updateVaults(extensibleVaults));
    }
  }, [loading, error, data, dispatch, hatsPrice]);

  const vaults: Array<IVault> = useSelector(
    (state: RootState) => state.dataReducer.vaults
  );

  useEffect(() => {
    const calculateVaultsApy = async () => {
      for (const vault of vaults) {
        vault.parentVault.apy = await calculateApy(
          vault.parentVault,
          hatsPrice
        );
      }
      dispatch(updateVaults(vaults));
    };
    if (hatsPrice && vaults) {
      calculateVaultsApy();
    }
  }, [dispatch, hatsPrice, vaults]);

  useEffect(() => {
    const calculatetokenPrices = async () => {
      for (const vault of vaults) {
        vault.parentVault.tokenPrice = await getTokenPrice(
          vault.parentVault.stakingToken
        );
      }
      dispatch(updateVaults(vaults));
    };
    if (vaults) {
      calculatetokenPrices();
    }
  }, [dispatch, vaults]);

  useEffect(() => {
    (async () => {
      try {
        const ipfsEligibleTokens = await getMerkleTree();
        const data = await axios.get(`${IPFS_PREFIX}${ipfsEligibleTokens}`);

        for (const key in data.data) {
          data.data[key] = normalizeAddress(data.data[key]);
        }

        dispatch(updateAirdropEligibleTokens(data.data));

        if (Object.values(data.data as EligibleTokens).includes(selectedAddress)) {
          const savedItems = JSON.parse(localStorage.getItem(LocalStorage.NFTAirdrop) ?? "[]");
          const tokenID = Object.keys(data.data).find(key => data.data[key] === selectedAddress);

          if (!savedItems.includes(selectedAddress) && !(await isRedeemed(tokenID ?? "", selectedAddress))) {
            setShowNFTAirdropNotification(true);
          }
        }
      } catch (error) {
        console.error(error);
        // TODO: show error
      }
    })();
  }, [dispatch, selectedAddress])

  return (
    <>
      {hasSeenWelcomePage !== "1" && (
        <Welcome setHasSeenWelcomePage={setHasSeenWelcomePage} />
      )}
      {hasSeenWelcomePage && acceptedCookies !== "1" && (
        <Cookies setAcceptedCookies={setAcceptedCookies} />
      )}
      <Header />
      {currentScreenSize === ScreenSize.Desktop && <Sidebar />}
      {currentScreenSize === ScreenSize.Mobile && showMenu && <Menu />}
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
        <Route path={RoutePaths.nft_airdrop}>
          <NFTAirdrop />
        </Route>
      </Switch>
      {showNotification && hasSeenWelcomePage && <Notification />}
      {hasSeenWelcomePage === "1" && showNFTAirdropNotification && <NFTAirdropNotification setShowNFTAirdropNotification={setShowNFTAirdropNotification} />}
    </>
  );
}

export default App;
