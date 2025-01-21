import { IEditedVaultDescription, IVaultParameters } from "@hats.finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { Button, FormInput } from "components";
import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import { useEnhancedFormContext } from "hooks/form/useEnhancedFormContext";
import { useIsGovMember } from "hooks/useIsGovMember";
import { useIsGrowthMember } from "hooks/useIsGrowthMember";
import { useIsReviewer } from "hooks/useIsReviewer";
import Tooltip from "rc-tooltip";
import { useContext, useEffect, useState } from "react";
import { Control, FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toFixedIfNecessary } from "utils/amounts.utils";
import { getEditedDescriptionYupSchema } from "../../formSchema";
import { VaultEditorFormContext } from "../../store";
import { StyledVaultEditorForm } from "../../styles";
import { StyledTotalSplittedPercentage, StyledVaultParametersForm } from "./styles";

type VaultParametersFormProps = {
  statusCardFormDefaultData?: { parameters: IVaultParameters };
  onSubmit?: (data: { parameters: IVaultParameters }) => void;
};

type FormType = { parameters: IVaultParameters } | IEditedVaultDescription;

export const VaultParametersForm = (props: VaultParametersFormProps) => {
  return props.statusCardFormDefaultData ? <VaultParametersFormStatusCard {...props} /> : <VaultParametersFormOnVaultEditor />;
};

const VaultParametersFormStatusCard = ({ statusCardFormDefaultData, onSubmit }: VaultParametersFormProps) => {
  const { t } = useTranslation();

  const methodsOnlyParameters = useForm<{ parameters: IVaultParameters }>({
    defaultValues: statusCardFormDefaultData,
    resolver: yupResolver(getEditedDescriptionYupSchema(t)),
    mode: "onChange",
  });

  useEffect(() => {
    methodsOnlyParameters.reset(statusCardFormDefaultData);
  }, [statusCardFormDefaultData, methodsOnlyParameters]);

  const submitForm = async () => {
    const data = methodsOnlyParameters.getValues();
    const isValid = await methodsOnlyParameters.trigger("parameters");

    if (onSubmit && isValid) onSubmit(data);
  };

  const disabled = !methodsOnlyParameters.formState.isDirty;

  return (
    <FormProvider {...methodsOnlyParameters}>
      <VaultParametersFormShared blockMaxBounty />
      <Button disabled={disabled} className="status-card__button" onClick={submitForm}>
        {t("changeVaultParameters")}
      </Button>
    </FormProvider>
  );
};

const VaultParametersFormOnVaultEditor = () => {
  const { allFormDisabled } = useContext(VaultEditorFormContext);

  return <VaultParametersFormShared disabled={allFormDisabled} />;
};

function VaultParametersFormShared({ blockMaxBounty, disabled = false }: { blockMaxBounty?: boolean; disabled?: boolean }) {
  const { t } = useTranslation();
  const methodsToUse = useEnhancedFormContext<FormType>();

  const [isEditingFixed, setIsEditingFixed] = useState(false);

  const isGov = useIsGovMember();
  const isReviewer = useIsReviewer();
  const isGrowthMember = useIsGrowthMember();
  const canEditFixed = isGov || isReviewer || isGrowthMember;

  const version = useWatch({ control: methodsToUse.control as Control<FormType>, name: "version" });

  const vestedPercentage =
    useWatch({ control: methodsToUse.control as Control<FormType>, name: "parameters.vestedPercentage" }) ?? 0;
  const committeePercentage =
    useWatch({ control: methodsToUse.control as Control<FormType>, name: "parameters.committeePercentage" }) ?? 0;
  const immediatePercentage =
    useWatch({ control: methodsToUse.control as Control<FormType>, name: "parameters.immediatePercentage" }) ?? 0;

  const committeeControlledSplit = useWatch({
    control: methodsToUse.control as Control<FormType>,
    name: "parameters.fixedCommitteeControlledPercetange",
  })?.toString();
  const hatsGovernanceSplit = useWatch({
    control: methodsToUse.control as Control<FormType>,
    name: "parameters.fixedHatsGovPercetange",
  })?.toString();
  const hatsManagementSplit = useWatch({
    control: methodsToUse.control as Control<FormType>,
    name: "parameters.hatsManagementGovPercentage",
  })?.toString();
  const hatsRewardSplit = useWatch({
    control: methodsToUse.control as Control<FormType>,
    name: "parameters.fixedHatsRewardPercetange",
  })?.toString();

  useEffect(() => {
    if (hatsGovernanceSplit && hatsRewardSplit)
      methodsToUse.setValue(
        "parameters.fixedCommitteeControlledPercetange",
        100 - +hatsGovernanceSplit.toString() - +hatsRewardSplit.toString()
      );
  }, [hatsGovernanceSplit, hatsRewardSplit, methodsToUse]);

  const vestedPercentagePreview = +vestedPercentage.toString() * (+(committeeControlledSplit as string) / 100);
  const committeePercentagePreview = +committeePercentage.toString() * (+(committeeControlledSplit as string) / 100);
  const immediatePercentagePreview = +immediatePercentage.toString() * (+(committeeControlledSplit as string) / 100);

  const percentagesSum = +vestedPercentage.toString() + +committeePercentage.toString() + +immediatePercentage.toString();

  const revalidateSplit = () => {
    methodsToUse.trigger(["parameters.committeePercentage", "parameters.immediatePercentage", "parameters.vestedPercentage"]);
  };

  const renderWithTooltip = (text: string, children: JSX.Element) => (
    <Tooltip placement="top" overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE as any} overlay={text} mouseLeaveDelay={0}>
      {children}
    </Tooltip>
  );

  return (
    <StyledVaultEditorForm withoutMargin noPadding>
      <StyledVaultParametersForm>
        {canEditFixed && (
          <>
            <p className="section-title">{t("maxBounty")}</p>
            <div
              className="helper-text"
              dangerouslySetInnerHTML={{ __html: t("vaultEditorMaxBountyExplanation", { max: version === "v3" ? "100" : "90" }) }}
            />

            <div className="input">
              <FormInput
                {...methodsToUse.register(`parameters.maxBountyPercentage`, { valueAsNumber: true })}
                disabled={(blockMaxBounty || disabled || !canEditFixed) && version === "v3"}
                type="whole-number"
                label={t("VaultEditor.vault-parameters.maxBountyPercentage", { max: version === "v3" ? "100" : "90" })}
                placeholder={t("VaultEditor.vault-parameters.maxBountyPercentage-placeholder", {
                  max: version === "v3" ? "100" : "90",
                })}
                colorable
              />
            </div>
          </>
        )}

        <p className="section-title">{t("bountySplit")}</p>
        <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorBountySplitExplanation") }} />

        {canEditFixed && !disabled && (
          <Button onClick={() => setIsEditingFixed((prev) => !prev)} styleType="text" className="mb-4" noPadding>
            {t("editFeesAndRewards")}
          </Button>
        )}
        <div className="bountySplitContainer">
          <div className="committeeControlled">
            {renderWithTooltip(
              t("nonEditable"),
              <div className="splitFixedValue">
                <p>{committeeControlledSplit}%</p>
                <label>{t("committeeControlledSplit")}</label>
              </div>
            )}

            <div className="controlledSplitForm">
              <div className="split">
                <p />
                <div className="inputsContainer mb-2">
                  <p className="tiny">{t("splitWithPercentage")}</p>
                  <p className="tiny">{t("percentageOfVault")}</p>
                </div>
              </div>
              <div className="split">
                {renderWithTooltip(
                  t("immediateSplitExplanation"),
                  <p>
                    {t("immediate")} <InfoIcon fontSize="small" className="ml-2" />
                  </p>
                )}
                <div className="inputsContainer">
                  <div className="formInput">
                    <FormInput
                      {...methodsToUse.register("parameters.immediatePercentage")}
                      disabled={disabled || !canEditFixed}
                      onKeyUp={revalidateSplit}
                      onBlur={revalidateSplit}
                      type="number"
                      maxDecimals={2}
                      min={0}
                      max={100}
                      colorable
                      noErrorLabel
                      noMargin
                      placeholder="-- (%)"
                    />
                  </div>
                  <div className="previewDapp">
                    <FormInput
                      disabled
                      value={toFixedIfNecessary(immediatePercentagePreview, 2) + "%"}
                      readOnly
                      noErrorLabel
                      noMargin
                      placeholder="-- (%)"
                    />
                  </div>
                </div>
              </div>
              <div className="split">
                {renderWithTooltip(
                  t("vestedSplitExplanation"),
                  <p>
                    {t("vested")} <InfoIcon fontSize="small" className="ml-2" />
                  </p>
                )}
                <div className="inputsContainer">
                  <div className="formInput">
                    <FormInput
                      {...methodsToUse.register("parameters.vestedPercentage")}
                      disabled={disabled || !canEditFixed}
                      onKeyUp={revalidateSplit}
                      onBlur={revalidateSplit}
                      type="number"
                      maxDecimals={2}
                      min={0}
                      max={100}
                      colorable
                      noErrorLabel
                      noMargin
                      placeholder="-- (%)"
                    />
                  </div>
                  <div className="previewDapp">
                    <FormInput
                      disabled
                      value={toFixedIfNecessary(vestedPercentagePreview, 2) + "%"}
                      readOnly
                      noErrorLabel
                      noMargin
                      placeholder="-- (%)"
                    />
                  </div>
                </div>
              </div>
              <div className="split">
                {renderWithTooltip(
                  t("committeeSplitExplanation"),
                  <p>
                    {t("committee")} <br /> (0%-10%) <InfoIcon fontSize="small" className="ml-2" />
                  </p>
                )}
                <div className="inputsContainer">
                  <div className="formInput">
                    <FormInput
                      {...methodsToUse.register("parameters.committeePercentage")}
                      disabled={disabled || !canEditFixed}
                      onKeyUp={revalidateSplit}
                      onBlur={revalidateSplit}
                      type="number"
                      maxDecimals={2}
                      min={0}
                      max={10}
                      colorable
                      noErrorLabel
                      noMargin
                      placeholder="-- (%)"
                    />
                  </div>
                  <div className="previewDapp">
                    <FormInput
                      disabled
                      value={toFixedIfNecessary(committeePercentagePreview, 2) + "%"}
                      readOnly
                      noErrorLabel
                      noMargin
                      placeholder="-- (%)"
                    />
                  </div>
                </div>
              </div>
              <div className="split">
                <StyledTotalSplittedPercentage error={percentagesSum !== 100} className="tiny mt-3">
                  {t("total")} {percentagesSum}%
                </StyledTotalSplittedPercentage>
                <div />
              </div>
            </div>
          </div>
          <div className="nonControlled">
            {renderWithTooltip(
              canEditFixed ? t("editable") : t("nonEditable"),
              <div className="fixedContainer">
                <div className="splitFixedValue">
                  {canEditFixed && isEditingFixed ? (
                    <>
                      <FormInput
                        {...methodsToUse.register("parameters.fixedHatsGovPercetange")}
                        disabled={disabled}
                        onKeyUp={revalidateSplit}
                        onBlur={revalidateSplit}
                        type="number"
                        maxDecimals={0}
                        min={0}
                        max={100}
                        colorable
                        noMargin
                        placeholder="-- (%)"
                      />
                      <div className="mb-1" />
                    </>
                  ) : (
                    <p>{hatsGovernanceSplit}%</p>
                  )}

                  <label>{t("hatsGov")}</label>
                </div>

                <div className="splitFixedValue variant">
                  {canEditFixed && isEditingFixed ? (
                    <>
                      <FormInput
                        {...methodsToUse.register("parameters.hatsManagementGovPercentage")}
                        disabled={disabled}
                        onKeyUp={revalidateSplit}
                        onBlur={revalidateSplit}
                        type="number"
                        maxDecimals={0}
                        min={0}
                        max={100}
                        colorable
                        noMargin
                        placeholder="-- (%)"
                      />
                      <div className="mb-1" />
                    </>
                  ) : (
                    <p>{hatsManagementSplit}%</p>
                  )}

                  <label>{t("managementFees")}</label>
                </div>
              </div>
            )}
            {renderWithTooltip(
              canEditFixed ? t("editable") : t("nonEditable"),
              <div className="splitFixedValue">
                {canEditFixed && isEditingFixed ? (
                  <>
                    <FormInput
                      {...methodsToUse.register("parameters.fixedHatsRewardPercetange")}
                      disabled={disabled}
                      onKeyUp={revalidateSplit}
                      onBlur={revalidateSplit}
                      type="number"
                      maxDecimals={0}
                      min={0}
                      max={100}
                      colorable
                      noMargin
                      placeholder="-- (%)"
                    />
                    <div className="mb-1" />
                  </>
                ) : (
                  <p>{hatsRewardSplit}%</p>
                )}
                <label>{t("hatsReward")}</label>
              </div>
            )}
          </div>
        </div>
      </StyledVaultParametersForm>
    </StyledVaultEditorForm>
  );
}
