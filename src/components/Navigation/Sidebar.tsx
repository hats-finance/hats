import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { ScreenSize } from 'constants/constants';
import Logo from '../../assets/icons/logo.icon';
import NavLinks from './NavLinks';
import SocialAndLegal from './SocialAndLegal';
import Menu from './Menu';
import '../../styles/Sidebar.scss';

export default function Sidebar() {
  const showMenu = useSelector((state: RootState) => state.layoutReducer.showMenu);
  const currentScreenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);

  return (
    <>
      {currentScreenSize === ScreenSize.Mobile && showMenu && <Menu />}
      {currentScreenSize === ScreenSize.Desktop && (
        <div className="sidebar-wrapper">
          <Link to="/" className="logo">
            <Logo width="50px" />
          </Link>
          <NavLinks />
          <div className="bottom-wrapper">
            <SocialAndLegal />
          </div>
        </div>
      )}
    </>
  );
}
