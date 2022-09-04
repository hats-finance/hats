import { shortenIfAddress, useEthers } from "@usedapp/core";
import Modal from "components/Shared/Modal/Modal";
import useModal from "hooks/useModal";
import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Redeem from "../Redeem/Redeem";
import "./index.scss";
import { useVaults } from "hooks/useVaults";
import RedeemNftSuccess from "components/RedeemNftSuccess/RedeemNftSuccess";

export interface IAirdropMachineContext {
  closeRedeemModal: () => void;
}

export const AirdropMachineContext = createContext<IAirdropMachineContext>(undefined as any);

export default function CheckEligibility() {
  const { t } = useTranslation();
  const { account } = useEthers();
  const { isShowing, toggle } = useModal();
  const { nftData } = useVaults();
  const [redeemed, setRedeemed] = useState(false);

  useEffect(() => {
    if (nftData?.redeemMultipleFromTreeState.status === "Success") {
      setRedeemed(true);
    }
  }, [nftData?.redeemMultipleFromTreeState, setRedeemed])

  const handleModalClose = () => {
    setRedeemed(false);
    toggle();
  }

  return (
    <div className="check-eligibility-wrapper">
      {t("AirdropMachine.CheckEligibility.text-1")}
      <div className="check-eligibility__address-wrapper">
        <div className="check-eligibility__address-container">
          {shortenIfAddress(account)}
          {!account && <span className="check-eligibility__error-label">
            {t("AirdropMachine.CheckEligibility.no-account")}
          </span>}
        </div>

        {nftData?.isBeforeDeadline === false && <span className="check-eligibility__error-label">{t("AirdropMachine.CheckEligibility.deadline")}</span>}
        <button
          className="check-eligibility__check-button fill"
          onClick={toggle}
          disabled={!account || !nftData?.isBeforeDeadline}>
          {nftData?.airdropToRedeem ? t("AirdropMachine.CheckEligibility.button-text-1") : t("AirdropMachine.CheckEligibility.button-text-0")}
        </button>
      </div>
      <Modal
        isShowing={isShowing}
        hide={handleModalClose}>
        <AirdropMachineContext.Provider value={{ closeRedeemModal: toggle }} >
          {redeemed ? <RedeemNftSuccess type="isMerkleTree" /> : <Redeem />}
        </AirdropMachineContext.Provider>
      </Modal>
    </div>
  )
}
