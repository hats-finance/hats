import { IPayoutResponse, ISplitPayoutData, IVault } from "@hats-finance/shared";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import MoreIcon from "@mui/icons-material/MoreVertOutlined";
import { DropdownSelector, FormInput, FormSelectInput, FormSelectInputOption, Modal } from "components";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/form";
import useModal from "hooks/useModal";
import { useOnChange } from "hooks/usePrevious";
import { useState } from "react";
import { Controller, UseFieldArrayRemove, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SinglePayoutAllocation } from "../../SinglePayoutAllocation/SinglePayoutAllocation";
import { usePayoutAllocation } from "../../usePayoutAllocation";
import { StyledSplitPayoutBeneficiaryAllocationModal, StyledSplitPayoutBeneficiaryForm } from "../styles";

type SplitPayoutBeneficiaryFormProps = {
  index: number;
  beneficiariesCount?: number;
  remove?: UseFieldArrayRemove;
  readOnly?: boolean;
  vault?: IVault;
  payout?: IPayoutResponse;
  isPayoutCreated?: boolean;
  severitiesOptions?: FormSelectInputOption[] | undefined;
};

export const SplitPayoutBeneficiaryForm = ({
  index,
  beneficiariesCount,
  remove,
  readOnly,
  vault,
  payout,
  isPayoutCreated,
  severitiesOptions,
}: SplitPayoutBeneficiaryFormProps) => {
  const { t } = useTranslation();

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const { isShowing: isShowingAllocation, show: showAllocation, hide: hideAllocation } = useModal();

  const { register, control, setValue } = useEnhancedFormContext<ISplitPayoutData>();
  const isHeader = index === -1;

  const percentageToPayOfTheVault = useWatch({ control, name: `percentageToPay` });
  const percentageOfPayout = useWatch({ control, name: `beneficiaries.${index}.percentageOfPayout` });

  const payoutAllocation = usePayoutAllocation(vault, payout, percentageToPayOfTheVault, percentageOfPayout);

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

  const getMoreOptions = () => {
    if (beneficiariesCount === undefined) return [];
    if (beneficiariesCount > 1 && !readOnly && !isPayoutCreated) {
      if (payoutAllocation.totalAmount === undefined) {
        return [
          {
            icon: <DeleteIcon />,
            label: t("remove"),
            onClick: () => remove?.(index),
          },
        ];
      } else {
        return [
          {
            icon: <InfoIcon />,
            label: t("Payouts.allocationInfo"),
            onClick: showAllocation,
          },
          {
            icon: <DeleteIcon />,
            label: t("remove"),
            onClick: () => remove?.(index),
          },
        ];
      }
    }

    if (payoutAllocation.totalAmount === undefined) return [];

    return [
      {
        icon: <InfoIcon />,
        label: t("Payouts.allocationInfo"),
        onClick: showAllocation,
      },
    ];
  };

  return (
    <>
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
              disabled={isPayoutCreated && !readOnly}
              readOnly={readOnly}
              colorable={!readOnly}
              noMargin
            />
          )}
        </div>
        <div className="cell big" role="cell">
          {isHeader ? (
            t("severity")
          ) : (
            <Controller
              control={control}
              name={`beneficiaries.${index}.severity`}
              render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
                <FormSelectInput
                  disabled={isPayoutCreated && !readOnly}
                  readOnly={readOnly}
                  isDirty={getCustomIsDirty<ISplitPayoutData>(field.name, dirtyFields, defaultValues)}
                  error={error}
                  placeholder={t("severity")}
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
              disabled={isPayoutCreated && !readOnly}
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
              value={payoutAllocation.totalAmount ? `≈ ${payoutAllocation.totalAmount.tokens.number}` : "--"}
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
              value={payoutAllocation.totalAmount ? `≈ ${payoutAllocation.totalAmount.usd.formatted}` : "--"}
            />
          )}
        </div>
        {getMoreOptions().length > 0 && (
          <div className="cell" role="cell">
            {isHeader ? "" : <MoreIcon className="more-icon" onClick={() => setShowMoreOptions(true)} />}
            <DropdownSelector options={getMoreOptions()} show={showMoreOptions} onClose={() => setShowMoreOptions(false)} />
          </div>
        )}
      </StyledSplitPayoutBeneficiaryForm>

      <Modal isShowing={isShowingAllocation} title={t("Payouts.payoutAllocationAndNft")} onHide={hideAllocation} newStyles>
        <StyledSplitPayoutBeneficiaryAllocationModal>
          <SinglePayoutAllocation
            noArrow
            vault={vault}
            payout={payout}
            selectedSeverity={selectedSeverityData}
            percentageToPay={percentageToPayOfTheVault}
            percentageOfPayout={percentageOfPayout}
          />
        </StyledSplitPayoutBeneficiaryAllocationModal>
      </Modal>
    </>
  );
};
