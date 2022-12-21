import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { useLocation } from "react-router-dom";
import { WalletButton } from "components";
import { toggleMenu } from "actions/index";
import { getMainPath } from "utils";
import { RootState } from "reducers";
import { Pages } from "constants/constants";
import MenuIcon from "assets/icons/hamburger.icon";
import CloseIcon from "assets/icons/close.icon";
import WalletInfo from "../WalletInfo/WalletInfo";
import { StyledHeader } from "./styles";
import { WhereverWidget } from "components/WhereverWidget/WhereverWidget";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { showMenu } = useSelector((state: RootState) => state.layoutReducer);
  const { address: account } = useAccount();

  return (
    <StyledHeader data-testid="Header">
      <div className="page-title">{Pages[getMainPath(location.pathname)]}</div>
      {account && <WalletInfo />}

      <WhereverWidget />

      <WalletButton />

      <div className="menu-button" onClick={() => dispatch(toggleMenu(!showMenu))}>
        {showMenu ? <CloseIcon /> : <MenuIcon />}
      </div>
    </StyledHeader>
  );
};

export { Header };
