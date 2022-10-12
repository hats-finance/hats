import { useTranslation } from "react-i18next";
import { MultiSelect } from "components";
import RemoveIcon from "assets/icons/remove-member.svg";
import { EditableContent } from "components";
import { StyledContractCoveredForm } from "./styles";

export default function ContractCoveredForm({
  index,
  contract,
  severitiesOptions,
  contractsCount,
}) {
  const { t } = useTranslation();
  const basePath = `contracts.${index}`;

  return (
    <StyledContractCoveredForm>
      <div className="contract">
        <div className="index-number">{index + 1}</div>

        <div className="content">
          <div className="subcontent">
            <div className="name">
              <label>{t("VaultEditor.contract-name")}</label>
              <EditableContent
                textInput
                colorable
                name={`${basePath}.name`}
                value={contract.name}
                onChange={() => { }}
                placeholder={t("VaultEditor.contract-name-placeholder")}
              />
            </div>
            <div className="severities">
              <label>{t("VaultEditor.contract-severities")}</label>
              <MultiSelect
                name={`${basePath}.severities`}
                value={contract.severities}
                onChange={() => { }}
                options={severitiesOptions}
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
              onChange={() => { }}
              placeholder={t("VaultEditor.contract-address-placeholder")}
            />
          </div>
        </div>
      </div>

      <div className="controller-buttons">
        {contractsCount > 1 && (
          <button className="fill" onClick={() => { }}>
            <img src={RemoveIcon} height={12} alt="remove-member" />
            {` ${t("VaultEditor.remove-member")}`}
          </button>
        )}
        {index === contractsCount - 1 && (
          <button className="fill" onClick={() => { }}>
            {t("VaultEditor.add-member")}
          </button>
        )}
      </div>
    </StyledContractCoveredForm>
  );
}
