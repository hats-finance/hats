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
} from "./actions/index";
import {
  getNetworkNameByChainId,
  getTokenPrice,
  calculateApy,
  getWithdrawSafetyPeriod,
  getTokensPrices,
  parseJSONToObject,
} from "./utils";
import { NETWORK, DATA_POLLING_INTERVAL } from "./settings";
import {
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
import CommitteeTools from "./components/CommitteeTools/CommitteTools";
import Notification from "./components/Shared/Notification";
import "./styles/App.scss";
import { RootState } from "./reducers";
import { IVault } from "./types/types";
import NFTAirdropNotification from "./components/NFTAirdropNotification/NFTAirdropNotification";
import { PROTECTED_TOKENS } from "./data/vaults";

// NFT Airdrop - Temporary disabled
// import { isRedeemed } from "./actions/contractsActions";
// import NFTAirdrop from "./components/NFTAirdrop/NFTAirdrop";
// EligibleTokens
// import axios from "axios";
// IPFS_ELIGIBLE_TOKENS, IPFS_PREFIX
// updateAirdropEligibleTokens
// const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";

import "./i18n.ts"; // Initialise i18n

function App() {
  const dispatch = useDispatch();
  const currentScreenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const showMenu = useSelector((state: RootState) => state.layoutReducer.showMenu);
  const showNotification = useSelector((state: RootState) => state.layoutReducer.notification.show);
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const provider = useSelector((state: RootState) => state.web3Reducer.provider) ?? "";
  const [hasSeenWelcomePage, setHasSeenWelcomePage] = useState(localStorage.getItem(LocalStorage.WelcomePage));
  const [acceptedCookies, setAcceptedCookies] = useState(localStorage.getItem(LocalStorage.Cookies));

  const { i18n } = useTranslation();
  useEffect(() => {
    const language = window.localStorage.getItem("i18nextLng");
    if (language && language !== i18n.language) i18n.changeLanguage(language);
  }, [i18n]);

  useEffect(() => {
    const network = getNetworkNameByChainId(provider?.chainId);
    if (provider && provider?.chainId && network !== NETWORK) {
      dispatch(toggleNotification(true, NotificationType.Error, `Please change network to ${NETWORK}`, true));
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
      if (!loadingRewardsToken && !errorRewardsToken && dataRewardsToken && dataRewardsToken.masters) {
        const { rewardsToken, withdrawPeriod, safetyPeriod } = dataRewardsToken.masters[0];
        dispatch(updateRewardsToken(rewardsToken));
        dispatch(updateWithdrawSafetyPeriod(getWithdrawSafetyPeriod(withdrawPeriod, safetyPeriod)));
      }
    };
    getWithdrawSafetyPeriodData();
  }, [loadingRewardsToken, errorRewardsToken, dataRewardsToken, dispatch]);

  useEffect(() => {
    (async () => {
      if (rewardsToken && rewardsToken !== "") {
        dispatch(updateHatsPrice(await getTokenPrice(rewardsToken)));
      }
    })();
  }, [dispatch, rewardsToken]);

  const hatsPrice = useSelector((state: RootState) => state.dataReducer.hatsPrice);

  /**
    * The new ApolloClient InMemoryCache policy makes the retrieved data frozen/sealed,
    * meaning it's not extensible and no new fields can be added to the object.
    * Here we use "no-cache" fetch policy to get the data not frozen.
   */
  const { loading, error, data } = useQuery(GET_VAULTS, {
    pollInterval: DATA_POLLING_INTERVAL,
    fetchPolicy: "no-cache"
  });

  useEffect(() => {
    (async () => {
      if (!loading && !error && data && data.vaults) {

        const calculateTokenPrices = async () => {
          const stakingTokens = (data.vaults as IVault[]).map((vault) => {
            // TODO: Temporay until the protected token will be manifested in the subgraph.
            if (PROTECTED_TOKENS.hasOwnProperty(vault.parentVault.stakingToken)) {
              vault.parentVault.stakingToken = PROTECTED_TOKENS[vault.parentVault.stakingToken];
            }
            return vault.parentVault.stakingToken;
          })

          const tokensPrices = await getTokensPrices(stakingTokens);

          for (const vault of data.vaults as IVault[]) {
            if (tokensPrices.hasOwnProperty(vault.parentVault.stakingToken)) {
              vault.parentVault.tokenPrice = tokensPrices[vault.parentVault.stakingToken].usd;
            }
            vault.description = parseJSONToObject(vault.description as any);
            if (vault.parentDescription) {
              vault.parentDescription = parseJSONToObject(vault.parentDescription as any);
            }
          }
        };

        await calculateTokenPrices();
        dispatch(updateVaults(data.vaults));
      }
    })();
  }, [loading, error, data, dispatch]);

  const vaults: Array<IVault> = useSelector(
    (state: RootState) => state.dataReducer.vaults
  );

  useEffect(() => {
    const calculateVaultsApy = async () => {
      for (const vault of vaults) {
        vault.parentVault.apy = await calculateApy(vault.parentVault, hatsPrice, vault.parentVault.tokenPrice);
      }
      dispatch(updateVaults(vaults));
    };

    if (hatsPrice && vaults) {
      calculateVaultsApy();
    }
  }, [dispatch, hatsPrice, vaults]);

  //* NFT Airdrop - Temporary disabled */
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const data = await axios.get(`${IPFS_PREFIX}${IPFS_ELIGIBLE_TOKENS}`);

  //       for (const key in data.data) {
  //         data.data[key] = normalizeAddress(data.data[key]);
  //       }

  //       dispatch(updateAirdropEligibleTokens(data.data));

  //       if (Object.values(data.data as EligibleTokens).includes(selectedAddress)) {
  //         const savedItems = JSON.parse(localStorage.getItem(LocalStorage.NFTAirdrop) ?? "[]");
  //         const tokenID = Object.keys(data.data).find(key => data.data[key] === selectedAddress);

  //         if (!savedItems.includes(selectedAddress) && !(await isRedeemed(tokenID ?? "", selectedAddress))) {
  //           setShowNFTAirdropNotification(true);
  //         }
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       // TODO: show error
  //     }
  //   })();
  // }, [dispatch, selectedAddress])

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
        <Route path={`${RoutePaths.committee_tools}`}>
          <CommitteeTools />
        </Route>
        {/* NFT Airdrop - Temporary disabled */}
        {/* <Route path={RoutePaths.nft_airdrop}>
          <NFTAirdrop />
        </Route> */}
      </Switch>
      {showNotification && hasSeenWelcomePage && <Notification />}
      {hasSeenWelcomePage === "1" && showNFTAirdropNotification && <NFTAirdropNotification setShowNFTAirdropNotification={setShowNFTAirdropNotification} />}
    </>
  );
}

export default App;
