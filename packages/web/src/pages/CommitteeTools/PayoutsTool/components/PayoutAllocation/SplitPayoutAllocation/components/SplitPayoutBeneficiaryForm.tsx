import { ISplitPayoutData } from "@hats-finance/shared";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import MoreIcon from "@mui/icons-material/MoreVertOutlined";
import { DropdownSelector, FormInput, FormSelectInput } from "components";
import { BigNumber } from "ethers";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/form";
import { useOnChange } from "hooks/usePrevious";
import { useVaults } from "hooks/vaults/useVaults";
import millify from "millify";
import { useContext, useMemo, useState } from "react";
import { Controller, UseFieldArrayRemove, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Amount } from "utils/amounts.utils";
import { PayoutFormContext } from "../../../../PayoutFormPage/store";
import { StyledSplitPayoutBeneficiaryForm } from "../styles";

type SplitPayoutBeneficiaryFormProps = {
  index: number;
  beneficiariesCount?: number;
  remove?: UseFieldArrayRemove;
  readOnly?: boolean;
};

export const SplitPayoutBeneficiaryForm = ({ index, beneficiariesCount, remove, readOnly }: SplitPayoutBeneficiaryFormProps) => {
  const { t } = useTranslation();
  const { tokenPrices } = useVaults();
  const { vault, isPayoutCreated, severitiesOptions } = useContext(PayoutFormContext);

  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const { register, control, setValue } = useEnhancedFormContext<ISplitPayoutData>();
  const isHeader = index === -1;

  const percentageToPayOfTheVault = useWatch({ control, name: `percentageToPay` });
  const percentageOfPayout = useWatch({ control, name: `beneficiaries.${index}.percentageOfPayout` });

  const vaultSeverities = vault?.description?.severities ?? [];
  const selectedSeverityName = useWatch({ control, name: `beneficiaries.${index}.severity`, defaultValue: undefined });
  const selectedSeverityIndex = vaultSeverities.findIndex(
    (severity) => severity.name.toLowerCase() === selectedSeverityName?.toLowerCase()
  );
  const selectedSeverityData = selectedSeverityIndex !== -1 ? vaultSeverities[selectedSeverityIndex] : undefined;

  // Edit the payout percentage and NFT info based on the selected severity
  useOnChange(selectedSeverityName, (newSelected, prevSelected) => {
    if (!selectedSeverityData) return;
    if (prevSelected === undefined || newSelected === undefined) return;
    setValue(`beneficiaries.${index}.nftUrl`, selectedSeverityData["nft-metadata"].image);
  });

  // The amount in tokens is calculated directly from the honeyPotBalance of the vault
  const amountInTokens = useMemo(() => {
    if (!percentageToPayOfTheVault || !percentageOfPayout || !vault) return undefined;

    const vaultBalance = new Amount(BigNumber.from(vault.honeyPotBalance), vault.stakingTokenDecimals, vault.stakingTokenSymbol)
      .number;
    const amount = (Number(percentageToPayOfTheVault) / 100) * (Number(percentageOfPayout) / 100) * vaultBalance;
    return amount;
  }, [percentageToPayOfTheVault, percentageOfPayout, vault]);

  // The amount in USD is calculated from the amount in tokens and the token price
  const amountInUsd = useMemo(() => {
    if (!amountInTokens || !vault) return undefined;

    const tokenPrice = tokenPrices?.[vault?.stakingToken] ?? 0;
    return amountInTokens * tokenPrice;
  }, [amountInTokens, tokenPrices, vault]);

  const getMoreOptions = () => {
    if (beneficiariesCount === undefined) return [];
    if (beneficiariesCount > 1 && !readOnly) {
      return [
        {
          icon: <InfoIcon />,
          label: t("Payouts.allocationInfo"),
          onClick: () => {},
        },
        {
          icon: <DeleteIcon />,
          label: t("remove"),
          onClick: () => remove?.(index),
        },
      ];
    }

    return [
      {
        icon: <InfoIcon />,
        label: t("Payouts.allocationInfo"),
        onClick: () => {},
      },
    ];
  };

  return (
    <StyledSplitPayoutBeneficiaryForm isHeader={isHeader} role="rowgroup">
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
            readOnly={readOnly}
            colorable={!readOnly}
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
                readOnly={readOnly}
                isDirty={getCustomIsDirty<ISplitPayoutData>(field.name, dirtyFields, defaultValues)}
                error={error}
                placeholder={t("Payouts.severity")}
                colorable={!readOnly}
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
            readOnly={readOnly}
            type="number"
            colorable={!readOnly}
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
            noMargin
            value={`${amountInUsd !== undefined ? `≈ ${millify(amountInUsd, { precision: 2 })}` : "--"}$`}
          />
        )}
      </div>
      <div className="cell" role="cell">
        {isHeader ? "" : <MoreIcon className="more-icon" onClick={() => setShowMoreOptions(true)} />}
        <DropdownSelector options={getMoreOptions()} show={showMoreOptions} onClose={() => setShowMoreOptions(false)} />
      </div>
    </StyledSplitPayoutBeneficiaryForm>
  );
};
