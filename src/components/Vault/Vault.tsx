import { ForwardedRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { BigNumber } from "ethers";
import millify from "millify";
import { IVault } from "types/types";
import { ipfsTransformUri } from "utils";
import ArrowIcon from "assets/icons/arrow.icon";
import VaultExpanded from "./VaultExpanded/VaultExpanded";
import VaultActions from "./VaultActions/VaultActions";
import VaultTokens from "./VaultTokens/VaultTokens";
import { useVaultsTotalPrices } from "./hooks/useVaultsTotalPrices";
import VaultAPY from "./VaultAPY/VaultAPY";
import { Amount } from "utils/amounts.utils";
import { StyledVault, StyledVersionFlag, StyledVaultExpandAction } from "./styles";

interface VaultComponentProps {
  vault: IVault;
  expanded: boolean;
  setExpanded?: any;
  preview?: boolean;
}

const VaultComponent = (
  { vault, expanded, preview, setExpanded }: VaultComponentProps,
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
    <StyledVaultExpandAction expanded={expanded}>
      <ArrowIcon />
    </StyledVaultExpandAction>
  );

  const expandVault = () => {
    setExpanded && setExpanded(expanded ? null : vault.id);
  };

  const vaultBalanceAndValue = (
    <div className="balance-information">
      <div className="vault-balance-wrapper">
        {!multipleVaults && millify(vaultBalance)}
        <span className="balance-value">&nbsp;{`≈ $${millify(valueOfAllVaults)}`}</span>
      </div>
      <span className="sub-label onlyMobile">{t("Vault.total-vault")}</span>
    </div>
  );

  return (
    <>
      <StyledVault type={vaultType} ref={ref}>
        <td className="onlyDesktop" onClick={expandVault}>
          {vault.version === "v2" && <StyledVersionFlag>{vault.version}</StyledVersionFlag>}
          <span>{vaultExpandAction}</span>
        </td>

        <td>
          <div className="project-name-wrapper">
            <div className="vault-icon">
              {vaultIcon && <img className="logo" src={ipfsTransformUri(vaultIcon)} alt={`${vaultName} logo`} />}
              {vault.chainId && (
                <div className="chain-logo">
                  <img src={require(`assets/icons/chains/${vault.chainId}.png`)} alt={`${vaultName} logo`} />
                </div>
              )}
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

        <>
          <td className="rewards-cell-wrapper onlyDesktop">{vaultBalanceAndValue}</td>
          <td className="onlyDesktop">
            <VaultAPY vault={vault} />
          </td>
          <td className="onlyDesktop">
            <VaultActions data={vault} withdrawRequests={withdrawRequests} preview={preview} />
          </td>
        </>

        <td className="onlyMobile" onClick={expandVault}>
          {vaultExpandAction}
          {vault.version === "v2" && <StyledVersionFlag>{vault.version}</StyledVersionFlag>}
        </td>
      </StyledVault>
      {expanded && <VaultExpanded data={vault} withdrawRequests={withdrawRequests} preview={preview} />}
    </>
  );
};

export const Vault = forwardRef(VaultComponent);
