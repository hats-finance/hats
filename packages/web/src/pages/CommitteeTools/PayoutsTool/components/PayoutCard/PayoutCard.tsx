import { IPayoutResponse, IVault, PayoutStatus, payoutStatusInfo } from "@hats-finance/shared";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useVaults } from "hooks/vaults/useVaults";
import { RoutePaths } from "navigation";
import { WithTooltip } from "components";
import { ipfsTransformUri } from "utils";
import { appChains } from "settings";
import { StyledPayoutCard } from "./styles";

type PayoutCardProps = {
  payout: IPayoutResponse;
  viewOnly?: boolean;
  showVaultAddress?: boolean;
};

export const PayoutCard = ({ payout, viewOnly = false, showVaultAddress = false }: PayoutCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const vaultAddress = payout.vaultInfo.address;
  const isCreating = payout.status === PayoutStatus.Creating;

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
    if (payout.status === PayoutStatus.Creating) {
      navigate(`${RoutePaths.payouts}/${payout._id}`);
    } else {
      navigate(`${RoutePaths.payouts}/status/${payout._id}`);
    }
  };

  if (!selectedVault) return null;

  return (
    <StyledPayoutCard
      viewOnly={viewOnly}
      status={payout.status}
      onClick={viewOnly ? undefined : handleGoToPayout}
      minSignersReached={payout.signatures.length >= payout.minSignaturesNeeded}
    >
      {showVaultAddress && (
        <div className="vault-address">
          {t("vaultAddress")}: {payout.vaultInfo.address}
        </div>
      )}
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
        <p className="content">{t(payoutStatusInfo[payout.status].label)}</p>
      </div>
    </StyledPayoutCard>
  );
};
