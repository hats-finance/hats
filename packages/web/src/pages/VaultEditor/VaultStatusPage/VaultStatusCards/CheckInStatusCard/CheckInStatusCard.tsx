import { getBaseSafeAppUrl, getGnosisChainPrefixByChainId } from "@hats.finance/shared";
import SyncIcon from "@mui/icons-material/Sync";
import { Alert, Button, Loading, Pill } from "components";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { VaultStatusContext } from "../../store";
import { createVaultCheckInProposalOnSafe } from "./vaultCheckin.utils";

export const CheckInStatusCard = () => {
  const { t } = useTranslation();

  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { address: account } = useAccount();

  const [proposalCreatedSuccessfully, setProposalCreatedSuccessfully] = useState<boolean | undefined>();
  const [isLoading, setIsLoading] = useState<boolean | undefined>();

  const { vaultData, vaultAddress, refreshVaultData, userPermissionData } = useContext(VaultStatusContext);
  const { allVaults } = useVaults();
  const vault = allVaults?.find((vault) => vault.id === vaultAddress);
  const { isCommitteeCheckedIn } = vaultData;

  const isCommitteeMember = userPermissionData.role === "committee";

  const handleCheckIn = async () => {
    if (!vault || !chain || !signer || !account) return;

    setIsLoading(true);
    const isOk = await createVaultCheckInProposalOnSafe(vault, { chain, signer, account });
    setProposalCreatedSuccessfully(isOk);
    setIsLoading(false);
  };

  const goToSafeApp = () => {
    if (!vault) return;
    window.open(
      `${getBaseSafeAppUrl(vault.chainId)}/transactions/queue?safe=${getGnosisChainPrefixByChainId(vault.chainId)}:${
        vault.committee
      }`,
      "_blank"
    );
  };

  return (
    <div className="status-card">
      <div className="status-card__title">
        <div className="leftSide">
          <h3>{t("committeeCheckIn")}</h3>
          <Pill
            dotColor={isCommitteeCheckedIn ? "blue" : "red"}
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
          {!isCommitteeMember && <Alert content={t("connectWithCommitteeMember")} type="warning" />}

          {proposalCreatedSuccessfully ? (
            <Alert type="success">
              <>
                <span>{t("proposalCreatedSuccessfully")}</span>
                <Button styleType="text" onClick={goToSafeApp}>
                  {t("goToSafeApp")}
                </Button>
              </>
            </Alert>
          ) : (
            <Button disabled={!isCommitteeMember || isLoading} onClick={handleCheckIn} className="status-card__button">
              {t("checkIn")}
            </Button>
          )}
        </>
      )}

      {isLoading && <Loading extraText={t("creatingProposal")} fixed />}
    </div>
  );
};
