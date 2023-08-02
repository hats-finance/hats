import { IPayoutResponse, ISplitPayoutData, IVault, createNewSplitPayoutBeneficiary } from "@hats-finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/AddOutlined";
import { Alert, Button, FormInput, FormSelectInputOption } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useContext, useEffect, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getSplitPayoutDataYupSchema } from "../../../PayoutFormPage/formSchema";
import { PayoutFormContext } from "../../../PayoutFormPage/store";
import { hasSubmissionData } from "../../../utils/hasSubmissionData";
import { usePayoutAllocation } from "../usePayoutAllocation";
import { SplitPayoutBeneficiaryForm } from "./components/SplitPayoutBeneficiaryForm";
import { StyledBeneficiariesTable, StyledSplitPayoutSummary } from "./styles";

type SplitPayoutAllocationProps = {
  payout?: IPayoutResponse;
  vault?: IVault;
};

export const SplitPayoutAllocation = (props: SplitPayoutAllocationProps) => {
  return props.payout && props.vault ? (
    <SplitPayoutAllocationOnStatus payout={props.payout} vault={props.vault} />
  ) : (
    <SplitPayoutAllocationForm />
  );
};

const SplitPayoutAllocationForm = () => {
  const { severitiesOptions, vault, payout, isPayoutCreated } = useContext(PayoutFormContext);

  return (
    <SplitPayoutAllocationShared
      severitiesOptions={severitiesOptions}
      vault={vault}
      payout={payout}
      isPayoutCreated={isPayoutCreated}
    />
  );
};

const SplitPayoutAllocationOnStatus = ({ payout, vault }: SplitPayoutAllocationProps) => {
  const { t } = useTranslation();

  const methodsOnlyBeneficiaries = useForm<ISplitPayoutData>({
    defaultValues: payout?.payoutData as ISplitPayoutData,
    resolver: yupResolver(getSplitPayoutDataYupSchema(t, vault)),
    mode: "onChange",
  });

  return (
    <FormProvider {...methodsOnlyBeneficiaries}>
      <SplitPayoutAllocationShared
        payout={payout}
        vault={vault}
        readOnly
        isPayoutCreated
        severitiesOptions={(payout?.payoutData as ISplitPayoutData).beneficiaries.map((ben) => ({
          label: ben.severity.toLowerCase().replace("severity", "").trim(),
          value: ben.severity.toLowerCase(),
        }))}
      />
    </FormProvider>
  );
};

type SplitPayoutAllocationSharedProps = {
  payout?: IPayoutResponse;
  vault?: IVault;
  readOnly?: boolean;
  isPayoutCreated?: boolean;
  severitiesOptions: FormSelectInputOption[] | undefined;
};

function SplitPayoutAllocationShared({
  vault,
  payout,
  readOnly,
  severitiesOptions,
  isPayoutCreated,
}: SplitPayoutAllocationSharedProps) {
  const { t } = useTranslation();

  const methods = useEnhancedFormContext<ISplitPayoutData>();
  const { control, formState, register } = methods;
  const {
    fields,
    append: appendBeneficiary,
    remove: removeBeneficiary,
    replace,
  } = useFieldArray({ control, name: `beneficiaries` });
  const watchedBeneficiaries = useWatch({ control, name: `beneficiaries`, defaultValue: [] });
  const beneficiaries = fields.map((field, index) => {
    return {
      ...field,
      ...watchedBeneficiaries![index],
    };
  });

  // Sorting beneficiaries by severity
  useEffect(() => {
    const sortedBeneficiariesBySeverity = [...beneficiaries].sort((a, b) => {
      const sevIdxA = severitiesOptions?.findIndex((sev) => sev.value.toLowerCase() === a.severity.toLowerCase()) ?? -1;
      const sevIdxB = severitiesOptions?.findIndex((sev) => sev.value.toLowerCase() === b.severity.toLowerCase()) ?? -1;
      return sevIdxA === sevIdxB ? 0 : sevIdxA > sevIdxB ? -1 : 1;
    });

    if (JSON.stringify(sortedBeneficiariesBySeverity.map((b) => b.id)) === JSON.stringify(beneficiaries.map((b) => b.id))) return;
    replace(sortedBeneficiariesBySeverity);
  }, [beneficiaries, severitiesOptions, replace]);

  const [editPercentageToPay, setEditPercentageToPay] = useState(false);
  const [showGeneralAllocation, setShowGeneralAllocation] = useState(false);
  const percentageToPayOfTheVault = useWatch({ control, name: `percentageToPay` });

  const isFromSubmissions = hasSubmissionData(payout);

  /**
   * These calculations are for the general payout. A split payout behind the scenes is a single payout with a payment
   * splitter as the beneficiary. The allocation calculation for each individual beneficiary is done on the component
   * `SplitPayoutBeneficiaryForm.tsx`
   */
  const generalPayoutAllocation = usePayoutAllocation(vault, payout, percentageToPayOfTheVault);

  const severitiesSummary = useMemo(
    () =>
      severitiesOptions?.map((severity) => {
        const severityAmount = beneficiaries.reduce((acc, beneficiary) => {
          if (beneficiary.severity === severity.value) return acc + 1;
          return acc;
        }, 0);

        return {
          label: severity.label,
          amount: severityAmount || "--",
        };
      }),
    [beneficiaries, severitiesOptions]
  );

  const sumPercentagesPayout = useMemo(
    () =>
      +beneficiaries
        ?.reduce((acc, beneficiary) => {
          if (beneficiary.percentageOfPayout) return acc + Number(beneficiary.percentageOfPayout);
          return acc;
        }, 0)
        .toFixed(6),
    [beneficiaries]
  );

  const totalPayoutAmount = useMemo(() => {
    if (!generalPayoutAllocation.totalAmount) return undefined;
    return `≈ ${generalPayoutAllocation.totalAmount?.tokens.formatted} ~ ${generalPayoutAllocation.totalAmount?.usd.formatted}`;
  }, [generalPayoutAllocation]);

  const totalHackerAmount = useMemo(() => {
    if (!generalPayoutAllocation.totalHackerAmount) return undefined;
    return `≈ ${generalPayoutAllocation.totalHackerAmount?.tokens.formatted} ~ ${generalPayoutAllocation.totalHackerAmount?.usd.formatted}`;
  }, [generalPayoutAllocation]);

  const totalCommitteeAmount = useMemo(() => {
    if (!generalPayoutAllocation.committeeAmount) return undefined;
    return `≈ ${generalPayoutAllocation.committeeAmount?.tokens.formatted} ~ ${generalPayoutAllocation.committeeAmount?.usd.formatted}`;
  }, [generalPayoutAllocation]);

  const totalGovernanceAmount = useMemo(() => {
    if (!generalPayoutAllocation.governanceAmount) return undefined;
    return `≈ ${generalPayoutAllocation.governanceAmount?.tokens.formatted} ~ ${generalPayoutAllocation.governanceAmount?.usd.formatted}`;
  }, [generalPayoutAllocation]);

  return (
    <>
      <StyledBeneficiariesTable className="mt-4 mb-5" role="table">
        {beneficiaries.map((beneficiary, idx) => (
          <SplitPayoutBeneficiaryForm
            key={beneficiary.id}
            index={idx}
            beneficiariesCount={beneficiaries.length}
            remove={removeBeneficiary}
            readOnly={readOnly}
            vault={vault}
            payout={payout}
            severitiesOptions={severitiesOptions}
            isPayoutCreated={isPayoutCreated}
          />
        ))}
      </StyledBeneficiariesTable>

      {!readOnly && !isPayoutCreated && !isFromSubmissions && (
        <Button styleType="invisible" onClick={() => appendBeneficiary(createNewSplitPayoutBeneficiary())}>
          <AddIcon />
          {t("Payouts.addBeneficiary")}
        </Button>
      )}

      {sumPercentagesPayout !== 100 && (
        <p className="error mt-4">
          {t("Payouts.sumPercentagesPayoutShouldBe100", { missingPercentage: +(100 - sumPercentagesPayout).toFixed(6) })}
        </p>
      )}

      <StyledSplitPayoutSummary className="mt-4">
        {!isPayoutCreated && (
          <>
            <div className={`item ${sumPercentagesPayout && sumPercentagesPayout !== 100 ? "error" : ""}`}>
              <p>{t("Payouts.sumPercentageOfThePayout")}:</p>
              <p>{sumPercentagesPayout ? `${sumPercentagesPayout}%` : "--"}</p>
            </div>
            <hr />
          </>
        )}
        {(isFromSubmissions || isPayoutCreated) && (
          <div>
            {!isPayoutCreated && (
              <Button onClick={() => setEditPercentageToPay((prev) => !prev)} styleType="text" className="mb-2" noPadding>
                {t("editManually")}
              </Button>
            )}
            <div className={`item ${formState?.errors?.percentageToPay?.type.includes("is-percentage-between") ? "error" : ""}`}>
              <p>{t("Payouts.percentageOfTheVaultToPay")}:</p>
              {editPercentageToPay ? (
                <FormInput
                  {...register("percentageToPay")}
                  label={t("Payouts.percentageToPay")}
                  placeholder={t("Payouts.percentageToPayPlaceholder")}
                  helper={t("Payouts.percentageOfTheTotalVaultToPay")}
                  disabled={isPayoutCreated}
                  type="number"
                  colorable
                  className="w-40"
                />
              ) : (
                <p>{percentageToPayOfTheVault ? `${percentageToPayOfTheVault}%` : "--"}</p>
              )}
            </div>

            {formState?.errors?.percentageToPay && formState.errors.percentageToPay.type.includes("is-percentage-between") && (
              <Alert className="mt-3" type="error">
                {t("Payouts.cantPayMoreThanMaxBounty", { maxBounty: vault?.maxBounty ? Number(vault.maxBounty) / 100 : 100 })}
              </Alert>
            )}
            <hr className="mt-4" />
          </div>
        )}
        <div className="item">
          <p>{t("Payouts.totalNumberBeneficiaries")}:</p>
          <p>{beneficiaries.length}</p>
        </div>
        <div className="item bold">
          <p onClick={() => setShowGeneralAllocation((prev) => !prev)}>
            {t("Payouts.totalPayoutAmount")}:{" "}
            <span className="clicklable">{showGeneralAllocation ? `[${t("seeLess")}]` : `[${t("seeMore")}]`}</span>
          </p>
          <p>{totalPayoutAmount ?? "--"}</p>
        </div>
        {showGeneralAllocation && (
          <>
            {totalHackerAmount && (
              <div className="item light">
                <p>
                  - {t("Payouts.totalHackersPayment")} ({generalPayoutAllocation.totalHackerAmount?.percentage}):
                </p>
                <p>{totalHackerAmount}</p>
              </div>
            )}
            {totalCommitteeAmount && (
              <div className="item light">
                <p>
                  - {t("Payouts.totalCommitteePayment")} ({generalPayoutAllocation.committeeAmount?.percentage}):
                </p>
                <p>{totalCommitteeAmount}</p>
              </div>
            )}
            {totalGovernanceAmount && (
              <div className="item light">
                <p>
                  - {t("Payouts.totalGovernancePayment")} ({generalPayoutAllocation.governanceAmount?.percentage}):
                </p>
                <p>{totalGovernanceAmount}</p>
              </div>
            )}
          </>
        )}

        <div className="severities">
          {severitiesSummary?.map((severitySummary, idx) => (
            <div key={idx} className="severity">
              {severitySummary.label}: {severitySummary.amount ?? "--"}
            </div>
          ))}
        </div>
      </StyledSplitPayoutSummary>
    </>
  );
}
