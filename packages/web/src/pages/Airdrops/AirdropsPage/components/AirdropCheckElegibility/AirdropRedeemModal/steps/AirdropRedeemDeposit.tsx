import { BackArrowIcon } from "assets/icons/back-arrow";
import HatsTokenIcon from "assets/icons/hats-logo-circle.svg";
import { Alert, Button, FormInput, FormSliderInput } from "components";
import { ApyPill } from "components/VaultCard/styles";
import { BigNumber } from "ethers";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useVaultApy } from "hooks/vaults/useVaultApy";
import millify from "millify";
import moment from "moment";
import { VAULT_TO_DEPOSIT } from "pages/Airdrops/constants";
import { AirdropElegibility } from "pages/Airdrops/utils/getAirdropElegibility";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { shortenAddress, shortenIfAddress } from "utils/addresses.utils";
import { Amount, numberWithThousandSeparator } from "utils/amounts.utils";
import { useAccount } from "wagmi";
import { AirdropRedeemModalContext } from "../store";

export const AirdropRedeemDeposit = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const { allVaults } = useVaults();
  const vaultToDeposit = allVaults?.find((vault) => vault.id === VAULT_TO_DEPOSIT);
  const vaultApy = useVaultApy(vaultToDeposit);

  const [percentageToDeposit, setPercentageToDeposit] = useState<number>(0.5);

  const { prevStep, addressToCheck, airdropsElegibility, airdropsData, handleClaimAirdrops, onlyTokenLocks } =
    useContext(AirdropRedeemModalContext);

  if (airdropsElegibility.some((airdrop) => !airdrop || !airdrop.eligible)) return null;

  const isReceiverConnected = addressToCheck.toLowerCase() === address?.toLowerCase();

  const depositableAmount = new Amount(
    airdropsElegibility.reduce(
      (prev, airdrop, i) => prev.add(!airdropsData[i].isLocked ? BigNumber.from((airdrop as AirdropElegibility).total) : 0),
      BigNumber.from(0)
    ),
    18
  ).number;

  if (onlyTokenLocks) {
    prevStep();
    return null;
  }

  return (
    <div className="content-modal">
      <img className="banner" src={require("assets/images/hats_vault.png")} alt="hats claim" />
      <h2>
        {t("Airdrop.lastStep")}
        <br />
        {t("Airdrop.lastStepDesc")}
      </h2>

      <div>
        {!onlyTokenLocks && vaultToDeposit && (
          <div className="mt-2">
            <h3>{t("Airdrop.depositToEarnAPY")}</h3>
            <p>{t("Airdrop.depositToEarnAPYExplanation")}</p>
            <div className="mt-5">
              <strong>{t("Airdrop.percentageToDeposit")}</strong>
              <div className="mt-5">
                <FormSliderInput defaultValue={percentageToDeposit * 100} onChange={(val) => setPercentageToDeposit(val / 100)} />
              </div>
            </div>

            <div className="deposit-amount">
              <div className="top-section">
                <p>{t("Airdrop.amountToDeposit")}</p>
                {vaultApy && vaultApy.length > 0 && (
                  <ApyPill>
                    <div className="content-apy">
                      {t("apy")} <span>{`${numberWithThousandSeparator(vaultApy[0]?.apy)}%`}</span>
                    </div>
                    <div className="bg" />
                  </ApyPill>
                )}
              </div>

              <div className="amount-to-deposit">
                {millify(depositableAmount * percentageToDeposit || 0, { precision: 2 })} $HAT
              </div>
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: t("depositBountyWarning", {
                  maxBounty: +(vaultToDeposit.maxBounty ?? 0) / 100,
                  withdrawPeriod: moment.duration(vaultToDeposit.master.withdrawPeriod, "seconds").humanize(),
                }),
              }}
            />
          </div>
        )}
      </div>

      {!isReceiverConnected && (
        <Alert type="error" className="mt-5">
          {t("Airdrop.wrongAddressConnectedError", { wallet: shortenAddress(addressToCheck, { startLength: 6 }) })}
        </Alert>
      )}
      <div className="buttons">
        <Button styleType="outlined" size="medium" onClick={prevStep}>
          <BackArrowIcon />
        </Button>
        <Button
          size="medium"
          bigHorizontalPadding
          onClick={() => handleClaimAirdrops(percentageToDeposit, VAULT_TO_DEPOSIT)}
          disabled={!isReceiverConnected}
        >
          {percentageToDeposit > 0 ? t("Airdrop.claimAndDeposit") : t("Airdrop.claim")}
        </Button>
      </div>
    </div>
  );
};
