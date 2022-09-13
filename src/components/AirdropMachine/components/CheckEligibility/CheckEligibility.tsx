import { useEthers } from "@usedapp/core";
import Modal from "components/Shared/Modal/Modal";
import useModal from "hooks/useModal";
import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Redeem from "../Redeem/Redeem";
import "./index.scss";
import RedeemNftSuccess from "components/RedeemNftSuccess/RedeemNftSuccess";
import { INFTTokenData, useNFTTokenData } from "hooks/useNFTTokenData";
import { isAddress } from "ethers/lib/utils";
import classNames from "classnames";
import { useSupportedNetwork } from "hooks/useSupportedNetwork";
import { INFTTokenInfo } from "types/types";

export interface IAirdropMachineContext {
  nftData: INFTTokenData;
  closeRedeemModal: () => void;
  address: string | undefined;
}

export const AirdropMachineContext = createContext<IAirdropMachineContext>(undefined as any);

export default function CheckEligibility() {
  const { t } = useTranslation();
  const { account } = useEthers();
  const [userInput, setUserInput] = useState("");
  const { isShowing, toggle } = useModal();
  const inputError = userInput && !isAddress(userInput);
  const address = isAddress(userInput) ? userInput : undefined;
  const nftData = useNFTTokenData(address);
  const isSupportedNetwork = useSupportedNetwork();

  useEffect(() => {
    setUserInput(account ?? "");
  }, [setUserInput, account])


  const handleModalClose = () => {
    toggle();
  }

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
          onClick={toggle}
          disabled={!isSupportedNetwork || !nftData?.isBeforeDeadline || inputError || !userInput}>
          {(nftData.proofRedeemables?.length ?? 0) > 0 ? t("AirdropMachine.CheckEligibility.button-text-1") :
            t("AirdropMachine.CheckEligibility.button-text-0")}
        </button>
      </div>
      <Modal
        isShowing={isShowing}
        hide={handleModalClose}>
        <AirdropMachineContext.Provider value={{ address, nftData, closeRedeemModal: toggle }} >
          <Redeem />
        </AirdropMachineContext.Provider>
      </Modal>
    </div>
  )
}
