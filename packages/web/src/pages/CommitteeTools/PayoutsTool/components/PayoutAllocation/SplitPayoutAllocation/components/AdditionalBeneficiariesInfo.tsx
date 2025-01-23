import { IPayoutResponse, ISplitPayoutData, IVault } from "@hats.finance/shared";
import { WithTooltip } from "components";
import { useEnhancedFormContext } from "hooks/form";
import millify from "millify";
import { useWatch } from "react-hook-form";
import { appChains } from "settings";
import { shortenIfAddress } from "utils/addresses.utils";
import { StyledAdditionalBeneficiariesInfo } from "../styles";

function truncate(num: number, fixed: number) {
  const regex = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(regex)?.[0] ?? num.toString();
}

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

  const curator = payout.payoutData.curator;

  const hatsGovFeeTotal = +vault?.governanceHatRewardSplit / 100 / 100;
  const hatsManagementFee = vault?.description?.parameters.hatsManagementGovPercentage
    ? +vault?.description?.parameters.hatsManagementGovPercentage / 100
    : 0;
  const hatsFeePerRewards = hatsGovFeeTotal - hatsManagementFee;

  const totalToPayToUse = totalToPay / 100;

  const hatsRewardsFee = totalToPayToUse * hatsFeePerRewards;
  const hackers = totalToPayToUse * (1 - (hatsFeePerRewards + hatsManagementFee));

  const initialGovernancePercentage = +(hatsManagementFee * 100 + hatsRewardsFee * 100).toFixed(2);

  const hackersPercentage = +(hackers * 100).toFixed(2);
  const governancePercentage = curator
    ? initialGovernancePercentage * (1 - curator.percentage / 100)
    : initialGovernancePercentage;
  const curatorPercentage = curator ? initialGovernancePercentage * (curator.percentage / 100) : 0;
  const depositorsPercentage = 100 - governancePercentage - hackersPercentage;

  const hackersPoints = beneficiaries.reduce((acc, beneficiary) => acc + +beneficiary.percentageOfPayout, 0);
  const governancePoints = (governancePercentage * hackersPoints) / hackersPercentage;
  const curatorPoints = (curatorPercentage * hackersPoints) / hackersPercentage;
  const depositorsPoints = (depositorsPercentage * hackersPoints) / hackersPercentage;

  const needToPayDepositors = !isNaN(depositorsPercentage) && depositorsPercentage > 0;
  const govWallet = appChains[Number(vault.chainId)].govMultisig;

  return (
    <StyledAdditionalBeneficiariesInfo>
      <div className="section">
        <p className="title">
          Security Researchers{" "}
          <strong>
            {hackersPercentage.toFixed(2)}% ({(+truncate(hackersPoints, 4) * 10 ** 10).toFixed(0)} points)
          </strong>
        </p>
        <p>
          <span>{`${vault.stakingTokenSymbol} ${millify(
            (vault.amountsInfo?.depositedAmount?.tokens ?? 0) * (hackersPercentage / 100)
          )}`}</span>
        </p>
      </div>

      <div className="section">
        <p className="title">
          Governance fees [managed: {(hatsManagementFee * 100).toFixed(2)}% + rewards: {(hatsRewardsFee * 100).toFixed(2)}%]{" "}
          {"-> "}
          <strong>
            {governancePercentage.toFixed(2)}% ({(+truncate(governancePoints, 4) * 10 ** 10).toFixed(0)} points)
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
        </p>
      </div>

      {curator && (
        <div className="section">
          <p className="title">
            Curator{" "}
            <strong>
              {curatorPercentage.toFixed(2)}% ({(+truncate(curatorPoints, 4) * 10 ** 10).toFixed(0)} points)
            </strong>
          </p>
          <div className="depositors-list">
            <div className="depositor" key={curator.address}>
              <WithTooltip text={curator.address}>
                <p>{shortenIfAddress(curator.address)}</p>
              </WithTooltip>
              <p>
                - {curator.role} - {curator.percentage}% of Hats Fees
              </p>
              <span className="ml-2">{`${vault.stakingTokenSymbol} ${millify(
                (vault.amountsInfo?.depositedAmount?.tokens ?? 0) * (curatorPercentage / 100)
              )}`}</span>
            </div>
          </div>
        </div>
      )}

      {payout.payoutData.depositors && payout.payoutData.depositors.length > 0 && needToPayDepositors && (
        <div className="section">
          <p className="title">
            Depositors Information{" "}
            <strong>
              {depositorsPercentage.toFixed(2)}% ({(+truncate(depositorsPoints, 4) * 10 ** 10).toFixed(0)} points)
            </strong>
          </p>
          <div className="depositors-list">
            {payout?.payoutData?.depositors.map((depositor) => {
              const tokens =
                (vault.amountsInfo?.depositedAmount?.tokens ?? 0) * (depositorsPercentage / 100) * (depositor.ownership / 100);

              return (
                <div className="depositor" key={depositor.address}>
                  <WithTooltip text={depositor.address}>
                    <p>{shortenIfAddress(depositor.address)}</p>
                  </WithTooltip>
                  <p>{depositor.ownership}% of shares</p>
                  <p>
                    <span>{`${vault.stakingTokenSymbol} ${millify(tokens)}`}</span>
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
