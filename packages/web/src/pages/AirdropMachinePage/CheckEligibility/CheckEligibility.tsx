import { mainnet, useAccount } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { RedeemNftSuccess, Modal } from "components";
import useModal from "hooks/useModal";
import { INFTTokenInfoRedeemed } from "hooks/nft/types";
import { useSupportedNetwork } from "hooks/wagmi/useSupportedNetwork";
import Redeem from "../Redeem/Redeem";
import { isAddress } from "ethers/lib/utils.js";
import { AirdropMachineContext } from "../context";
import { useAirdropData } from "hooks/nft/useAirdropData";
import "./index.scss";

export default function CheckEligibility() {
  const { address } = useAccount();
  const { t } = useTranslation();
  const [userInput, setUserInput] = useState("");
  const { isShowing, show, hide } = useModal();
  const inputError = userInput && !isAddress(userInput);
  const isSupportedNetwork = useSupportedNetwork();
  const [redeemed, setRedeemed] = useState<INFTTokenInfoRedeemed[] | undefined>();
  const [addressToCheck, setAddressToCheck] = useState<string | undefined>();
  const airdropData = useAirdropData(addressToCheck, mainnet.id); // mainnet only
  const { isBeforeDeadline } = airdropData;

  const handleCloseRedeemModal = useCallback(() => {
    hide();
    setRedeemed(undefined);
  }, [hide]);

  const handleCheck = useCallback(() => {
    if (address) {
      setAddressToCheck(address);
      show();
    }
  }, [address, show]);

  useEffect(() => {
    setUserInput(address ?? "");
  }, [setUserInput, address]);

  const handleRedeem = useCallback(async () => {
    // if (!nftData?.treeRedeemables) return;
    // setShowLoader(true);
    // const tx = await nftData?.redeemTree();
    // if (tx?.status) {
    //   const refreshed = await nftData?.refreshRedeemed();
    //   if (refreshed) {
    //     setRedeemed(refreshed.filter((nft) => nft.isRedeemed && nftData.treeRedeemables?.find((r) => r.tokenId.eq(nft.tokenId))));
    //   }
    // }
    // setShowLoader(false);
  }, []);

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
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button className="check-eligibility__clear-input" onClick={() => setUserInput("")}>
            &times;
          </button>
        </div>

        {inputError && <span className="check-eligibility__error-label">{t("AirdropMachine.CheckEligibility.input-error")}</span>}
        {isBeforeDeadline === false && (
          <span className="check-eligibility__error-label">{t("AirdropMachine.CheckEligibility.deadline")}</span>
        )}
        {!isSupportedNetwork && <span className="check-eligibility__error-label">{t("Shared.network-not-supported")}</span>}
        <button
          className="check-eligibility__check-button fill"
          onClick={handleCheck}
          disabled={!isSupportedNetwork || !isBeforeDeadline || inputError || !userInput}>
          {airdropData?.airdropTokens?.some((t) => !t.isRedeemed)
            ? t("AirdropMachine.CheckEligibility.button-text-1")
            : t("AirdropMachine.CheckEligibility.button-text-0")}
        </button>
      </div>

      <Modal isShowing={isShowing} onHide={hide}>
        {redeemed ? (
          <RedeemNftSuccess redeemed={redeemed!} />
        ) : (
          <AirdropMachineContext.Provider
            value={{ address, airdropData, closeRedeemModal: handleCloseRedeemModal, handleRedeem }}>
            <Redeem />
          </AirdropMachineContext.Provider>
        )}
      </Modal>
    </div>
  );
}
