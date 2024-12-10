import { GithubIssue, GithubPR, IPayoutResponse, ISplitPayoutData, IVault } from "@hats.finance/shared";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import MoreIcon from "@mui/icons-material/MoreVertOutlined";
import { DropdownSelector, FormInput, FormSelectInput, FormSelectInputOption, Modal, Spinner } from "components";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/form";
import useModal from "hooks/useModal";
import { useOnChange } from "hooks/usePrevious";
import { hasSubmissionData } from "pages/CommitteeTools/PayoutsTool/utils/hasSubmissionData";
import { SubmissionCard } from "pages/CommitteeTools/SubmissionsTool/SubmissionsListPage/SubmissionCard";
import {
  getGhIssueFromSubmission,
  getGhPRFromSubmission,
  getGithubIssuesFromVault,
  getGithubPRsFromVault,
} from "pages/CommitteeTools/SubmissionsTool/submissionsService.api";
import { useVaultSubmissionsByKeystore } from "pages/CommitteeTools/SubmissionsTool/submissionsService.hooks";
import { useEffect, useState } from "react";
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

  const isFromSubmissions = hasSubmissionData(payout);
  const { data: committeeSubmissions, isLoading: isLoadingSubmission } = useVaultSubmissionsByKeystore(!isFromSubmissions);

  const { register, control, setValue } = useEnhancedFormContext<ISplitPayoutData>();
  const beneficiaries = useWatch({ control, name: `beneficiaries`, defaultValue: [] });
  const percentageToPayOfTheVault = useWatch({ control, name: `percentageToPay` });
  const percentageOfPayout = useWatch({ control, name: `beneficiaries.${index}.percentageOfPayout` });
  const usingPointingSystem = useWatch({ control, name: `usingPointingSystem` });
  const stopAutocalculation = useWatch({ control, name: `stopAutocalculation` });
  const constraints = useWatch({ control, name: `rewardsConstraints`, defaultValue: [] });

  const beneficiarySubmission = committeeSubmissions?.find((sub) => sub.subId === beneficiaries[index]?.submissionData?.subId);

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const { isShowing: isShowingAllocation, show: showAllocation, hide: hideAllocation } = useModal();

  const payoutAllocation = usePayoutAllocation(
    vault,
    payout,
    percentageToPayOfTheVault,
    percentageOfPayout,
    ((!payout || payout?.status) === "creating" ? beneficiaries : (payout!.payoutData as ISplitPayoutData).beneficiaries ?? [])
      .reduce((acc, curr) => acc + Number(curr.percentageOfPayout), 0)
      .toString()
  );

  const vaultSeverities = vault?.description?.severities ?? [];
  const selectedSeverityName = useWatch({ control, name: `beneficiaries.${index}.severity`, defaultValue: undefined });
  const selectedSeverityIndex = vaultSeverities.findIndex(
    (severity) => severity.name.toLowerCase() === selectedSeverityName?.toLowerCase()
  );
  const selectedSeverityData = selectedSeverityIndex !== -1 ? vaultSeverities[selectedSeverityIndex] : undefined;

  // Edit the payout percentage and NFT info based on the selected severity
  useOnChange(selectedSeverityName, (newSelected, prevSelected) => {
    if (!selectedSeverityData) return;
    if (newSelected === undefined) return;
    setValue(`beneficiaries.${index}.nftUrl`, selectedSeverityData["nft-metadata"].image as any, { shouldValidate: true });
  });

  // Change points when severity changes (points sysmtem only)
  const severity = useWatch({ control, name: `beneficiaries.${index}.severity` });
  useOnChange(severity, (newSelected, prevSelected) => {
    if (!usingPointingSystem) return;
    if (newSelected === undefined) return;
    if (newSelected === prevSelected) return;
    if (!constraints) return;
    if (stopAutocalculation) return;

    const sevInfo = constraints.find(
      (constraint) => constraint.severity.toLowerCase() === beneficiaries[index].severity.toLowerCase()
    );
    if (!sevInfo) return;

    const defaultPoints = sevInfo?.points ? `${sevInfo.points.value.first}` : "";
    setValue<any>(`beneficiaries.${index}.percentageOfPayout` as any, defaultPoints, { shouldValidate: true });
  });

  const [vaultGithubIssues, setVaultGithubIssues] = useState<GithubIssue[] | undefined>(undefined);
  const [vaultGithubPRs, setVaultGithubPRs] = useState<GithubPR[] | undefined>(undefined);
  const [isLoadingGH, setIsLoadingGH] = useState<boolean>(false);

  // Get information from github
  useEffect(() => {
    if (!beneficiarySubmission || !vault) return;
    if (vaultGithubIssues !== undefined || isLoadingGH) return;

    const loadGhIssues = async () => {
      setIsLoadingGH(true);
      const ghIssues = await getGithubIssuesFromVault(vault);
      setVaultGithubIssues(ghIssues);
      setIsLoadingGH(false);
    };
    loadGhIssues();

    const loadGhPRs = async () => {
      const ghPRs = await getGithubPRsFromVault(vault);
      setVaultGithubPRs(ghPRs);
    };
    loadGhPRs();
  }, [vault, vaultGithubIssues, beneficiarySubmission, isLoadingGH]);

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
    <div>
      <div className="mb-1">{index + 1}.</div>
      <StyledSplitPayoutBeneficiaryForm>
        <div className="beneficiary">
          {isFromSubmissions && (beneficiaries[index]?.decryptedSubmission || beneficiarySubmission) ? (
            <div className="w-100">
              <p className="title mb-3">{t("Payouts.submissionDetails")}</p>
              <SubmissionCard
                inPayout
                submission={
                  isPayoutCreated ? beneficiaries[index]?.decryptedSubmission ?? beneficiarySubmission! : beneficiarySubmission!
                }
                ghIssue={
                  getGhIssueFromSubmission(
                    isPayoutCreated
                      ? beneficiaries[index]?.decryptedSubmission ?? beneficiarySubmission!
                      : beneficiarySubmission!,
                    vaultGithubIssues
                  ) ||
                  getGhPRFromSubmission(
                    isPayoutCreated
                      ? beneficiaries[index]?.decryptedSubmission ?? beneficiarySubmission!
                      : beneficiarySubmission!,
                    vaultGithubPRs,
                    vaultGithubIssues
                  )
                }
              />
            </div>
          ) : (
            <div className="input">
              <FormInput
                {...register(`beneficiaries.${index}.beneficiary`)}
                label={t("Payouts.beneficiary")}
                placeholder={t("Payouts.beneficiary")}
                disabled={
                  (isPayoutCreated && !readOnly) ||
                  (isFromSubmissions &&
                    (isLoadingSubmission || !!beneficiaries[index]?.decryptedSubmission || !!beneficiarySubmission))
                }
                readOnly={readOnly}
                colorable={!readOnly}
                noMargin
              />
              {isLoadingSubmission && <Spinner text={t("loadingSubmissionData")} />}
            </div>
          )}

          {getMoreOptions().length > 0 && (
            <div className="more-button">
              <MoreIcon className="more-icon" onClick={() => setShowMoreOptions(true)} />
              <DropdownSelector options={getMoreOptions()} show={showMoreOptions} onClose={() => setShowMoreOptions(false)} />
            </div>
          )}
        </div>

        <div className="form">
          <p className="title">{t("Payouts.payoutAllocation")}</p>

          <div className="controls">
            <Controller
              control={control}
              name={`beneficiaries.${index}.severity`}
              render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
                <FormSelectInput
                  disabled={isPayoutCreated && !readOnly}
                  readOnly={readOnly}
                  isDirty={getCustomIsDirty<ISplitPayoutData>(field.name, dirtyFields, defaultValues)}
                  error={error}
                  label={t("severity")}
                  placeholder={t("severity")}
                  colorable={!readOnly}
                  options={severitiesOptions ?? []}
                  noMargin
                  {...field}
                />
              )}
            />

            <FormInput
              {...register(`beneficiaries.${index}.percentageOfPayout`)}
              label={usingPointingSystem ? t("Payouts.points") : t("Payouts.percentageToPayLabel")}
              placeholder={usingPointingSystem ? t("Payouts.points") : t("Payouts.percentageToPayLabel")}
              // onKeyDown={!usingPointingSystem ? () => setValue<any>("stopAutocalculation", true) : undefined}
              onKeyDown={() => setValue<any>("stopAutocalculation", true)}
              disabled={isPayoutCreated && !readOnly}
              readOnly={readOnly}
              type="number"
              colorable={!readOnly}
              noMargin
            />

            <FormInput
              disabled
              noMargin
              label={t("Payouts.tokensAmount", { token: vault?.stakingTokenSymbol })}
              value={payoutAllocation.totalAmount ? `≈ ${payoutAllocation.totalAmount.tokens.number}` : "--"}
            />
            <FormInput
              disabled
              noMargin
              label={t("Payouts.amountInUsd")}
              value={payoutAllocation.totalAmount ? `≈ ${payoutAllocation.totalAmount.usd.formatted}` : "--"}
            />
          </div>
        </div>
      </StyledSplitPayoutBeneficiaryForm>

      <Modal isShowing={isShowingAllocation} title={t("Payouts.payoutAllocationAndNft")} onHide={hideAllocation}>
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
    </div>
  );
};
