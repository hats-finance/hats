import { useTranslation } from "react-i18next";
import Tooltip from "rc-tooltip";
import { useWatch } from "react-hook-form";
import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import { FormInput } from "components";
import { toFixedIfNecessary } from "utils/amounts.utils";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { IEditedVaultDescription } from "../../types";
import { StyledTotalSplittedPercentage, StyledVaultParametersForm } from "./styles";
import InfoIcon from "@mui/icons-material/InfoOutlined";

export const VaultParametersForm = () => {
  const { t } = useTranslation();

  const { register, control, trigger } = useEnhancedFormContext<IEditedVaultDescription>();

  const vestedPercentage = useWatch<IEditedVaultDescription>({ control, name: "parameters.vestedPercentage" }) ?? 0;
  const committeePercentage = useWatch<IEditedVaultDescription>({ control, name: "parameters.committeePercentage" }) ?? 0;
  const immediatePercentage = useWatch<IEditedVaultDescription>({ control, name: "parameters.immediatePercentage" }) ?? 0;

  const committeeControlledSplit = useWatch<IEditedVaultDescription>({
    control,
    name: "parameters.fixedCommitteeControlledPercetange",
  })?.toString();
  const hatsGovernanceSplit = useWatch<IEditedVaultDescription>({
    control,
    name: "parameters.fixedHatsGovPercetange",
  })?.toString();
  const hatsRewardSplit = useWatch<IEditedVaultDescription>({
    control,
    name: "parameters.fixedHatsRewardPercetange",
  })?.toString();

  const vestedPercentagePreview = +(vestedPercentage as string) * (+(committeeControlledSplit as string) / 100);
  const committeePercentagePreview = +(committeePercentage as string) * (+(committeeControlledSplit as string) / 100);
  const immediatePercentagePreview = +(immediatePercentage as string) * (+(committeeControlledSplit as string) / 100);

  const percentagesSum = +(vestedPercentage as string) + +(committeePercentage as string) + +(immediatePercentage as string);

  const revalidateSplit = () => {
    trigger(["parameters.committeePercentage", "parameters.immediatePercentage", "parameters.vestedPercentage"]);
  };

  const renderWithTooltip = (text: string, children: JSX.Element) => (
    <Tooltip placement="top" overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE} overlay={text} mouseLeaveDelay={0}>
      {children}
    </Tooltip>
  );

  return (
    <StyledVaultParametersForm>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorMaxBountyExplanation") }} />

      <div className="input">
        <FormInput
          {...register(`parameters.maxBountyPercentage`)}
          type="whole-number"
          label={t("VaultEditor.vault-parameters.maxBountyPercentage")}
          placeholder={t("VaultEditor.vault-parameters.maxBountyPercentage-placeholder")}
          colorable
        />
      </div>

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
                <p className="tiny">{t("dApp")}</p>
              </div>
            </div>
            <div className="split">
              {renderWithTooltip(
                t("nonEditable"),
                <p>
                  {t("immediate")} <InfoIcon fontSize="small" className="ml-2" />
                </p>
              )}
              <div className="inputsContainer">
                <div className="formInput">
                  <FormInput
                    {...register("parameters.immediatePercentage")}
                    onKeyUp={revalidateSplit}
                    onBlur={revalidateSplit}
                    type="whole-number"
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
                t("nonEditable"),
                <p>
                  {t("vested")} <InfoIcon fontSize="small" className="ml-2" />
                </p>
              )}
              <div className="inputsContainer">
                <div className="formInput">
                  <FormInput
                    {...register("parameters.vestedPercentage")}
                    onKeyUp={revalidateSplit}
                    onBlur={revalidateSplit}
                    type="whole-number"
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
                t("nonEditable"),
                <p>
                  {t("committee")} <br /> (0%-10%) <InfoIcon fontSize="small" className="ml-2" />
                </p>
              )}
              <div className="inputsContainer">
                <div className="formInput">
                  <FormInput
                    {...register("parameters.committeePercentage")}
                    onKeyUp={revalidateSplit}
                    onBlur={revalidateSplit}
                    type="whole-number"
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
  );
};
