import { useEthers } from "@usedapp/core";
import Modal from "components/Shared/Modal/Modal";
import useModal from "hooks/useModal";
import { createContext, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Redeem from "../Redeem/Redeem";
import "./index.scss";
import RedeemNftSuccess from "components/RedeemNftSuccess/RedeemNftSuccess";
import { INFTTokenData, useNFTTokenData } from "hooks/useNFTTokenData";
import { isAddress } from "ethers/lib/utils";
import classNames from "classnames";
import { useSupportedNetwork } from "hooks/useSupportedNetwork";
import { INFTTokenInfoRedeemed } from "types/types";
import { useVaults } from "hooks/useVaults";

export interface IAirdropMachineContext {
  nftData: INFTTokenData;
  closeRedeemModal: () => void;
  address: string | undefined;
  handleRedeem: () => Promise<void>;
  showLoader: boolean;
}

export const AirdropMachineContext = createContext<IAirdropMachineContext>(undefined as any);

export default function CheckEligibility() {
  const { t } = useTranslation();
  const { account } = useEthers();
  const [userInput, setUserInput] = useState("");
  const { isShowing, toggle } = useModal();
  const inputError = userInput && !isAddress(userInput);
  const address = isAddress(userInput) ? userInput : undefined;
  const isSupportedNetwork = useSupportedNetwork();
  const [showLoader, setShowLoader] = useState(false);
  const [redeemed, setRedeemed] = useState<INFTTokenInfoRedeemed[] | undefined>();
  const [addressToCheck, setAddressToCheck] = useState<string | undefined>();
  const nftDataToCheck = useNFTTokenData(addressToCheck);
  const { nftData: vaultsNftData } = useVaults();
  const nftData = account === address && vaultsNftData ? vaultsNftData : nftDataToCheck;

  const handleCheck = useCallback(() => {
    if (address) {
      setAddressToCheck(address);
      toggle();
    }
  }, [address, toggle]);

  useEffect(() => {
    setUserInput(account ?? "");
  }, [setUserInput, account])


  const handleModalClose = () => {
    toggle();
  }

  const handleRedeem = useCallback(async () => {
    if (!nftData?.treeRedeemables) return;
    setShowLoader(true);
    const tx = await nftData?.redeemTree();
    if (tx?.status) {
      const refreshed = await nftData?.refreshRedeemed();
      if (refreshed) {
        setRedeemed(refreshed.filter(nft => nft.isRedeemed &&
          nftData.treeRedeemables?.find(r => r.tokenId.eq(nft.tokenId))));
      }
    }
    setShowLoader(false);
  }, [nftData])

  return (
    <div className="check-eligibility-wrapper">
      {t("AirdropMachine.CheckEligibility.text-1")}
      <div className="check-eligibility__address-wrapper">
        <div className={classNames({ "check-eligibility__input-container": true, "check-eligibility__input-error": inputError })}>
          <input
            className="check-eligibility__address-input"
            type="text"
            placeholder={t("AirdropMachine.CheckEligibility.input-placeholder")}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)} />
          <button className="check-eligibility__clear-input" onClick={() => setUserInput("")}>&times;</button>
        </div>

        {inputError && <span className="check-eligibility__error-label">{t("AirdropMachine.CheckEligibility.input-error")}</span>}
        {nftData?.isBeforeDeadline === false && <span className="check-eligibility__error-label">{t("AirdropMachine.CheckEligibility.deadline")}</span>}
        {!isSupportedNetwork && <span className="check-eligibility__error-label">{t("Shared.network-not-supported")}</span>}
        <button
          className="check-eligibility__check-button fill"
          onClick={handleCheck}
          disabled={!isSupportedNetwork || !nftData?.isBeforeDeadline || inputError || !userInput}>
          {nftData.treeRedeemablesCount > 0 ? t("AirdropMachine.CheckEligibility.button-text-1") :
            t("AirdropMachine.CheckEligibility.button-text-0")}
        </button>
      </div>
      <Modal
        isShowing={isShowing}
        hide={handleModalClose}>
        {redeemed ?
          <RedeemNftSuccess redeemed={redeemed!} /> : <AirdropMachineContext.Provider
            value={{ address, nftData, closeRedeemModal: toggle, handleRedeem, showLoader }} >
            <Redeem />
          </AirdropMachineContext.Provider>
        }
      </Modal>
    </div>
  )
}
