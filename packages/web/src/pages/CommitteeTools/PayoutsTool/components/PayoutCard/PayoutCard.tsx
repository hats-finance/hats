import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IPayoutResponse, IVault, PayoutStatus, payoutStatusInfo } from "@hats-finance/shared";
import moment from "moment";
import { useVaults } from "hooks/vaults/useVaults";
import { RoutePaths } from "navigation";
import { WithTooltip } from "components";
import { ipfsTransformUri } from "utils";
import { appChains } from "settings";
import { StyledPayoutCard, StyledVersionFlag } from "./styles";

type PayoutCardProps = {
  payout: IPayoutResponse;
  viewOnly?: boolean;
  showVaultAddress?: boolean;
};

export const PayoutCard = ({ payout, viewOnly = false, showVaultAddress = false }: PayoutCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { payouts } = useVaults();

  /**
   * Get payout status. We only handle the status until 'Executed'. After that, we need to check onchain data. We do
   * this with the subgraph data.
   */
  const payoutStatus = useMemo(() => {
    if (payout.status === PayoutStatus.Executed) {
      // Check the status on subgraph
      const payoutOnSubgraph = payouts?.find((p) => p.id === payout.payoutClaimId);
      if (payoutOnSubgraph?.isApproved || payoutOnSubgraph?.isDismissed) {
        return payoutOnSubgraph.isApproved ? PayoutStatus.Approved : PayoutStatus.Rejected;
      }
    }

    // Return status saved on database
    return payout.status;
  }, [payout, payouts]);

  const vaultAddress = payout.vaultInfo.address;
  const isCreating = payoutStatus === PayoutStatus.Creating;

  const { allVaults } = useVaults();
  const selectedVault = vaultAddress ? allVaults?.find((v) => v.id.toLowerCase() === vaultAddress.toLowerCase()) : undefined;

  const getVaultLogo = (vault: IVault) => {
    const network = vault.chainId ? appChains[vault.chainId] : null;

    return (
      <WithTooltip text={`${vault.description?.["project-metadata"].name} ~ ${network?.chain.name}` ?? ""}>
        <div>
          <img
            className="logo"
            src={ipfsTransformUri(vault.description?.["project-metadata"].icon)}
            alt={vault.description?.["project-metadata"].name}
          />
          {vault.chainId && (
            <div className="chain-logo">
              <img src={require(`assets/icons/chains/${vault.chainId}.png`)} alt={network?.chain.name} />
            </div>
          )}
        </div>
      </WithTooltip>
    );
  };

  const handleGoToPayout = () => {
    if (payoutStatus === PayoutStatus.Creating) {
      navigate(`${RoutePaths.payouts}/${payout._id}`);
    } else {
      navigate(`${RoutePaths.payouts}/status/${payout._id}`);
    }
  };

  if (!selectedVault) return null;

  return (
    <StyledPayoutCard
      viewOnly={viewOnly}
      status={payoutStatus}
      onClick={viewOnly ? undefined : handleGoToPayout}
      minSignersReached={payout.signatures.length >= payout.minSignaturesNeeded}
    >
      {showVaultAddress && (
        <div className="vault-address">
          {t("vaultAddress")}: {payout.vaultInfo.address}
        </div>
      )}
      <StyledVersionFlag>{selectedVault.version}</StyledVersionFlag>
      <div className="col vault-icon">{getVaultLogo(selectedVault)}</div>
      <div className="col nonce">
        <p className="title">{t("nonce")}</p>
        <p className="content">{isCreating ? "-" : payout.nonce}</p>
      </div>
      <div className="col name">
        <p className="title">{t("payoutName")}</p>
        <p className="content">{payout.payoutData.title || "-"}</p>
      </div>
      <div className="col createdAt">
        <p className="title">{t("createdAt")}</p>
        <p className="content">{payout.createdAt ? moment(payout.createdAt).fromNow() : "-"}</p>
      </div>
      <div className="col signers">
        <p className="title">{t("signers")}</p>
        <p className="content">{isCreating ? "-/-" : `${payout.signatures.length}/${payout.minSignaturesNeeded}`}</p>
      </div>
      <div className="col status">
        <p className="title">{t("status")}</p>
        <p className="content">{t(payoutStatusInfo[payoutStatus].label)}</p>
      </div>
    </StyledPayoutCard>
  );
};
