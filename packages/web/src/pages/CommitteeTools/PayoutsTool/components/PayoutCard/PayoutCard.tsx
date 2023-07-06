import { IPayoutResponse, IVault, PayoutStatus, payoutStatusInfo } from "@hats-finance/shared";
import { WithTooltip } from "components";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import moment from "moment";
import { RoutePaths } from "navigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { appChains } from "settings";
import { ipfsTransformUri } from "utils";
import { usePayoutStatus } from "../../utils/usePayoutStatus";
import { StyledPayoutCard, StyledVersionFlag } from "./styles";

type PayoutCardProps = {
  payout: IPayoutResponse;
  viewOnly?: boolean;
  showVaultAddress?: boolean;
  noVaultInfo?: boolean;
};

export const PayoutCard = ({ payout, viewOnly = false, showVaultAddress = false, noVaultInfo = false }: PayoutCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const payoutStatus = usePayoutStatus(payout);

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

  const getVaultId = () => {
    if (payout.vaultInfo.version === "v1") {
      return `${payout.vaultInfo.address}~${payout.vaultInfo.pid}`;
    }
    return payout.vaultInfo.address;
  };

  if (!selectedVault || !payoutStatus) return null;

  return (
    <StyledPayoutCard
      viewOnly={viewOnly}
      status={payoutStatus}
      onClick={viewOnly ? undefined : handleGoToPayout}
      minSignersReached={payout.signatures.length >= payout.minSignaturesNeeded}
      noVaultInfo={noVaultInfo}
    >
      {showVaultAddress && (
        <div className="vault-address">
          <strong>{t("vaultId")}</strong>: {getVaultId()}
        </div>
      )}
      {!noVaultInfo && <StyledVersionFlag>{selectedVault.version}</StyledVersionFlag>}
      {!noVaultInfo && <div className="col vault-icon">{getVaultLogo(selectedVault)}</div>}
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
