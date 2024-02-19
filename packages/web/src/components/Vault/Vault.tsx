import WarnIcon from "@mui/icons-material/WarningAmberRounded";
import ArrowIcon from "assets/icons/arrow.icon";
import { WithTooltip } from "components/WithTooltip/WithTooltip";
import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import { BigNumber } from "ethers";
import { useVaultsTotalPrices } from "hooks/vaults/useVaultsTotalPrices";
import millify from "millify";
import Tooltip from "rc-tooltip";
import { ForwardedRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { IVault } from "types";
import { ipfsTransformUri } from "utils";
import { Amount } from "utils/amounts.utils";
import VaultActions from "./VaultActions/VaultActions";
import VaultExpanded from "./VaultExpanded/VaultExpanded";
import VaultTokens from "./VaultTokens/VaultTokens";
import { StyledActiveClaimFlag, StyledVault, StyledVaultExpandAction, StyledVersionFlag } from "./styles";

interface VaultComponentProps {
  vault: IVault;
  expanded: boolean;
  noActions?: boolean;
  setExpanded?: any;
  preview?: boolean;
  selected?: boolean;
  onSelect?: Function;
}

const VaultComponent = (
  { vault, expanded, preview, setExpanded, onSelect, selected = false, noActions = false }: VaultComponentProps,
  ref: ForwardedRef<HTMLTableRowElement>
) => {
  const { t } = useTranslation();
  const { description, honeyPotBalance, withdrawRequests, stakingTokenDecimals, stakingTokenSymbol, multipleVaults } = vault;
  const { totalPrices } = useVaultsTotalPrices(multipleVaults ?? [vault]);
  const valueOfAllVaults = Object.values(totalPrices).reduce((a, b = 0) => a + b, 0);

  const vaultBalance = new Amount(BigNumber.from(honeyPotBalance), stakingTokenDecimals, stakingTokenSymbol).number;
  const vaultType = description?.["project-metadata"]?.type?.toLowerCase();
  const vaultIcon = description?.["project-metadata"]?.icon ?? "";
  const vaultName = description?.["project-metadata"].name ?? "";

  const vaultExpandAction = (
    <StyledVaultExpandAction expanded={expanded}>{!preview ? <ArrowIcon /> : null}</StyledVaultExpandAction>
  );

  const expandVault = () => {
    setExpanded && setExpanded(expanded ? null : vault.id);
  };

  const getVaultChainIcon = () => {
    const network = vault.chainId ? appChains[vault.chainId] : null;

    return (
      <Tooltip overlayClassName="tooltip" overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE} overlay={network?.chain.name}>
        <div className="chain-logo">
          <img src={require(`assets/icons/chains/${vault.chainId}.png`)} alt={network?.chain.name} />
        </div>
      </Tooltip>
    );
  };

  const vaultBalanceAndValue = (
    <div className="balance-information">
      <div className="vault-balance-wrapper">
        {!multipleVaults && (vaultBalance > 0 ? millify(vaultBalance) : "-")}
        {!preview && <span className="balance-value">&nbsp;{`≈ $${millify(valueOfAllVaults)}`}</span>}
      </div>
      <span className="sub-label onlyMobile">{t("Vault.total-vault")}</span>
    </div>
  );

  const getVersionFlag = () => {
    return vault.version === "v2" && !vault.activeClaim && <StyledVersionFlag>{vault.version}</StyledVersionFlag>;
  };

  const getActiveClaimFlag = () => {
    return (
      vault.activeClaim && (
        <WithTooltip text={t("vaultPausedActiveClaimExplanation")}>
          <StyledActiveClaimFlag>
            <WarnIcon />
          </StyledActiveClaimFlag>
        </WithTooltip>
      )
    );
  };

  return (
    <>
      <StyledVault
        type={vaultType}
        ref={ref}
        selectionMode={!!onSelect}
        selected={selected}
        onClick={onSelect ? () => onSelect() : undefined}
      >
        <td className="onlyDesktop" onClick={expandVault}>
          {getVersionFlag()}
          {getActiveClaimFlag()}
          {!onSelect && <span>{vaultExpandAction}</span>}
        </td>

        <td className="relative-column">
          <div className="onlyMobile">
            {getVersionFlag()}
            {getActiveClaimFlag()}
          </div>
          <div className="project-name-wrapper">
            <div className="vault-icon">
              {vaultIcon && (
                <img className="logo" src={ipfsTransformUri(vaultIcon, { isPinned: !preview })} alt={`${vaultName} logo`} />
              )}
              {vault.chainId && getVaultChainIcon()}
            </div>
            <div className="name-source-wrapper">
              <div className="project-name">
                <span>{vaultName}</span>
                <VaultTokens vault={vault} />
              </div>
              <div className="onlyMobile">{vaultBalanceAndValue}</div>
            </div>
          </div>
        </td>

        <td className="rewards-cell-wrapper onlyDesktop">{vaultBalanceAndValue}</td>
        {!onSelect && (
          <td className="onlyDesktop">
            {!noActions && <VaultActions data={vault} withdrawRequests={withdrawRequests} preview={preview} />}
          </td>
        )}

        <td className="onlyMobile" onClick={expandVault}>
          {vaultExpandAction}
        </td>
      </StyledVault>
      {expanded && <VaultExpanded data={vault} withdrawRequests={withdrawRequests} preview={preview} noActions={noActions} />}
    </>
  );
};

export const Vault = forwardRef(VaultComponent);
