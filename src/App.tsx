import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEthers } from "@usedapp/core";
import "./i18n.ts";

import {
  changeScreenSize,
} from "./actions/index";
import {
  LocalStorage,
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
import VaultEditor from "./components/VaultEditor/VaultEditor"
import BountyPayout from "./components/BountyPayout/BountyPayout"
import CommitteeTools from "./components/CommitteeTools/CommitteTools";
import { RootState } from "./reducers";
import AirdropPrompt from "./components/Airdrop/components/AirdropPrompt/AirdropPrompt";
import Airdrop from "./components/Airdrop/components/Airdrop/Airdrop";
import { useFetchAirdropData } from "./components/Airdrop/utils";
import "./styles/App.scss";

function App() {
  const dispatch = useDispatch();
  const currentScreenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const showMenu = useSelector((state: RootState) => state.layoutReducer.showMenu);
  const [hasSeenWelcomePage, setHasSeenWelcomePage] = useState(localStorage.getItem(LocalStorage.WelcomePage));
  const [acceptedCookies, setAcceptedCookies] = useState(localStorage.getItem(LocalStorage.Cookies));
  const { account } = useEthers()

  const { i18n } = useTranslation();
  useEffect(() => {
    const language = window.localStorage.getItem("i18nextLng");
    if (language && language !== i18n.language) i18n.changeLanguage(language);
  }, [i18n]);

  const [showAirdropPrompt, setShowAirdropPrompt] = useState(false);

  const screenSize = window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`);
  screenSize.addEventListener("change", (screenSize) => {
    dispatch(changeScreenSize(screenSize.matches ? ScreenSize.Desktop : ScreenSize.Mobile));
  });

  useFetchAirdropData(() => setShowAirdropPrompt(true));

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
      <Routes>
        <Route path="/" element={<Navigate to={RoutePaths.vaults} replace={true} />} />
        <Route path={RoutePaths.vaults} element={<Honeypots />} />
        <Route path={`${RoutePaths.vaults}/:pid`} element={<Honeypots />} />
        <Route path={`${RoutePaths.vaults}/:pid/deposit`} element={<Honeypots showDeposit={true} />} />
        <Route path={RoutePaths.gov} element={<Gov />} />
        <Route path={RoutePaths.vulnerability} element={<VulnerabilityAccordion />} />
        <Route path={RoutePaths.committee_tools} element={<CommitteeTools />} />
        <Route path={RoutePaths.vault_editor} element={<VaultEditor />} >
          <Route path=":ipfsHash" element={<VaultEditor />} />
        </Route>
        <Route path={RoutePaths.airdrop} element={<Airdrop />} >
          <Route path=":walletAddress" element={<Airdrop />} />
        </Route>
        <Route path={RoutePaths.payout} element={<BountyPayout />} >
          <Route path=":descriptionHash" element={<BountyPayout />} />
        </Route>
      </Routes >
      {
        account && hasSeenWelcomePage === "1" && showAirdropPrompt && (
          <AirdropPrompt closePrompt={() => setShowAirdropPrompt(false)} />)
      }
    </>
  );
}

export default App;
