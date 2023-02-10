import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { Button, Loading, Pill } from "components";
import { CommitteeCheckInContract } from "contracts";
import { VaultStatusContext } from "../store";
import { isAGnosisSafeTx } from "utils/gnosis.utils";

export const CheckInStatusCard = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const { vaultData, vaultAddress, vaultChainId, loadVaultData } = useContext(VaultStatusContext);
  const { isCommitteeCheckedIn, committeeMulsitigAddress } = vaultData;

  const isMultisigConnected = address === committeeMulsitigAddress;

  const checkInCall = CommitteeCheckInContract.hook(undefined, { address: vaultAddress, chainId: vaultChainId });
  const handleCheckIn = () => {
    if (isCommitteeCheckedIn || !isMultisigConnected) return;
    checkInCall.send();
  };

  useEffect(() => {
    const txHash = checkInCall.data?.hash;
    if (!txHash) return;

    isAGnosisSafeTx(txHash, vaultChainId).then((isSafeTx) => {
      if (isSafeTx) alert(t("safeProposalCreatedSuccessfully"));
      setTimeout(() => loadVaultData(vaultAddress, vaultChainId), 2000);
    });
  }, [checkInCall.data, loadVaultData, vaultAddress, vaultChainId, t]);

  return (
    <div className="status-card">
      <div className="status-card__title">
        <span>{t("checkIn")}</span>
        <Pill color={isCommitteeCheckedIn ? "blue" : "red"} text={isCommitteeCheckedIn ? t("completed") : t("awaitingAction")} />
      </div>

      {isCommitteeCheckedIn ? (
        <p className="status-card__text">{t("committeeCheckedIn")}</p>
      ) : (
        <>
          <p className="status-card__text">{t("checkInExpanation")}</p>
          {!isMultisigConnected && <p className="status-card__error">{t("connectWithMultisigOrCheckInOnGnosis")}</p>}
          {checkInCall.error && <p className="status-card__error">{checkInCall.error.message}</p>}
          <Button disabled={!isMultisigConnected} onClick={handleCheckIn} className="status-card__button">
            {t("checkIn")}
          </Button>
        </>
      )}

      {checkInCall.isLoading && <Loading fixed extraText={`${t("approveTheTransactionOnSafeApp")}`} />}
    </div>
  );
};
