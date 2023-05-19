import { changeScreenSize } from "actions/index";
// Page Components
import { Header } from "components";
import { Modal } from "components";
import Cookies from "components/Cookies/Cookies";
import EmbassyNotificationBar from "components/EmbassyNotificationBar/EmbassyNotificationBar";
import Sidebar from "components/Sidebar/Sidebar";
import Welcome from "components/Welcome/Welcome";
import { LocalStorage, SMALL_SCREEN_BREAKPOINT, ScreenSize } from "constants/constants";
import useModal from "hooks/useModal";
import AirdropPrompt from "pages/AirdropMachinePage/AirdropPrompt/AirdropPrompt";
import { useCheckRedeemableNfts } from "pages/AirdropMachinePage/useCheckRedeemableNfts";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { useAccount } from "wagmi";
import { AppContent, AppLayout, ContentWrapper, StyledApp } from "./styles";

const BasicLayout = (): JSX.Element => {
  const dispatch = useDispatch();
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
