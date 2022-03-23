import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";
import { useTranslation } from "react-i18next";
import IconInput from "./IconEditor";
import RemoveIcon from "assets/icons/remove-member.svg";

export default function CommmitteeMember({ index, member, onChange, onRemove }) {
    const { t } = useTranslation();
    const basePath = `committee.members.${index}`;

    return <>
        <div className="committee-members__member">
            <div className="committee-members__member-number">
                {index + 1}
            </div>
            <div className="committee-members__member-content">
                <div className="committee-members__member-inputs">
                    <label>{t("VaultEditor.member-name")}</label>
                    <EditableContent
                        textInput
                        name={`${basePath}.name`}
                        value={member.name || ''}
                        onChange={onChange}
                        placeholder={t("VaultEditor.member-name-placeholder")}
                    />
                    <label>{t("VaultEditor.member-twitter")}</label>
                    <EditableContent
                        textInput
                        pastable
                        name={`${basePath}.twitter-link`}
                        value={member["twitter-link"] || ''}
                        onChange={onChange}
                        placeholder={t("VaultEditor.member-twitter-placeholder")}
                    />
                    <label>{t("VaultEditor.member-address")}</label>
                    <EditableContent
                        textInput
                        pastable
                        name={`${basePath}.address`}
                        value={member.address || ''}
                        onChange={onChange}
                        placeholder={t("VaultEditor.member-address-placeholder")}
                    />
                </div>
                <div className="committee-members__member-icons">
                    <div>
                        <label>{t("VaultEditor.member-image")}</label>
                        <IconInput
                            name={`${basePath}.image-ipfs-link`}
                            value={member["image-ipfs-link"] || ''}
                            onChange={onChange} />
                    </div>
                </div>
            </div>
        </div>
        <button className="fill" onClick={() => onRemove(index)}>
            <img src={RemoveIcon} height={12} alt="remove-member" />
            {` ${t("VaultEditor.remove-member")}`}
        </button>
    </>
}