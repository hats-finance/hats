import { AirdropFactoriesChainConfig } from "@hats.finance/shared";
import InfoIcon from "assets/icons/info.icon";
import { Button, WithTooltip } from "components";
import { useAirdropsByFactories } from "pages/Airdrops/hooks";
import { useTranslation } from "react-i18next";
import { IS_PROD } from "settings";
import { useNetwork } from "wagmi";

export const ConvertibleTokensCard = () => {
  const { t } = useTranslation();
  const { chain: connectedChain } = useNetwork();

  const isTestnet = !IS_PROD && connectedChain?.testnet;
  const env = isTestnet ? "test" : "prod";
  const { data: airdropsData, isLoading } = useAirdropsByFactories(AirdropFactoriesChainConfig[env].pointdrop);

  console.log(airdropsData);

  return (
    <div className="overview-card">
      <WithTooltip text={"TODO: Define text"} placement="bottom">
        <div>
          <p className="main-content">540 points = 480 HAT</p>
          <div className="flex mt-4">
            <p>{t("MyWallet.claimableTokens")}</p>
            <InfoIcon width={16} height={16} />
          </div>
        </div>
      </WithTooltip>
      <Button className="action-button">{t("MyWallet.claimTokens")}</Button>
    </div>
  );
};
