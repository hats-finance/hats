import CloseIcon from "assets/icons/close.icon";
import classNames from "classnames";
import Loading from "components/Shared/Loading";
import { Colors } from "constants/constants";
import { isAddress } from "ethers/lib/utils";
import { t } from "i18next";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import { isEthereumProvider } from "../../../../utils";
import "./index.scss";

export default function Airdrop() {
  const [userInput, setUserInput] = useState("");
  const [pendingWalletAction, setPendingWalletAction] = useState(false);
  const nftET = useSelector((state: RootState) => state.dataReducer.airdrop?.nft);
  const tokenET = useSelector((state: RootState) => state.dataReducer.airdrop?.token);


  const handleChange = useCallback(async (input: string) => {
    setUserInput(input);
  }, []);

  
  return (
    <div className={classNames({ "content": true, "airdrop-wrapper": true, "disabled": pendingWalletAction || !nftET || !tokenET })}>
      {isEthereumProvider() ? (
        <div className="search-wrapper">
          <div className={classNames({ "input-container": true, "input-error": userInput !== "" && !isAddress(userInput) })}>
            <input className="address-input" type="text" value={userInput} placeholder={t("Airdrop.search-placeholder")} onChange={(e) => handleChange(e.target.value)} />
            <button className="clear-input" onClick={() => handleChange("")}><CloseIcon width="10" height="10" fill={Colors.gray} /></button>
          </div>

          {userInput !== "" && !isAddress(userInput) && <span className="error-label">{t("Airdrop.search-error")}</span>}
          {(pendingWalletAction || !nftET || !tokenET) && <Loading />}
        </div>

      ) : <span>{t("Shared.no-ethereum")}</span>}
    </div>
  )
}
