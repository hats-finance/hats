import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";
import { useTranslation } from "react-i18next";
import IconInput from "./IconEditor";
import RemoveIcon from "assets/icons/remove-member.svg";
// import MultiSelect from "components/Shared/MultiSelect/MultiSelect";

export default function ContractCovered({ index, member, onChange, onRemove }) {
  const { t } = useTranslation();
  const basePath = `committee.members.${index}`;
  console.log({ index, member });

//   const severitiesOptions = [
//     { label: "Thing 1", value: 1 },
//     { label: "Thing 2", value: 2 },
//     { label: "Thing 3", value: 3 }
//   ];

  return (
    <>
      <div className="committee-members__member">
        <div className="committee-members__member-number">{index + 1}</div>
        <div className="committee-members__member-content">
          <div className="committee-members__member-inputs">
            <label>{t("VaultEditor.member-name")}</label>
            <EditableContent
              textInput
              name={`${basePath}.name`}
              value={member.name}
              onChange={onChange}
              placeholder={t("VaultEditor.member-name-placeholder")}
            />
            <label>{t("VaultEditor.member-twitter")}</label>
            <EditableContent
              textInput
              pastable
              name={`${basePath}.twitter-link`}
              value={member["twitter-link"]}
              onChange={onChange}
              placeholder={t("VaultEditor.member-twitter-placeholder")}
            />
            <label>{t("VaultEditor.member-address")}</label>
            <EditableContent
              textInput
              pastable
              name={`${basePath}.address`}
              value={member.address}
              onChange={onChange}
              placeholder={t("VaultEditor.member-address-placeholder")}
            />
          </div>
          <div className="committee-members__member-icons">
            <div>
              <label>{t("VaultEditor.member-image")}</label>
              <IconInput
                name="image-ipfs-link"
                value={member["image-ipfs-link"]}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      </div>
      <button className="fill">
        <img src={RemoveIcon} height={12} alt="remove-member" />
        {` ${t("VaultEditor.remove-member")}`}
      </button>
      {/* <section className={classNames({ 'desktop-only': pageNumber !== 3 })}>
                <div className="vault-editor__section">
                    <p className="vault-editor__section-title">
                        4. {t("VaultEditor.contracts-covered")}
                    </p>
                    <div className="vault-editor__section-content">
                        <div className="contracts-covered">
                            {(vaultDescription?.committee?.members || []).map((member, index) => {
                                return (
                                    <>
                                        <div className="contracts-covered__contract">
                                            <div className="contracts-covered__contract-number">
                                                {index + 1}
                                            </div>
                                            <div className="contracts-covered__contract-content">
                                                <div className="contracts-covered__contract-subcontent">
                                                    <div className="contracts-covered__contract-name">
                                                        <label>{t("VaultEditor.contract-name")}</label>
                                                        <EditableContent
                                                            textInput
                                                            name="name"
                                                            value={member.name}
                                                            placeholder={t("VaultEditor.contract-name-placeholder")}
                                                        />
                                                    </div>
                                                    <div className="contracts-covered__contract-severities">
                                                        <label>{t("VaultEditor.contract-severities")}</label>
                                                        <MultiSelect options={severitiesOptions} />
                                                    </div>
                                                </div>
                                                <label>{t("VaultEditor.contract-address")}</label>
                                                <EditableContent
                                                    textInput
                                                    pastable
                                                    name="address"
                                                    value={member.address}
                                                    placeholder={t("VaultEditor.contract-address-placeholder")}
                                                />
                                            </div>
                                        </div>
                                        <button className="fill">
                                            <img src={RemoveIcon} height={12} alt="remove-member" />
                                            {` ${t("VaultEditor.remove-member")}`}
                                        </button>
                                    </>
                                );
                            })}
                            
                            <div className="contracts-covered__contract">
                                <div className="contracts-covered__contract-number">
                                    {(vaultDescription?.committee?.members || []).length + 1}
                                </div>
                                <div className="contracts-covered__contract-content">
                                    <div className="contracts-covered__contract-subcontent">
                                        <div className="contracts-covered__contract-name">
                                            <label>{t("VaultEditor.contract-name")}</label>
                                            <EditableContent
                                                textInput
                                                name="name"
                                                value={newMemberDetails.name}
                                                onChange={onNewMemberDetailsChange}
                                                placeholder={t("VaultEditor.contract-name-placeholder")}
                                            />
                                        </div>
                                        <div className="contracts-covered__contract-severities">
                                            <label>{t("VaultEditor.contract-severities")}</label>
                                            <MultiSelect options={severitiesOptions} />
                                        </div>
                                    </div>
                                    <label>{t("VaultEditor.contract-address")}</label>
                                    <EditableContent
                                        textInput
                                        pastable
                                        name="address"
                                        value={newMemberDetails.address}
                                        onChange={onNewMemberDetailsChange}
                                        placeholder={t("VaultEditor.contract-address-placeholder")}
                                    />
                                </div>
                            </div>
                            <button className="fill" onClick={() => updateMembers(newMemberDetails, memberIndex)}>
                                {t("VaultEditor.add-member")}
                            </button>
                        </div>
                    </div>
                </div>
            </section> */}
    </>
  );
}