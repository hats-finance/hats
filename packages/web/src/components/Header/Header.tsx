import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { toggleMenu } from "actions/index";
import { WalletButton, WhereverWidget } from "components";
import { Pages } from "constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RootState } from "reducers";
import { getMainPath } from "utils";
import { useAccount } from "wagmi";
import WalletInfo from "../WalletInfo/WalletInfo";
import { StyledHeader } from "./styles";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { showMenu } = useSelector((state: RootState) => state.layoutReducer);
  const { address: account } = useAccount();

  return (
    <StyledHeader>
      <div className="page-title">{Pages[getMainPath(location.pathname)]}</div>

      <div className="buttons">
        {account && (
          <div className="wallet-info">
            <WalletInfo />
          </div>
        )}

        <WhereverWidget />
        <WalletButton />

        <div className="menu-button" onClick={() => dispatch(toggleMenu(!showMenu))}>
          {showMenu ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
        </div>
      </div>
    </StyledHeader>
  );
};

export { Header };
