import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEthers } from '@usedapp/core';
import { RootState } from 'reducers';
import { changeScreenSize } from 'actions/index';
import { LocalStorage, ScreenSize, SMALL_SCREEN_BREAKPOINT } from 'constants/constants';
import { useCheckRedeemableNfts } from 'components/AirdropMachine/useCheckRedeemableNfts';
// Page Components
import Welcome from 'components/Welcome';
import Cookies from 'components/Cookies';
import Header from 'components/Header';
import Sidebar from 'components/Navigation/Sidebar';
import Menu from 'components/Navigation/Menu';
import useModal from 'hooks/useModal';
import Modal from 'components/Shared/Modal/Modal';
import AirdropPrompt from 'components/AirdropMachine/components/AirdropPrompt/AirdropPrompt';
import EmbassyNotificationBar from 'components/EmbassyNotificationBar/EmbassyNotificationBar';
import 'styles/App.scss';

const BasicLayout = (): JSX.Element => {
  const dispatch = useDispatch();
  const currentScreenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const showMenu = useSelector((state: RootState) => state.layoutReducer.showMenu);
  const [hasSeenWelcomePage, setHasSeenWelcomePage] = useState(localStorage.getItem(LocalStorage.WelcomePage));
  const [acceptedCookies, setAcceptedCookies] = useState(localStorage.getItem(LocalStorage.Cookies));
  const { isShowing: showAirdropPrompt, toggle: toggleAirdropPrompt } = useModal();
  const { account } = useEthers();

  const screenSize = window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`);
  screenSize.addEventListener('change', (screenSize) => {
    dispatch(changeScreenSize(screenSize.matches ? ScreenSize.Desktop : ScreenSize.Mobile));
  });

  useCheckRedeemableNfts(toggleAirdropPrompt);

  return (
    <>
      {hasSeenWelcomePage !== '1' && <Welcome setHasSeenWelcomePage={setHasSeenWelcomePage} />}
      {hasSeenWelcomePage && acceptedCookies !== '1' && <Cookies setAcceptedCookies={setAcceptedCookies} />}
      {hasSeenWelcomePage === '1' && <EmbassyNotificationBar />}
      <Header />
      {currentScreenSize === ScreenSize.Desktop && <Sidebar />}
      {currentScreenSize === ScreenSize.Mobile && showMenu && <Menu />}

      <Outlet />

      {account && hasSeenWelcomePage === '1' && (
        <Modal isShowing={showAirdropPrompt} hide={toggleAirdropPrompt}>
          <AirdropPrompt closePrompt={toggleAirdropPrompt} />
        </Modal>
      )}
    </>
  );
};

export { BasicLayout };
