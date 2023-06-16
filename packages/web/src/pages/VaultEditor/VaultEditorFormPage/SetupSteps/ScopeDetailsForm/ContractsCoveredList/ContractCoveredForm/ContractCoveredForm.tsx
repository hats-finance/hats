import { ALL_CHAINS, IEditedVaultDescription } from "@hats-finance/shared";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Button, FormInput, FormSelectInput, FormSelectInputOption } from "components";
import { getCustomIsDirty, useEnhancedFormContext } from "hooks/form";
import { useContext, useEffect, useMemo } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { VaultEditorFormContext } from "../../../../store";
import { StyledContractCoveredForm } from "./styles";

type ContractCoveredFormProps = {
  index: number;
  contractsCount: number;
  remove: (index: number) => void;
};

export default function ContractCoveredForm({ index, remove, contractsCount }: ContractCoveredFormProps) {
  const { t } = useTranslation();

  const { register, control, setValue, getValues } = useEnhancedFormContext<IEditedVaultDescription>();
  const {
    fields: deployments,
    append: appendDeployment,
    remove: removeDeployment,
  } = useFieldArray<IEditedVaultDescription>({ control, name: `contracts-covered.${index}.deploymentInfo` });

  const { allFormDisabled } = useContext(VaultEditorFormContext);

  const severitiesOptions = useWatch({ control, name: "severitiesOptions" });
  const severitiesFormIds = useMemo(
    () => (severitiesOptions ? severitiesOptions.map((sev) => sev.value) : []),
    [severitiesOptions]
  );

  const chainsOptions: FormSelectInputOption[] = Object.values(ALL_CHAINS).map((chain) => ({
    label: chain.name,
    value: `${chain.id}`,
  }));

  useEffect(() => {
    const severitiesIdsInThisContract: string[] = getValues()["contracts-covered"][index].severities;

    const filteredVulnerabilities = severitiesIdsInThisContract?.filter((sevId) => severitiesFormIds.includes(sevId));
    setValue(`contracts-covered.${index}.severities`, filteredVulnerabilities);
  }, [severitiesOptions, index, getValues, setValue, severitiesFormIds]);

  return (
    <StyledContractCoveredForm>
      <div className="contract">
        <div className="subcontent">
          {/* <FormInput
            {...register(`contracts-covered.${index}.name`)}
            disabled={allFormDisabled}
            label={t("VaultEditor.contract-name")}
            colorable
            placeholder={t("VaultEditor.contract-name-placeholder")}
          /> */}
          <FormInput
            {...register(`contracts-covered.${index}.address`)}
            disabled={allFormDisabled}
            label={t("VaultEditor.contractUrl")}
            colorable
            helper="https://github.com/hats-finance/hats-contracts/blob/develop/contracts/HATVault.sol"
            placeholder={t("VaultEditor.contractUrl-placeholder")}
          />
          {severitiesOptions && (
            <Controller
              control={control}
              name={`contracts-covered.${index}.severities`}
              render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
                <FormSelectInput
                  disabled={allFormDisabled}
                  isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                  error={error}
                  label={t("VaultEditor.contract-severities")}
                  placeholder={t("VaultEditor.contract-severities-placeholder")}
                  colorable
                  options={severitiesOptions}
                  multiple
                  {...field}
                />
              )}
            />
          )}
        </div>

        <FormInput
          {...register(`contracts-covered.${index}.description`)}
          disabled={allFormDisabled}
          label={t("VaultEditor.contractDescription")}
          colorable
          placeholder={t("VaultEditor.contractDescription-placeholder")}
        />

        <p className="bold mb-2">{t("VaultEditor.contractDeployment")}</p>
        <p className="mb-4">{t("VaultEditor.contractDeploymentsExplanation")}</p>

        {deployments.map((deployment, deploymentIndex) => (
          <div className="flex" key={deployment.id}>
            <FormInput
              {...register(`contracts-covered.${index}.deploymentInfo.${deploymentIndex}.contractAddress`)}
              label={t("VaultEditor.contractAddress")}
              colorable
              disabled={allFormDisabled}
              placeholder={t("VaultEditor.contractAddress-placeholder")}
            />
            <Controller
              control={control}
              name={`contracts-covered.${index}.deploymentInfo.${deploymentIndex}.chainId`}
              render={({ field, fieldState: { error }, formState: { dirtyFields, defaultValues } }) => (
                <FormSelectInput
                  disabled={allFormDisabled}
                  isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                  error={error}
                  label={t("VaultEditor.chain")}
                  placeholder={t("VaultEditor.chain-placeholder")}
                  colorable
                  options={chainsOptions}
                  {...field}
                />
              )}
            />
            {!allFormDisabled && (
              <Button styleType="invisible" textColor="secondary" onClick={() => removeDeployment(deploymentIndex)}>
                <DeleteIcon className="mr-2" />
                <span>{t("remove")}</span>
              </Button>
            )}
          </div>
        ))}

        {!allFormDisabled && (
          <div className="buttons">
            <Button styleType="invisible" onClick={() => appendDeployment({ contractAddress: "", chainId: "" })}>
              <AddIcon className="mr-2" />
              <span>{t("newDeployment")}</span>
            </Button>
          </div>
        )}
      </div>

      {!allFormDisabled && contractsCount > 1 && (
        <div className="controller-buttons no-line">
          <Button styleType="outlined" filledColor="secondary" onClick={() => remove(index)}>
            <DeleteIcon className="mr-1" />
            <span>{t("removeContractAsset")}</span>
          </Button>
        </div>
      )}
    </StyledContractCoveredForm>
  );
}
