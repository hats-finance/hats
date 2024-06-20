import { IPayoutGraph, IVault } from "@hats.finance/shared";
import { WithTooltip } from "components/WithTooltip/WithTooltip";
import { ethers } from "ethers";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { formatNumber, ipfsTransformUri } from "utils";
import { StyledVaultAssetsPillsList } from "./styles";

type VaultAssetsPillsListProps = {
  vaultData?: IVault;
  auditPayout?: IPayoutGraph;
  ecosystemFunding?: boolean;
};

export const VaultAssetsPillsList = ({ vaultData, auditPayout, ecosystemFunding = false }: VaultAssetsPillsListProps) => {
  const { t } = useTranslation();
  const vault = vaultData ?? auditPayout?.payoutData?.vault;

  const totalPaidOutOnAudit = useMemo(() => {
    if (!vault) return undefined;
    if (!auditPayout) return undefined;

    const inTokens = +ethers.utils.formatUnits(auditPayout.totalPaidOut ?? "0", vault.stakingTokenDecimals);

    return {
      tokens: inTokens,
      usd: inTokens * (auditPayout.payoutData?.vault?.amountsInfo?.tokenPriceUsd ?? 0),
    };
  }, [auditPayout, vault]);

  if (!vault || !vault.description) return null;

  const tokenAddress = vault.stakingToken;
  const token = vault.stakingTokenSymbol;
  const tokenIcon = vault.description["project-metadata"].tokenIcon;
  const tokenNetwork = vault.chainId ? appChains[vault.chainId] : null;

  const goToTokenInformation = () => {
    if (!tokenNetwork) return;
    window.open(tokenNetwork.chain.blockExplorers?.default.url + "/token/" + tokenAddress, "_blank");
  };

  const amountToShowInTokens = auditPayout ? totalPaidOutOnAudit?.tokens : vault.amountsInfo?.depositedAmount.tokens;

  const getTooltipText = () => {
    if (ecosystemFunding) {
      return `~${formatNumber(amountToShowInTokens ?? 0, 4)} ${token}`;
    }

    return `${vault.version} | ${auditPayout ? t("paid") : t("deposited")} ~${formatNumber(
      amountToShowInTokens ?? 0,
      4
    )} ${token}`;
  };

  return (
    <StyledVaultAssetsPillsList>
      <WithTooltip text={getTooltipText()}>
        <div className="token" onClick={goToTokenInformation}>
          <div className="images">
            <img className="logo" src={ipfsTransformUri(tokenIcon)} alt="token" />
            <img className="chain" src={require(`assets/icons/chains/${vault.chainId}.png`)} alt="network" />
          </div>
          <span>{token}</span>
        </div>
      </WithTooltip>
    </StyledVaultAssetsPillsList>
  );
};
