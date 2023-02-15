import { useContext, useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, FormInput, FormSelectInput } from "components";
import { useEnhancedFormContext, getCustomIsDirty } from "hooks/useEnhancedFormContext";
import { getPath } from "utils/objects.utils";
import { IEditedVaultDescription, IEditedContractCovered } from "types";
import { StyledContractCoveredForm } from "./styles";
import { VaultEditorFormContext } from "../../../store";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";

type ContractCoveredFormProps = {
  index: number;
  contractsCount: number;
  append: (data: IEditedContractCovered) => void;
  remove: (index: number) => void;
};

export default function ContractCoveredForm({ index, append, remove, contractsCount }: ContractCoveredFormProps) {
  const { t } = useTranslation();
  const { register, control, setValue, getValues } = useEnhancedFormContext<IEditedVaultDescription>();

  const { isVaultCreated } = useContext(VaultEditorFormContext);

  const severitiesOptions = useWatch({ control, name: "severitiesOptions" });
  const severitiesFormIds = useMemo(
    () => (severitiesOptions ? severitiesOptions.map((sev) => sev.value) : []),
    [severitiesOptions]
  );

  useEffect(() => {
    const severitiesIdsInThisContract: string[] = getValues()["contracts-covered"][index].severities;

    const filteredVulnerabilities = severitiesIdsInThisContract?.filter((sevId) => severitiesFormIds.includes(sevId));
    setValue(`contracts-covered.${index}.severities`, filteredVulnerabilities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severitiesOptions, index]);

  return (
    <StyledContractCoveredForm>
      <div className="contract">
        <div className="subcontent">
          <FormInput
            {...register(`contracts-covered.${index}.name`)}
            disabled={isVaultCreated}
            label={t("VaultEditor.contract-name")}
            colorable
            placeholder={t("VaultEditor.contract-name-placeholder")}
          />
          {severitiesOptions && (
            <Controller
              control={control}
              name={`contracts-covered.${index}.severities`}
              render={({ field, formState: { errors, dirtyFields, defaultValues } }) => (
                <FormSelectInput
                  disabled={isVaultCreated}
                  isDirty={getCustomIsDirty<IEditedVaultDescription>(field.name, dirtyFields, defaultValues)}
                  error={getPath(errors, field.name)}
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
          {...register(`contracts-covered.${index}.address`)}
          disabled={isVaultCreated}
          label={t("VaultEditor.contract-address")}
          pastable
          colorable
          placeholder={t("VaultEditor.contract-address-placeholder")}
        />
      </div>

      {!isVaultCreated && contractsCount > 1 && (
        <div className="controller-buttons no-line">
          <Button styleType="filled" onClick={() => remove(index)}>
            <DeleteIcon className="mr-1" />
            <span>{t("removeContractAsset")}</span>
          </Button>
        </div>
      )}
    </StyledContractCoveredForm>
  );
}
