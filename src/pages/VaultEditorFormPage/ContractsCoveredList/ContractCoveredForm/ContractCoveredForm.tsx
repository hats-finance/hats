import { useTranslation } from "react-i18next";
import { MultiSelect, FormInput } from "components";
import { MultiSelectOption } from "components/MultiSelect/MultiSelect";
import RemoveIcon from "assets/icons/remove-member.svg";
import { StyledContractCoveredForm } from "./styles";
import { useFormContext } from "react-hook-form";
import { IVulnerabilitySeverity } from "types/types";

type ContractCoveredFormProps = {
  index: number;
  append: (data: any) => void;
  remove: (index: number) => void;
};

export default function ContractCoveredForm({ index, append, remove }: ContractCoveredFormProps) {
  const { t } = useTranslation();
  const basePath = `contracts-covered.${index}`;
  const { register, watch } = useFormContext();
  const severities = watch("severitiesTemplate.severities") as IVulnerabilitySeverity[];
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
              <label>{t("VaultEditor.contract-name")}</label>
              <FormInput {...register(`${basePath}.name`)} colorable placeholder={t("VaultEditor.contract-name-placeholder")} />
            </div>
            <div className="severities">
              <label>{t("VaultEditor.contract-severities")}</label>
              {/*               
               <MultiSelect
                {...register(`${basePath}.severities`)}
                options={severitiesOptions as Array<MultiSelectOption>}
              />  */}
            </div>
          </div>

          <div>
            <label>{t("VaultEditor.contract-address")}</label>
            <FormInput
              {...register(`${basePath}.address`)}
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
