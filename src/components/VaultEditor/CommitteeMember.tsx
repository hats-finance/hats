import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";
import { useTranslation } from "react-i18next";
import IconInput from "./IconEditor";
import RemoveIcon from "assets/icons/remove-member.svg";
import { IPFS_PREFIX } from "../../constants/constants";

export default function CommmitteeMember({ index, member, onChange, onRemove, membersCount, addMember }) {
    const { t } = useTranslation();
    const basePath = `committee.members.${index}`;

    const verifyIPFSLink = (memberLink: string) => {
        if (memberLink.startsWith("ipfs/")) {
            return memberLink.slice(5);
        } else if (memberLink.startsWith("ipfs://")) {
            return memberLink.slice(7);
        }
        return memberLink;
    }

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
                        colorable
                        name={`${basePath}.name`}
                        value={member.name || ''}
                        onChange={onChange}
                        placeholder={t("VaultEditor.member-name-placeholder")}
                    />
                    <label>{t("VaultEditor.member-twitter")}</label>
                    <EditableContent
                        textInput
                        pastable
                        colorable
                        name={`${basePath}.twitter-link`}
                        value={member["twitter-link"] || ''}
                        onChange={onChange}
                        placeholder={t("VaultEditor.member-twitter-placeholder")}
                    />
                    <label>{t("VaultEditor.member-address")}</label>
                    <EditableContent
                        textInput
                        pastable
                        colorable
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
                            colorable
                            value={
                                member?.["image-ipfs-link"]
                                  ? member?.["image-ipfs-link"].startsWith("blob")
                                    ? member?.["image-ipfs-link"]
                                    : `${IPFS_PREFIX}${verifyIPFSLink(member?.["image-ipfs-link"])}`
                                  : ""
                            }
                            onChange={onChange} />
                    </div>
                </div>
            </div>
        </div>
        <div className="committee-members__member-buttons">
            {membersCount > 1 && (
                <button className="fill" onClick={() => onRemove(index)}>
                    <img src={RemoveIcon} height={12} alt="remove-member" />
                    {` ${t("VaultEditor.remove-member")}`}
                </button>
            )}
            {(index === membersCount - 1) && (
                <button className="fill" onClick={addMember}>
                    {t("VaultEditor.add-member")}
                </button>
            )}
        </div>
    </>
}