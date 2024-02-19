import { IEditedVaultDescription, IEditedVaultParameters } from "@hats.finance/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { Button, FormInput } from "components";
import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import { useEnhancedFormContext } from "hooks/form/useEnhancedFormContext";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import Tooltip from "rc-tooltip";
import { useContext, useEffect } from "react";
import { Control, FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { toFixedIfNecessary } from "utils/amounts.utils";
import { getEditedDescriptionYupSchema } from "../../formSchema";
import { VaultEditorFormContext } from "../../store";
import { StyledVaultEditorForm } from "../../styles";
import { StyledTotalSplittedPercentage, StyledVaultParametersForm } from "./styles";

type VaultParametersFormProps = {
  statusCardFormDefaultData?: { parameters: IEditedVaultParameters };
  onSubmit?: (data: { parameters: IEditedVaultParameters }) => void;
};

type FormType = { parameters: IEditedVaultParameters } | IEditedVaultDescription;

export const VaultParametersForm = (props: VaultParametersFormProps) => {
  return props.statusCardFormDefaultData ? <VaultParametersFormStatusCard {...props} /> : <VaultParametersFormOnVaultEditor />;
};

const VaultParametersFormStatusCard = ({ statusCardFormDefaultData, onSubmit }: VaultParametersFormProps) => {
  const { t } = useTranslation();

  const methodsOnlyParameters = useForm<{ parameters: IEditedVaultParameters }>({
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
  const { masters } = useVaults();
  const methodsToUse = useEnhancedFormContext<IEditedVaultDescription>();

  const chainId = useWatch({ control: methodsToUse.control, name: "committee.chainId" });

  // Set default values for the fixed splits. Getting it from subgraph
  useEffect(() => {
    const registryAddress = appChains[Number(chainId)]?.vaultsCreatorContract;
    if (registryAddress && masters) {
      const master = masters.find(
        (master) => master.address.toLowerCase() === registryAddress.toLowerCase() && master.chainId === Number(chainId)
      );

      if (master) {
        const hatsRewardSplit = Number(master.defaultHackerHatRewardSplit) / 100;
        const hatsGovernanceSplit = Number(master.defaultGovernanceHatRewardSplit) / 100;
        const committeeControlledSplit = 100 - hatsRewardSplit - hatsGovernanceSplit;

        if (!isNaN(committeeControlledSplit))
          methodsToUse.setValue("parameters.fixedCommitteeControlledPercetange", committeeControlledSplit);
        if (!isNaN(hatsGovernanceSplit)) methodsToUse.setValue("parameters.fixedHatsGovPercetange", hatsGovernanceSplit);
        if (!isNaN(hatsRewardSplit)) methodsToUse.setValue("parameters.fixedHatsRewardPercetange", hatsRewardSplit);
      }
    }
  }, [chainId, masters, methodsToUse]);

  return <VaultParametersFormShared disabled={allFormDisabled} />;
};

function VaultParametersFormShared({ blockMaxBounty, disabled = false }: { blockMaxBounty?: boolean; disabled?: boolean }) {
  const { t } = useTranslation();
  const methodsToUse = useEnhancedFormContext<FormType>();

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
  const hatsRewardSplit = useWatch({
    control: methodsToUse.control as Control<FormType>,
    name: "parameters.fixedHatsRewardPercetange",
  })?.toString();

  const vestedPercentagePreview = +vestedPercentage.toString() * (+(committeeControlledSplit as string) / 100);
  const committeePercentagePreview = +committeePercentage.toString() * (+(committeeControlledSplit as string) / 100);
  const immediatePercentagePreview = +immediatePercentage.toString() * (+(committeeControlledSplit as string) / 100);

  const percentagesSum = +vestedPercentage.toString() + +committeePercentage.toString() + +immediatePercentage.toString();

  const revalidateSplit = () => {
    methodsToUse.trigger(["parameters.committeePercentage", "parameters.immediatePercentage", "parameters.vestedPercentage"]);
  };

  const renderWithTooltip = (text: string, children: JSX.Element) => (
    <Tooltip placement="top" overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE} overlay={text} mouseLeaveDelay={0}>
      {children}
    </Tooltip>
  );

  return (
    <StyledVaultEditorForm withoutMargin noPadding>
      <StyledVaultParametersForm>
        <p className="section-title">{t("maxBounty")}</p>
        <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorMaxBountyExplanation") }} />

        {/* <div className="input">
          <FormInput
            {...methodsToUse.register(`parameters.maxBountyPercentage`)}
            disabled={blockMaxBounty || disabled}
            type="whole-number"
            label={t("VaultEditor.vault-parameters.maxBountyPercentage")}
            placeholder={t("VaultEditor.vault-parameters.maxBountyPercentage-placeholder")}
            colorable
          />
        </div> */}

        <p className="section-title">{t("bountySplit")}</p>
        <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorBountySplitExplanation") }} />

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
                      disabled={disabled}
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
                      disabled={disabled}
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
                      disabled={disabled}
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
              t("nonEditable"),
              <div className="splitFixedValue">
                <p>{hatsGovernanceSplit}%</p>
                <label>{t("hatsGov")}</label>
              </div>
            )}
            {renderWithTooltip(
              t("nonEditable"),
              <div className="splitFixedValue">
                <p>{hatsRewardSplit}%</p>
                <label>{t("hatsReward")}</label>
              </div>
            )}
          </div>
        </div>
      </StyledVaultParametersForm>
    </StyledVaultEditorForm>
  );
}
