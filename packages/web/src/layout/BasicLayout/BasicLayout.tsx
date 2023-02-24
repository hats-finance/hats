import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAccount } from "wagmi";
import { useDispatch } from "react-redux";
import { changeScreenSize } from "actions/index";
import { LocalStorage, ScreenSize, SMALL_SCREEN_BREAKPOINT } from "constants/constants";
import { useCheckRedeemableNfts } from "pages/AirdropMachinePage/useCheckRedeemableNfts";
// Page Components
import { Header } from "components";
import Welcome from "components/Welcome/Welcome";
import Cookies from "components/Cookies/Cookies";
import Sidebar from "components/Sidebar/Sidebar";
import useModal from "hooks/useModal";
import { Modal } from "components";
import AirdropPrompt from "pages/AirdropMachinePage/AirdropPrompt/AirdropPrompt";
import EmbassyNotificationBar from "components/EmbassyNotificationBar/EmbassyNotificationBar";
import { AppLayout, AppContent, ContentWrapper, StyledApp } from "./styles";

const BasicLayout = (): JSX.Element => {
  const dispatch = useDispatch();
  // const [hasSeenWelcomePage, setHasSeenWelcomePage] = useState(localStorage.getItem(LocalStorage.WelcomePage));
  const [hasSeenWelcomePage, setHasSeenWelcomePage] = useState("1");
  const [acceptedCookies, setAcceptedCookies] = useState(localStorage.getItem(LocalStorage.Cookies));
  const [hasSeenEmbassyNotification, setHasSeenEmbassyNotification] = useState(
    localStorage.getItem(LocalStorage.EmbassyNotification)
  );
  const { isShowing, show, hide } = useModal();
  const { address: account } = useAccount();

  const screenSize = window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`);
  screenSize.addEventListener("change", (screenSize) => {
    dispatch(changeScreenSize(screenSize.matches ? ScreenSize.Desktop : ScreenSize.Mobile));
  });

  useCheckRedeemableNfts(show);

  const getBannersAndModals = () => (
    <>
      {hasSeenWelcomePage && acceptedCookies !== "1" && <Cookies setAcceptedCookies={setAcceptedCookies} />}
      {hasSeenWelcomePage !== "1" && <Welcome setHasSeenWelcomePage={setHasSeenWelcomePage} />}
      {hasSeenEmbassyNotification !== "1" && (
        <EmbassyNotificationBar setHasSeenEmbassyNotification={() => setHasSeenEmbassyNotification("1")} />
      )}

      {account && hasSeenWelcomePage === "1" && (
        <Modal isShowing={isShowing} onHide={hide}>
          <AirdropPrompt closePrompt={hide} />
        </Modal>
      )}
    </>
  );

  return (
    <StyledApp>
      {getBannersAndModals()}

      <AppLayout>
        <Sidebar />
        <ContentWrapper>
          <Header />
          <AppContent>
            <Outlet />
          </AppContent>
        </ContentWrapper>
      </AppLayout>
    </StyledApp>
  );
};

export { BasicLayout };
