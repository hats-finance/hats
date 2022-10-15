import { useTranslation } from "react-i18next";
import { FormInput, FormSelectInput } from "components";
import RemoveIcon from "assets/icons/remove-member.svg";
import { StyledContractCoveredForm } from "./styles";
import { Controller, useFormContext } from "react-hook-form";
import { IVulnerabilitySeverity } from "types/types";

type ContractCoveredFormProps = {
  index: number;
  append: (data: any) => void;
  remove: (index: number) => void;
};

export default function ContractCoveredForm({ index, append, remove }: ContractCoveredFormProps) {
  const { t } = useTranslation();
  const basePath = `contracts-covered.${index}`;
  const { register, watch, control } = useFormContext();
  const severities = watch("vulnerability-severities-spec.severities") as IVulnerabilitySeverity[];

  const contracts = watch("contracts-covered") as any[];
  const contractsCount = contracts.length;

  const severitiesOptions = severities.map((severity, index) => ({
    label: severity.name,
    value: severity.name,
  }));

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
          <button className="fill" onClick={() => remove(index)}>
            <img src={RemoveIcon} height={12} alt="remove-member" />
            {` ${t("VaultEditor.remove-member")}`}
          </button>
        )}
        {index === contractsCount - 1 && (
          <button className="fill" onClick={append}>
            {t("VaultEditor.add-member")}
          </button>
        )}
      </div>
    </StyledContractCoveredForm>
  );
}
