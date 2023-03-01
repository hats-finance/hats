import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { Alert, Button, Loading, Pill } from "components";
import { CommitteeCheckInContract } from "contracts";
import { VaultStatusContext } from "../store";
import { isAGnosisSafeTx } from "utils/gnosis.utils";
import SyncIcon from "@mui/icons-material/Sync";

export const CheckInStatusCard = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const [isBeingExecuted, setIsBeingExecuted] = useState(false);

  const { vaultData, vaultAddress, vaultChainId, refreshVaultData } = useContext(VaultStatusContext);
  const { isCommitteeCheckedIn, committeeMulsitigAddress } = vaultData;

  const isMultisigConnected = address === committeeMulsitigAddress;

  const checkInCall = CommitteeCheckInContract.hook(undefined, { address: vaultAddress, chainId: vaultChainId });
  const handleCheckIn = () => {
    if (isCommitteeCheckedIn || !isMultisigConnected) return;
    checkInCall?.send();
  };

  useEffect(() => {
    const txHash = checkInCall?.data?.hash;
    if (!txHash) return;

    isAGnosisSafeTx(txHash, vaultChainId).then((isSafeTx) => {
      if (isSafeTx) setIsBeingExecuted(true);
      setTimeout(() => refreshVaultData(), 2000);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkInCall]);

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <span>{t("checkIn")}</span>
          <Pill
            color={isCommitteeCheckedIn ? "blue" : "red"}
            text={isCommitteeCheckedIn ? t("completed") : t("awaitingAction")}
          />
        </div>
        <div className="reload" onClick={refreshVaultData}>
          <SyncIcon />
        </div>
      </div>

      {isCommitteeCheckedIn ? (
        <p className="status-card__text">{t("committeeCheckedIn")}</p>
      ) : (
        <>
          <p className="status-card__text mb-5">{t("checkInExpanation")}</p>
          {!isMultisigConnected && <Alert content={t("connectWithCommitteeMultisig")} type="warning" />}
          {checkInCall?.error && <p className="status-card__error">{checkInCall?.error.message}</p>}
          {isBeingExecuted && !checkInCall?.error && <Alert content={t("safeProposalCreatedSuccessfully")} type="warning" />}
          <Button disabled={!isMultisigConnected || isBeingExecuted} onClick={handleCheckIn} className="status-card__button">
            {t("checkIn")}
          </Button>
        </>
      )}

      {checkInCall?.isLoading && <Loading fixed extraText={`${t("approveTheTransactionOnSafeApp")}`} />}
    </div>
  );
};
