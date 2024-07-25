import { changeScreenSize } from "actions/index";
import { AirdropModalAlert, CookiesBanner, Header, Modal, Sidebar } from "components";
import { LocalStorage, SMALL_SCREEN_BREAKPOINT, ScreenSize } from "constants/constants";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { isAirdropEnabled } from "settings";
import { AppContent, AppLayout, ContentWrapper, StyledApp } from "./styles";

const BasicLayout = (): JSX.Element => {
  const dispatch = useDispatch();
  const [acceptedCookies, setAcceptedCookies] = useState(localStorage.getItem(LocalStorage.Cookies));
  const [airdropModalSeen, setAirdropModalSeen] = useState(localStorage.getItem(LocalStorage.AirdropModalSeen));

  const screenSize = window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`);
  screenSize.addEventListener("change", (screenSize) => {
    dispatch(changeScreenSize(screenSize.matches ? ScreenSize.Desktop : ScreenSize.Mobile));
  });

  const getBannersAndModals = () => (
    <>
      {acceptedCookies !== "1" && <CookiesBanner onAcceptedCookies={() => setAcceptedCookies("1")} />}
      {isAirdropEnabled && airdropModalSeen !== "1" && (
        <Modal
          isShowing
          onHide={() => {
            setAirdropModalSeen("1");
            localStorage.setItem(LocalStorage.AirdropModalSeen, "1");
          }}
        >
          <AirdropModalAlert
            onRedirect={() => {
              setAirdropModalSeen("1");
              localStorage.setItem(LocalStorage.AirdropModalSeen, "1");
            }}
          />
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
