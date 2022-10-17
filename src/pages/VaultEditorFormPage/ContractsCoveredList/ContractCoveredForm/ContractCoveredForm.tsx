import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormInput, FormSelectInput } from "components";
import RemoveIcon from "assets/icons/remove-member.svg";
import { IVulnerabilitySeverity } from "types/types";
import { StyledContractCoveredForm } from "./styles";

type ContractCoveredFormProps = {
  index: number;
  append: (data: any) => void;
  remove: (index: number) => void;
};

export default function ContractCoveredForm({ index, append, remove }: ContractCoveredFormProps) {
  const { t } = useTranslation();
  const basePath = `contracts-covered.${index}`;
  const severitiesPath = `vulnerability-severities-spec.severities`;
  const { register, watch, control, setValue, getValues } = useFormContext();

  const severities = watch(severitiesPath) as IVulnerabilitySeverity[];
  const contracts = watch("contracts-covered") as any[];
  const contractsCount = contracts.length;

  const severitiesOptions = severities.map((severity, index) => ({
    label: severity.name,
    value: severity.id,
  }));

  useEffect(() => {
    const severitiesFormIds = severities.map((sev) => sev.id);
    const severitiesIdsInThisContract: string[] = getValues()["contracts-covered"][index].severities;
    console.log(severitiesFormIds);
    console.log(severitiesIdsInThisContract);

    const filteredVulnerabilities = severitiesIdsInThisContract.filter((sevId) => severitiesFormIds.includes(sevId));
    console.log(filteredVulnerabilities);
    setValue(`contracts-covered.${index}.severities`, filteredVulnerabilities);
  }, [severities, getValues, setValue, index]);

  return (
    <StyledContractCoveredForm>
      <div className="contract">
        <div className="index-number">{index + 1}</div>

        <div className="content">
          <div className="subcontent">
            <div className="name">
              <FormInput
                {...register(`${basePath}.name`)}
                label={t("VaultEditor.contract-name")}
                colorable
                placeholder={t("VaultEditor.contract-name-placeholder")}
              />
            </div>
            <div className="severities">
              <Controller
                control={control}
                name={`${basePath}.severities`}
                render={({ field: { ...configProps } }) => (
                  <FormSelectInput
                    label={t("VaultEditor.contract-severities")}
                    placeholder={t("VaultEditor.contract-severities-placeholder")}
                    colorable
                    options={severitiesOptions}
                    multiple
                    {...configProps}
                  />
                )}
              />
            </div>
          </div>

          <div>
            <FormInput
              {...register(`${basePath}.address`)}
              label={t("VaultEditor.contract-address")}
              pastable
              colorable
              placeholder={t("VaultEditor.contract-address-placeholder")}
            />
          </div>
        </div>
      </div>

      <div className="controller-buttons">
        {contractsCount > 1 && (
          <button type="button" className="fill" onClick={() => remove(index)}>
            <img src={RemoveIcon} height={12} alt="remove-member" />
            {` ${t("VaultEditor.remove-member")}`}
          </button>
        )}
        {index === contractsCount - 1 && (
          <button type="button" className="fill" onClick={append}>
            {t("VaultEditor.add-member")}
          </button>
        )}
      </div>
    </StyledContractCoveredForm>
  );
}
