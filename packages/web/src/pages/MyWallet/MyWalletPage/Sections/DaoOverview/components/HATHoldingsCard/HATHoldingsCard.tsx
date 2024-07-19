import { HATTokensConfig, erc20_abi } from "@hats.finance/shared";
import InfoIcon from "assets/icons/info.icon";
import { WithTooltip } from "components";
import { BigNumber } from "ethers";
import { useTranslation } from "react-i18next";
import { IS_PROD, appChains } from "settings";
import { Amount } from "utils/amounts.utils";
import { useAccount, useContractReads, useNetwork } from "wagmi";
import { StyledHATHoldingsCard } from "./styles";

const useHATMultipleBalances = () => {
  const { address: account } = useAccount();
  const { chain: connectedChain } = useNetwork();

  const isTestnet = connectedChain?.testnet;
  const env = isTestnet && !IS_PROD ? "test" : "prod";

  const { data, isLoading } = useContractReads({
    enabled: !!account,
    contracts: Object.entries(HATTokensConfig[env]).map(([chainId, config]) => ({
      abi: erc20_abi,
      address: config.address as `0x${string}`,
      functionName: "balanceOf",
      chainId: Number(chainId),
      args: [account],
    })),
  });

  const totalAcrossChains = (data as BigNumber[] | undefined)?.reduce((acc, value) => acc.add(value), BigNumber.from(0));
  const breakdownPerChain = Object.entries(HATTokensConfig[env])
    .map(([chainId, _], index) => ({
      chainId: Number(chainId),
      balance: (data?.[index] as BigNumber | undefined) ?? BigNumber.from(0),
    }))
    .filter((x) => x.balance.gt(0));

  return {
    isLoading,
    totalAcrossChains: new Amount(totalAcrossChains ?? BigNumber.from(0), 18, "$HAT"),
    breakdownPerChain: breakdownPerChain.map((x) => ({
      ...x,
      balance: new Amount(x.balance, 18, "HAT"),
    })),
  };
};

export const HATHoldingsCard = () => {
  const { t } = useTranslation();
  const { totalAcrossChains, breakdownPerChain, isLoading } = useHATMultipleBalances();

  const getBreakdownText = () => {
    return breakdownPerChain
      .map((breakdown) => `${appChains[breakdown.chainId].chain.name}: ${breakdown.balance.formatted(5, true)}`)
      .join("\n");
  };

  return (
    <StyledHATHoldingsCard>
      <WithTooltip text={getBreakdownText()} placement="bottom">
        <div className="container">
          <p className="main-content">{isLoading ? "--" : totalAcrossChains.formatted(5, true)}</p>
          <div className="subtitle mt-4">
            <p>{t("MyWallet.totalHAT")}</p>
            <InfoIcon width={16} height={16} />
          </div>
        </div>
      </WithTooltip>
    </StyledHATHoldingsCard>
  );
};
