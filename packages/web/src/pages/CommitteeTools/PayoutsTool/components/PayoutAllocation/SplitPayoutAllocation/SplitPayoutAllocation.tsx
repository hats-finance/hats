import { IPayoutResponse, ISplitPayoutData, IVault, createNewSplitPayoutBeneficiary } from "@hats-finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/AddOutlined";
import { Button } from "components";
import { useEnhancedFormContext } from "hooks/form";
import millify from "millify";
import { useContext, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getSplitPayoutDataYupSchema } from "../../../PayoutFormPage/formSchema";
import { PayoutFormContext } from "../../../PayoutFormPage/store";
import { useSinglePayoutAllocation } from "../SinglePayoutAllocation/useSinglePayoutAllocation";
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
  const { severitiesOptions, vault, payout } = useContext(PayoutFormContext);

  return <SplitPayoutAllocationShared severitiesOptions={severitiesOptions} vault={vault} payout={payout} />;
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
        severitiesOptions={(payout?.payoutData as ISplitPayoutData).beneficiaries.map((ben) => ({
          label: ben.severity,
          value: ben.severity,
        }))}
      />
    </FormProvider>
  );
};

type SplitPayoutAllocationSharedProps = {
  payout?: IPayoutResponse;
  vault?: IVault;
  readOnly?: boolean;
  severitiesOptions:
    | {
        label: string;
        value: string;
      }[]
    | undefined;
};

function SplitPayoutAllocationShared({ vault, payout, readOnly, severitiesOptions }: SplitPayoutAllocationSharedProps) {
  const { t } = useTranslation();

  const methods = useEnhancedFormContext<ISplitPayoutData>();
  const { control } = methods;
  const {
    fields: beneficiaries,
    append: appendBeneficiary,
    remove: removeBeneficiary,
  } = useFieldArray({ control, name: `beneficiaries` });

  const [showGeneralAllocation, setShowGeneralAllocation] = useState(false);
  const watchedBeneficiaries = useWatch({ control, name: `beneficiaries` });
  const percentageToPayOfTheVault = useWatch({ control, name: `percentageToPay` });

  /**
   * These calculations are for the general payout. A split payout behind the scenes is a single payout with a payment
   * splitter as the beneficiary. The allocation calculation for each individual beneficiary is done on the component
   * `SplitPayoutBeneficiaryForm.tsx`
   */
  const generalPayoutAllocation = useSinglePayoutAllocation(vault, payout, percentageToPayOfTheVault);

  const severitiesSummary = useMemo(
    () =>
      severitiesOptions?.map((severity, idx) => {
        const severityAmount = watchedBeneficiaries.reduce((acc, beneficiary) => {
          if (beneficiary.severity === severity.value) return acc + 1;
          return acc;
        }, 0);

        return {
          label: severity.label,
          amount: severityAmount || "--",
        };
      }),
    [watchedBeneficiaries, severitiesOptions]
  );

  const sumPercentagesPayout = useMemo(
    () =>
      watchedBeneficiaries?.reduce((acc, beneficiary) => {
        if (beneficiary.percentageOfPayout) return acc + Number(beneficiary.percentageOfPayout);
        return acc;
      }, 0),
    [watchedBeneficiaries]
  );

  const totalPayoutAmount = useMemo(() => {
    if (!generalPayoutAllocation.totalAmount) return undefined;
    return `≈ ${generalPayoutAllocation.totalAmount?.tokens} ~ ${generalPayoutAllocation.totalAmount?.usd}`;
  }, [generalPayoutAllocation]);

  const totalHackerAmount = useMemo(() => {
    if (!generalPayoutAllocation.totalHackerAmount) return undefined;
    return `≈ ${generalPayoutAllocation.totalHackerAmount?.tokens} ~ ${generalPayoutAllocation.totalHackerAmount?.usd}`;
  }, [generalPayoutAllocation]);

  const totalCommitteeAmount = useMemo(() => {
    if (!generalPayoutAllocation.committeeAmount) return undefined;
    return `≈ ${generalPayoutAllocation.committeeAmount?.tokens} ~ ${generalPayoutAllocation.committeeAmount?.usd}`;
  }, [generalPayoutAllocation]);

  const totalGovernanceAmount = useMemo(() => {
    if (!generalPayoutAllocation.governanceAmount) return undefined;
    return `≈ ${generalPayoutAllocation.governanceAmount?.tokens} ~ ${generalPayoutAllocation.governanceAmount?.usd}`;
  }, [generalPayoutAllocation]);

  return (
    <>
      <StyledBeneficiariesTable className="mt-4 mb-5" role="table">
        <SplitPayoutBeneficiaryForm index={-1} />
        {beneficiaries.map((beneficiary, idx) => (
          <SplitPayoutBeneficiaryForm
            readOnly={readOnly}
            key={beneficiary.id}
            index={idx}
            beneficiariesCount={beneficiaries.length}
            remove={removeBeneficiary}
          />
        ))}
      </StyledBeneficiariesTable>

      {!readOnly && (
        <Button styleType="invisible" onClick={() => appendBeneficiary(createNewSplitPayoutBeneficiary())}>
          <AddIcon />
          {t("Payouts.addBeneficiary")}
        </Button>
      )}

      {sumPercentagesPayout !== 100 && <p className="error mt-4">{t("Payouts.sumPercentagesPayoutShouldBe100")}</p>}
      <StyledSplitPayoutSummary className="mt-3">
        <div className={`item ${sumPercentagesPayout && sumPercentagesPayout !== 100 ? "error" : ""}`}>
          <p>{t("Payouts.sumPercentageOfThePayout")}:</p>
          <p>{sumPercentagesPayout ? `${millify(sumPercentagesPayout, { precision: 2 })}%` : "--"}</p>
        </div>
        <div className="item">
          <p>{t("Payouts.totalNumberPayouts")}:</p>
          <p>{beneficiaries.length}</p>
        </div>
        <div className="item bold">
          <p onClick={() => setShowGeneralAllocation((prev) => !prev)}>
            {t("Payouts.totalPayoutAmount")}: <span>{showGeneralAllocation ? `[${t("seeLess")}]` : `[${t("seeMore")}]`}</span>
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
