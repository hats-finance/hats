import { ISplitPayoutData } from "@hats-finance/shared";
import MoreIcon from "@mui/icons-material/MoreVertOutlined";
import { FormInput, FormSelectInput } from "components";
import { BigNumber } from "ethers";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/form";
import { useVaults } from "hooks/vaults/useVaults";
import millify from "millify";
import { useContext, useMemo } from "react";
import { Controller, UseFieldArrayRemove, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Amount } from "utils/amounts.utils";
import { PayoutFormContext } from "../../../store";
import { StyledBeneficiaryRowForm } from "../styles";

type BeneficiaryRowFormProps = {
  index: number;
  beneficiariesCount?: number;
  remove?: UseFieldArrayRemove;
};

export const BeneficiaryRowForm = ({ index, beneficiariesCount, remove }: BeneficiaryRowFormProps) => {
  const { t } = useTranslation();
  const { tokenPrices } = useVaults();
  const { payout, vault, isPayoutCreated, severitiesOptions } = useContext(PayoutFormContext);

  const { register, control } = useEnhancedFormContext<ISplitPayoutData>();
  const isHeader = index === -1;

  const percentageToPayOfTheVault = useWatch({ control, name: `percentageToPay` });
  const percentageOfPayout = useWatch({ control, name: `beneficiaries.${index}.percentageOfPayout` });

  const amountInTokens = useMemo(() => {
    if (!percentageToPayOfTheVault || !percentageOfPayout || !vault) return undefined;
    const vaultBalance = new Amount(BigNumber.from(vault.honeyPotBalance), vault.stakingTokenDecimals, vault.stakingTokenSymbol)
      .number;
    const amount = (((Number(percentageToPayOfTheVault) / 100) * Number(percentageOfPayout)) / 100) * vaultBalance;
    return amount;
  }, [percentageToPayOfTheVault, percentageOfPayout, vault]);

  const amountInUsd = useMemo(() => {
    if (!amountInTokens || !vault) return undefined;

    const tokenPrice = tokenPrices?.[vault?.stakingToken] ?? 0;
    return amountInTokens * tokenPrice;
  }, [amountInTokens, tokenPrices, vault]);

  console.log(amountInUsd);

  return (
    <StyledBeneficiaryRowForm isHeader={isHeader} role="rowgroup">
      <div className="cell" role="cell">
        {isHeader ? "#" : index + 1}
      </div>
      <div className="cell big" role="cell">
        {isHeader ? (
          t("Payouts.beneficiary")
        ) : (
          <FormInput
            {...register(`beneficiaries.${index}.beneficiary`)}
            placeholder={t("Payouts.beneficiary")}
            disabled={isPayoutCreated}
            colorable
            noMargin
          />
        )}
      </div>
      <div className="cell big" role="cell">
        {isHeader ? (
          t("Payouts.severity")
        ) : (
          <Controller
            control={control}
            name={`beneficiaries.${index}.severity`}
            render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
              <FormSelectInput
                disabled={isPayoutCreated}
                isDirty={getCustomIsDirty<ISplitPayoutData>(field.name, dirtyFields, defaultValues)}
                error={error}
                placeholder={t("Payouts.severity")}
                colorable
                options={severitiesOptions ?? []}
                noMargin
                {...field}
              />
            )}
          />
        )}
      </div>
      <div className="cell small" role="cell">
        {isHeader ? (
          t("Payouts.percentageToPayLabel")
        ) : (
          <FormInput
            {...register(`beneficiaries.${index}.percentageOfPayout`)}
            placeholder={t("Payouts.percentageToPayLabel")}
            disabled={isPayoutCreated}
            type="number"
            colorable
            noMargin
          />
        )}
      </div>
      <div className="cell small" role="cell">
        {isHeader ? (
          t("Payouts.tokensAmount", { token: vault?.stakingTokenSymbol })
        ) : (
          <FormInput
            disabled
            colorable
            noMargin
            value={`${amountInTokens !== undefined ? `≈ ${millify(amountInTokens, { precision: 5 })}` : "--"}`}
          />
        )}
      </div>
      <div className="cell small" role="cell">
        {isHeader ? (
          t("Payouts.amountInUsd")
        ) : (
          <FormInput
            disabled
            colorable
            noMargin
            value={`${amountInUsd !== undefined ? `≈ ${millify(amountInUsd, { precision: 2 })}` : "--"} $`}
          />
        )}
      </div>
      <div className="cell" role="cell">
        {isHeader ? "" : <MoreIcon />}
      </div>
    </StyledBeneficiaryRowForm>
  );
};
