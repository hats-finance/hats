import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import { Pill, VaultAssetsPillsList, WithTooltip } from "components";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useConfirm from "hooks/useConfirm";
import { useTokenBalanceAmount } from "hooks/wagmi";
import millify from "millify";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { ipfsTransformUri } from "utils";
import { StyledVaultCard } from "./styles";

export type FundingProtocolVault = {
  name: string;
  logo: string;
  description: string;
  chain: number;
  address: string;
  website: string;
  token: {
    address: string;
    icon: string;
    decimals: string;
    symbol: string;
  };
};

type VaultFundingProtocolCardProps = {
  fundingProtocolVault: FundingProtocolVault;
};

/**
 * Render the vault card for a funding protocol.
 *
 * @param fundingProtocolVault - The vault data.
 */
export const VaultFundingProtocol = ({ fundingProtocolVault }: VaultFundingProtocolCardProps) => {
  const { t } = useTranslation();
  const { tokenPrices } = useVaults();
  const confirm = useConfirm();
  const isTestnet = appChains[fundingProtocolVault.chain].chain.testnet;

  const tokenBalance = useTokenBalanceAmount({
    address: fundingProtocolVault.address as `0x${string}`,
    token: fundingProtocolVault.token.address,
    chainId: fundingProtocolVault.chain,
  });
  const tokenPrice: number = isTestnet ? 1 : (tokenPrices && tokenPrices[fundingProtocolVault.token.address]) ?? 0;

  const getAuditStatusPill = () => {
    return (
      <div className="mb-4">
        <Pill transparent dotColor="blue" text={t("openNow")} />
      </div>
    );
  };

  const goToProjectWebsite = async () => {
    if (!fundingProtocolVault.website) return;

    const wantToGo = await confirm({
      title: t("goToProjectWebsite"),
      titleIcon: <OpenIcon className="mr-2" fontSize="large" />,
      description: t("doYouWantToGoToProjectWebsite", { website: fundingProtocolVault.website }),
      cancelText: t("no"),
      confirmText: t("yesGo"),
    });

    if (!wantToGo) return;
    window.open(fundingProtocolVault.website, "_blank");
  };

  return (
    <StyledVaultCard fundingProtocolVault isAudit={false} reducedStyles={false} showIntendedAmount={false} hasActiveClaim={false}>
      {getAuditStatusPill()}

      <div className="vault-info">
        <div className="metadata">
          <img onClick={goToProjectWebsite} src={ipfsTransformUri(fundingProtocolVault.logo)} alt="logo" />
          <div className="name-description">
            <h3 className="name">{fundingProtocolVault.name}</h3>
            <p className="description">{fundingProtocolVault.description}</p>
          </div>
        </div>

        <div className="stats">
          <div />
          <div className="stats__stat intended-on-audits">
            <>
              <WithTooltip text={t("availableFundingExplanation")}>
                <h3 className="value">
                  ~$
                  {millify(tokenBalance.number * tokenPrice)}
                </h3>
              </WithTooltip>
              <div className="sub-value">{t("availableFunding")}</div>
            </>
          </div>
        </div>
      </div>

      <div className="vault-actions">
        <div className="assets">
          <span className="subtitle">{t("assetsInVault")}</span>
          <VaultAssetsPillsList
            vaultData={
              {
                version: "v3",
                chainId: fundingProtocolVault.chain,
                stakingTokenDecimals: fundingProtocolVault.token.decimals,
                stakingToken: fundingProtocolVault.token.address,
                stakingTokenSymbol: fundingProtocolVault.token.symbol,
                description: {
                  "project-metadata": {
                    tokenIcon: fundingProtocolVault.token.icon,
                  },
                },
                amountsInfo: {
                  depositedAmount: {
                    tokens: tokenBalance.formattedWithoutSymbol(),
                  },
                },
              } as any
            }
          />
        </div>
      </div>
    </StyledVaultCard>
  );
};
