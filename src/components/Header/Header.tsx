import { useDispatch, useSelector } from "react-redux";
import { useEthers } from "@usedapp/core";
import { useLocation } from "react-router-dom";
import { toggleMenu } from "../../actions/index";
import { getMainPath } from "../../utils";
import { RootState } from "../../reducers";
import { Pages } from "../../constants/constants";
import MenuIcon from "../../assets/icons/hamburger.icon";
import CloseIcon from "../../assets/icons/close.icon";
import WalletInfo from "../WalletInfo/WalletInfo";
import { StyledHeader } from "./styles";
import { WalletButton } from "components/WalletButton/WalletButton";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { showMenu } = useSelector((state: RootState) => state.layoutReducer);
  const { account } = useEthers();

  return (
    <StyledHeader data-testid="Header">
      <div className="page-title">{Pages[getMainPath(location.pathname)]}</div>
      {account && <WalletInfo />}

      <WalletButton />

      <div className="menu-button" onClick={() => dispatch(toggleMenu(!showMenu))}>
        {showMenu ? <CloseIcon /> : <MenuIcon />}
      </div>
    </StyledHeader>
  );
};

export { Header };
