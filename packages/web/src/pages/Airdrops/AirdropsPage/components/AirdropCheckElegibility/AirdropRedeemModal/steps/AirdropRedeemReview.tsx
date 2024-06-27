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

export const AirdropRedeemReview = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const { allVaults } = useVaults();
  const vaultToDeposit = allVaults?.find((vault) => vault.id === VAULT_TO_DEPOSIT);
  const vaultApy = useVaultApy(vaultToDeposit);

  const [percentageToDeposit, setPercentageToDeposit] = useState<number>(0);

  const { prevStep, addressToCheck, airdropsElegibility, airdropsData, handleClaimAirdrops, onlyTokenLocks } =
    useContext(AirdropRedeemModalContext);

  if (airdropsElegibility.some((airdrop) => !airdrop || !airdrop.eligible)) return null;

  const isReceiverConnected = addressToCheck.toLowerCase() === address?.toLowerCase();
  const totalElegibility = airdropsElegibility.reduce(
    (prev, airdrop) => prev.add(BigNumber.from((airdrop as AirdropElegibility).total)),
    BigNumber.from(0)
  );

  const depositableAmount = new Amount(
    airdropsElegibility.reduce(
      (prev, airdrop, i) => prev.add(!airdropsData[i].isLocked ? BigNumber.from((airdrop as AirdropElegibility).total) : 0),
      BigNumber.from(0)
    ),
    18
  ).number;

  return (
    <div className="content-modal">
      {onlyTokenLocks && <img className="banner" src={require("assets/images/hats_vault.png")} alt="hats claim" />}
      <h2 style={{ textAlign: "left" }}>
        {t("Airdrop.lastStep")}
        <br />
        {onlyTokenLocks ? t("Airdrop.lastStepDescTokenLocks") : t("Airdrop.lastStepDesc")}
      </h2>

      <div>
        <ul className="mb-5">
          {airdropsData.map((airdrop, i) => {
            const elegibility = airdropsElegibility[i];
            if (!elegibility) return null;

            const total = new Amount(BigNumber.from(elegibility.total), 18, "$HAT").formatted();
            const daysLocked = moment(airdrop.lockEndDate).format("MMMM Do 24'");

            return (
              <li>
                <strong>{airdrop.descriptionData.name}:</strong> {total}
                {"\n"}
                {airdrop.isLocked ? t("Airdrop.linearlyReleasedUntil", { date: daysLocked }) : t("Airdrop.immediatelyReleased")}
              </li>
            );
          })}
        </ul>
        <p className="mt-3">
          {t("Airdrop.totalElegibility")}: {shortenIfAddress(addressToCheck, { startLength: 6 })}
        </p>
        <FormInput
          prefixIcon={<img src={HatsTokenIcon} alt="$HAT token" width={32} height={32} className="mt-1" />}
          className="mt-2"
          readOnly
          value={new Amount(totalElegibility, 18, "$HAT").formatted()}
        />

        {!onlyTokenLocks && vaultToDeposit && (
          <div className="mt-2">
            <h3>{t("Airdrop.depositRedeemedTokensExplanation")}</h3>
            <div>
              <p className="mt-3">{t("Airdrop.percentageToDeposit")}</p>
              <div className="mt-5">
                <FormSliderInput onChange={(val) => setPercentageToDeposit(val / 100)} />
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

        {/* {airdropData.isLocked && (
          <div className="locked-info">
            <div className="locked-amount">
              <p>{t("Airdrop.linearlyReleased")}:</p>
              <div className="locked-amount-token">
                <img src={HatsTokenIcon} alt="$HAT token" width={32} height={32} className="mt-1" />
                <strong>{new Amount(BigNumber.from(airdropElegibility.total), 18).formatted()}</strong>
                <p>$HAT</p>
              </div>
            </div>
            <p className="explanation">
              {t("Airdrop.linearlyReleasedExplanation", {
                daysLocked: moment(airdropData.lockEndDate).fromNow(true),
              })}
            </p>
          </div>
        )} */}

        {/* <div className="mt-5">
          <CollapsableTextContent title={t("Airdrop.elegibilityCriteriaBreakdown")} noContentPadding inverseArrow>
            <div className="elegibility-breakdown">
              <div className="breakdown">
                {Object.keys(airdropElegibility)
                  .filter((k) => !["info", "total", "eligible"].includes(k))
                  .map((k) => {
                    const eligible = BigNumber.from(airdropElegibility[k]).gt(0);
                    return (
                      <div className={`breakdown-item ${eligible ? "eligible" : ""}`} key={k}>
                        <div className="left">
                          <span className="check">{eligible ? "✓" : "✗"}</span>
                          <span className="name">{t(`Airdrop.${k}`)}</span>
                        </div>
                        <span className="amount">
                          {new Amount(BigNumber.from(airdropElegibility[k]), 18, "$HAT").formatted()}
                        </span>
                      </div>
                    );
                  })}
              </div>
              <div className="total">
                <span>{t("total")}</span>
                <span>{new Amount(BigNumber.from(airdropElegibility.total), 18, "$HAT").formatted()}</span>
              </div>
            </div>
          </CollapsableTextContent>
        </div> */}
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
