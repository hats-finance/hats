import { IPayoutResponse, ISplitPayoutData, IVault } from "@hats.finance/shared";
import { WithTooltip } from "components";
import { useEnhancedFormContext } from "hooks/form";
import millify from "millify";
import { useWatch } from "react-hook-form";
import { appChains } from "settings";
import { shortenIfAddress } from "utils/addresses.utils";
import { StyledAdditionalBeneficiariesInfo } from "../styles";

type AdditionalBeneficiariesInfoProps = {
  payout?: IPayoutResponse;
  vault?: IVault;
};

export const AdditionalBeneficiariesInfo = ({ vault, payout }: AdditionalBeneficiariesInfoProps) => {
  const { control } = useEnhancedFormContext<ISplitPayoutData>();

  const totalToPay = +useWatch({ control, name: `percentageToPay` });
  const beneficiaries = useWatch({ control, name: `beneficiaries`, defaultValue: [] });

  if (!payout || !vault) return null;
  if (vault.version !== "v3") return null;
  if (isNaN(totalToPay) || totalToPay <= 0) return null;

  const hatsGovFee = +vault?.governanceHatRewardSplit / 100 / 100;
  const governancePercentage = totalToPay * hatsGovFee;
  const hackersPercentage = totalToPay * (1 - hatsGovFee);
  const depositorsPercentage = 100 - totalToPay;

  const hackersPoints = beneficiaries.reduce((acc, beneficiary) => acc + +beneficiary.percentageOfPayout, 0);
  const governancePoints = (governancePercentage * hackersPoints) / hackersPercentage;
  const depositorsPoints = (depositorsPercentage * hackersPoints) / hackersPercentage;

  if (isNaN(depositorsPercentage) && depositorsPercentage > 0) return null;
  const needToPayDepositors = !isNaN(depositorsPercentage) && depositorsPercentage > 0;
  const govWallet = vault.master.address ?? appChains[Number(vault.chainId)].govMultisig;

  return (
    <StyledAdditionalBeneficiariesInfo>
      <div className="section">
        <p className="title">
          Security Researchers{" "}
          <strong>
            {hackersPercentage.toFixed(2)}% ({hackersPoints.toFixed(6)} points)
          </strong>
        </p>
        <p>
          <span>{`${vault.stakingTokenSymbol} ${millify(
            (vault.amountsInfo?.depositedAmount?.tokens ?? 0) * (hackersPercentage / 100)
          )}`}</span>
          <span className="ml-2">
            (~${millify((vault.amountsInfo?.depositedAmount?.tokens ?? 0) * (hackersPercentage / 100))})
          </span>
        </p>
      </div>

      <div className="section">
        <p className="title">
          Governance fees{" "}
          <strong>
            {governancePercentage.toFixed(2)}% ({governancePoints.toFixed(6)} points)
          </strong>
        </p>
        <p>
          <span>
            <WithTooltip text={govWallet}>
              <span>{shortenIfAddress(govWallet)}</span>
            </WithTooltip>
          </span>
          <span className="ml-2">{`${vault.stakingTokenSymbol} ${millify(
            (vault.amountsInfo?.depositedAmount?.tokens ?? 0) * (governancePercentage / 100)
          )}`}</span>
          <span className="ml-2">
            (~${millify((vault.amountsInfo?.depositedAmount?.tokens ?? 0) * (governancePercentage / 100))})
          </span>
        </p>
      </div>

      {payout.payoutData.depositors && payout.payoutData.depositors.length > 0 && needToPayDepositors && (
        <div className="section">
          <p className="title">
            Depositors Information{" "}
            <strong>
              {depositorsPercentage.toFixed(2)}% ({depositorsPoints.toFixed(6)} points)
            </strong>
          </p>
          <div className="depositors-list">
            {payout?.payoutData?.depositors.map((depositor) => {
              const tokens =
                (vault.amountsInfo?.depositedAmount?.tokens ?? 0) * (depositorsPercentage / 100) * (depositor.ownership / 100);
              const usd =
                (vault.amountsInfo?.depositedAmount?.usd ?? 0) * (depositorsPercentage / 100) * (depositor.ownership / 100);

              return (
                <div className="depositor" key={depositor.address}>
                  <WithTooltip text={depositor.address}>
                    <p>{shortenIfAddress(depositor.address)}</p>
                  </WithTooltip>
                  <p>{depositor.ownership}% of shares</p>
                  <p>
                    <span>{`${vault.stakingTokenSymbol} ${millify(tokens)}`}</span>
                    <span className="ml-2">(~${millify(usd)})</span>
                    <span className="ml-2">({((depositorsPoints * depositor.ownership) / 100).toFixed(6)} points)</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </StyledAdditionalBeneficiariesInfo>
  );
};
