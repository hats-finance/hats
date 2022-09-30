import { useSelector } from "react-redux";
import { Colors, ScreenSize } from "../../constants/constants";
import { RootState } from "../../reducers";
import Dot from "../Shared/Dot/Dot";
import "./WalletButton.scss";
import { shortenIfAddress, useEthers } from "@usedapp/core";
import { useWeb3Modal } from "hooks/useWeb3Modal";
import { useTranslation } from "react-i18next";

export default function WalletButton() {
  const { t } = useTranslation();
  const { screenSize } = useSelector((state: RootState) => state.layoutReducer);
  const { account } = useEthers()
  const { activateProvider, deactivateProvider } = useWeb3Modal()

  return (
    <>
      <button
        className={account ? "wallet-btn connected" : "wallet-btn disconnected"}
        onClick={account ? deactivateProvider : activateProvider}>
        <div>
          <Dot color={account ? Colors.turquoise : Colors.red} />
          {account ? screenSize === ScreenSize.Desktop ? t("Header.WalletButton.disconnect") : `${shortenIfAddress(account)}` : t("Header.WalletButton.connect")}
        </div>
      </button>
    </>
  );
}
