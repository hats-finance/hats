import { useTranslation } from "react-i18next";
import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";
import MultiSelect from "components/Shared/MultiSelect/MultiSelect";
import RemoveIcon from "assets/icons/remove-member.svg";
import Severities from "components/Vault/Severities/Severities";
import { ISeverity } from "types/types";

export default function ContractCovered({ index, contract, onChange, onRemove, severities, activeSeverities }:
  {
    index: number,
    contract: { [key: string]: string },
    onChange: any,
    onRemove: any,
    severities: ISeverity[],
    activeSeverities: ISeverity[]
  }) {
  const { t } = useTranslation();
  const contractName = Object.keys(contract)[0];
  const address = contract?.[contractName];

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
                name="name"
                value={contractName}
                onChange={(e) => onChange(e, activeSeverities, index)}
                placeholder={t("Vault Editor.contract-name-placeholder")}
              />
            </div>
            <div className="contracts-covered__contract-severities">
              <label>{t("VaultEditor.contract-severities")}</label>
              <MultiSelect
                name="severities"
                onChange={onChange}
                options={severities.map(severity => ({ label: severity.name, value: severity.index }))} />
            </div>
          </div>
          <label>{t("VaultEditor.contract-address")}</label>
          <EditableContent
            textInput
            pastable
            name="address"
            value={address}
            onChange={onChange}
            placeholder={t("VaultEditor.contract-address-placeholder")}
          />
        </div>
      </div>
      <button className="fill" onClick={() => onRemove(index)}>
        <img src={RemoveIcon} height={12} alt="remove-member" />
        {` ${t("VaultEditor.remove-member")}`}
      </button>
    </>
  );
}
