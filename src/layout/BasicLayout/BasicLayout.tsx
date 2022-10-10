import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEthers } from '@usedapp/core';
import { changeScreenSize } from 'actions/index';
import { LocalStorage, ScreenSize, SMALL_SCREEN_BREAKPOINT } from 'constants/constants';
import { useCheckRedeemableNfts } from 'components/AirdropMachine/useCheckRedeemableNfts';
// Page Components
import { Header } from 'components';
import Welcome from 'components/Welcome';
import Cookies from 'components/Cookies';
import Sidebar from 'components/Sidebar/Sidebar';
import useModal from 'hooks/useModal';
import Modal from 'components/Shared/Modal/Modal';
import AirdropPrompt from 'components/AirdropMachine/components/AirdropPrompt/AirdropPrompt';
import EmbassyNotificationBar from 'components/EmbassyNotificationBar/EmbassyNotificationBar';
import { AppLayout, AppContent, ContentWrapper, StyledApp } from './styles';

const BasicLayout = (): JSX.Element => {
  const dispatch = useDispatch();
  const [hasSeenWelcomePage, setHasSeenWelcomePage] = useState(localStorage.getItem(LocalStorage.WelcomePage));
  const [acceptedCookies, setAcceptedCookies] = useState(localStorage.getItem(LocalStorage.Cookies));
  const { isShowing: showAirdropPrompt, toggle: toggleAirdropPrompt } = useModal();
  const { account } = useEthers();

  const screenSize = window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`);
  screenSize.addEventListener('change', (screenSize) => {
    dispatch(changeScreenSize(screenSize.matches ? ScreenSize.Desktop : ScreenSize.Mobile));
  });

  useCheckRedeemableNfts(toggleAirdropPrompt);

  const getBannersAndModals = () => (
    <>
      {hasSeenWelcomePage && acceptedCookies !== '1' && <Cookies setAcceptedCookies={setAcceptedCookies} />}
      {hasSeenWelcomePage !== '1' && <Welcome setHasSeenWelcomePage={setHasSeenWelcomePage} />}
      {hasSeenWelcomePage === '1' && <EmbassyNotificationBar />}

      {account && hasSeenWelcomePage === '1' && (
        <Modal isShowing={showAirdropPrompt} hide={toggleAirdropPrompt}>
          <AirdropPrompt closePrompt={toggleAirdropPrompt} />
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
