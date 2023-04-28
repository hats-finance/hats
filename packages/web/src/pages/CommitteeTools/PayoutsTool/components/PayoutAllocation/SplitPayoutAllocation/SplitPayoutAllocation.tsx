import {
  IPayoutResponse,
  ISplitPayoutBeneficiary,
  ISplitPayoutData,
  IVault,
  createNewSplitPayoutBeneficiary,
} from "@hats-finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/AddOutlined";
import { Button } from "components";
import { BigNumber } from "ethers";
import { useEnhancedFormContext } from "hooks/form";
import { useVaults } from "hooks/vaults/useVaults";
import millify from "millify";
import { useContext, useMemo } from "react";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Amount } from "utils/amounts.utils";
import { getSplitPayoutDataYupSchema } from "../../../PayoutFormPage/formSchema";
import { PayoutFormContext } from "../../../PayoutFormPage/store";
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

  const { payouts, tokenPrices } = useVaults();

  const methods = useEnhancedFormContext<ISplitPayoutData>();
  const { control } = methods;
  const {
    fields: beneficiaries,
    append: appendBeneficiary,
    remove: removeBeneficiary,
  } = useFieldArray({ control, name: `beneficiaries` });

  const watchedBeneficiaries = useWatch({ control, name: `beneficiaries` });
  const percentageToPayOfTheVault = useWatch({ control, name: `percentageToPay` });

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
    if (!vault || !percentageToPayOfTheVault) return undefined;

    const tokenPrice = tokenPrices?.[vault?.stakingToken] ?? 0;
    // Check if this payout is already created on chain
    const payoutOnChainData = payouts?.find((p) => p.id === payout?.payoutClaimId);

    let amountInTokens = 0;
    if (payoutOnChainData?.approvedAt) {
      // If payout is already created on chain, we can use the data from the contract
      const totalSplit = new Amount(
        BigNumber.from(payoutOnChainData.hackerReward)
          .add(BigNumber.from(payoutOnChainData.hackerVestedReward))
          .add(BigNumber.from(payoutOnChainData.hackerHatReward))
          .add(BigNumber.from(payoutOnChainData.committeeReward))
          .add(BigNumber.from(payoutOnChainData.governanceHatReward)),
        vault.stakingTokenDecimals,
        vault.stakingTokenSymbol
      );

      amountInTokens = totalSplit.number;
    } else {
      const vaultBalance = new Amount(BigNumber.from(vault.honeyPotBalance), vault.stakingTokenDecimals, vault.stakingTokenSymbol)
        .number;

      amountInTokens = (Number(percentageToPayOfTheVault) / 100) * vaultBalance;
    }

    const amountInUsd = amountInTokens * tokenPrice;
    const tokensFormatted = millify(amountInTokens, { precision: 5 });
    const usdFormatted = millify(amountInUsd, { precision: 2 });
    return `≈ ${tokensFormatted}${vault.stakingTokenSymbol} ~ ${usdFormatted}$`;
  }, [percentageToPayOfTheVault, tokenPrices, vault, payout, payouts]);

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
        <div className="item">
          <p>{t("Payouts.totalPayoutAmount")}:</p>
          <p>{totalPayoutAmount ?? "--"}</p>
        </div>

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
