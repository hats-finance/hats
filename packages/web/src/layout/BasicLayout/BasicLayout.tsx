import { changeScreenSize } from "actions/index";
import { CookiesBanner, Header } from "components";
import Sidebar from "components/Sidebar/Sidebar";
import { LocalStorage, SMALL_SCREEN_BREAKPOINT, ScreenSize } from "constants/constants";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { AppContent, AppLayout, ContentWrapper, StyledApp } from "./styles";

const BasicLayout = (): JSX.Element => {
  const dispatch = useDispatch();
  const [acceptedCookies, setAcceptedCookies] = useState(localStorage.getItem(LocalStorage.Cookies));
  // const [hasSeenEmbassyNotification, setHasSeenEmbassyNotification] = useState(
  //   localStorage.getItem(LocalStorage.EmbassyNotification)
  // );

  const screenSize = window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`);
  screenSize.addEventListener("change", (screenSize) => {
    dispatch(changeScreenSize(screenSize.matches ? ScreenSize.Desktop : ScreenSize.Mobile));
  });

  const getBannersAndModals = () => (
    <>
      {acceptedCookies !== "1" && <CookiesBanner onAcceptedCookies={() => setAcceptedCookies("1")} />}
      {/* {hasSeenEmbassyNotification !== "1" && (
        <EmbassyNotificationBar setHasSeenEmbassyNotification={() => setHasSeenEmbassyNotification("1")} />
      )} */}
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
