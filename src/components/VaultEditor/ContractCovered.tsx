import { useTranslation } from "react-i18next";
import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";
import MultiSelect from "components/Shared/MultiSelect/MultiSelect";
import RemoveIcon from "assets/icons/remove-member.svg";

export default function ContractCovered({ index, contract, onChange, onRemove, severitiesOptions, contractsCount, addContract }) {
  const { t } = useTranslation();
  const basePath = `contracts.${index}`;

  return (
    <>
      <div className="contracts-covered__contract">
        <div className="contracts-covered__contract-number">{index + 1}</div>
        <div className="contracts-covered__contract-content">
          <div className="contracts-covered__contract-subcontent">
            <div className="contracts-covered__contract-name">
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
            <div className="contracts-covered__contract-severities">
              <label>{t("VaultEditor.contract-severities")}</label>
              <MultiSelect
                colorable
                name={`${basePath}.severities`}
                value={contract.severities}
                onChange={onChange}
                options={severitiesOptions} />
            </div>
          </div>
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
      <div className="contracts-covered__contract-buttons">
        {contractsCount > 1 && (
          <button className="fill" onClick={() => onRemove(index)}>
            <img src={RemoveIcon} height={12} alt="remove-member" />
            {` ${t("VaultEditor.remove-member")}`}
          </button>
        )}
        {(index === contractsCount - 1) && (
          <button className="fill" onClick={addContract}>
            {t("VaultEditor.add-member")}
          </button>
        )}
      </div>
    </>
  );
}
