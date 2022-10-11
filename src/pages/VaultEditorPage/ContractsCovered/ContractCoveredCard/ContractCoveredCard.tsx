import { useTranslation } from "react-i18next";
import MultiSelect, { MultiselectOptions } from "components/Shared/MultiSelect/MultiSelect";
import RemoveIcon from "assets/icons/remove-member.svg";
import EditableContent from "components/EditableContent/EditableContent";
import { StyledContractCoveredCard } from "./styles";

export default function ContractCoveredCard({
  index,
  contract,
  onChange,
  onRemove,
  severitiesOptions,
  contractsCount,
  addContract,
}) {
  const { t } = useTranslation();
  const basePath = `contracts.${index}`;

  return (
    <StyledContractCoveredCard>
      <div className="contract">
        <div className="contract__number">{index + 1}</div>

        <div className="contract__content">
          <div className="contract__subcontent">
            <div className="contract__subcontent__name">
              <label>{t("VaultEditor.contract-name")}</label>
              <EditableContent
                textInput
                colorable
                name={`${basePath}.name`}
                value={contract.name}
                onChange={onChange}
                placeholder={t("VaultEditor.contract-name-placeholder")}
              />
            </div>
            <div className="contract__subcontent__severities">
              <label>{t("VaultEditor.contract-severities")}</label>
              <MultiSelect
                name={`${basePath}.severities`}
                value={contract.severities}
                onChange={onChange}
                options={severitiesOptions as MultiselectOptions}
              />
            </div>
          </div>

          <div>
            <label>{t("VaultEditor.contract-address")}</label>
            <EditableContent
              textInput
              pastable
              colorable
              name={`${basePath}.address`}
              value={contract.address}
              onChange={onChange}
              placeholder={t("VaultEditor.contract-address-placeholder")}
            />
          </div>
        </div>
      </div>

      <div className="controller-buttons">
        {contractsCount > 1 && (
          <button className="fill" onClick={() => onRemove(index)}>
            <img src={RemoveIcon} height={12} alt="remove-member" />
            {` ${t("VaultEditor.remove-member")}`}
          </button>
        )}
        {index === contractsCount - 1 && (
          <button className="fill" onClick={addContract}>
            {t("VaultEditor.add-member")}
          </button>
        )}
      </div>
    </StyledContractCoveredCard>
  );
}
