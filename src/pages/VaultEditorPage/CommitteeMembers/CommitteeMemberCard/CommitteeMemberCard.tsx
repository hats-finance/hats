import { useTranslation } from "react-i18next";
import { ICommitteeMember } from "types/types";
import RemoveIcon from "assets/icons/remove-member.svg";
import { EditableContent, IconEditor } from "components";
import { StyledCommitteeMemberCard } from "./styles";

type CommmitteeMemberCardProps = {
  index: number;
  member: ICommitteeMember;
  membersCount: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRemove: (index: number) => void;
  addMember: () => void;
};

const CommmitteeMemberCard = ({ index, member, onChange, onRemove, membersCount, addMember }: CommmitteeMemberCardProps) => {
  const { t } = useTranslation();
  const basePath = `committee.members.${index}`;

  return (
    <StyledCommitteeMemberCard>
      <div className="member-details">
        <div className="member-details__number">{index + 1}</div>

        <div className="member-details__content">
          <div className="member-details__inputs">
            <label>{t("VaultEditor.member-name")}</label>
            <EditableContent
              textInput
              colorable
              name={`${basePath}.name`}
              value={member.name || ""}
              onChange={onChange}
              placeholder={t("VaultEditor.member-name-placeholder")}
            />
            <label>{t("VaultEditor.member-twitter")}</label>
            <EditableContent
              textInput
              pastable
              colorable
              name={`${basePath}.twitter-link`}
              value={member["twitter-link"] || ""}
              onChange={onChange}
              placeholder={t("VaultEditor.member-twitter-placeholder")}
            />
            <label>{t("VaultEditor.member-address")}</label>
            <EditableContent
              textInput
              pastable
              colorable
              name={`${basePath}.address`}
              value={member.address || ""}
              onChange={onChange}
              placeholder={t("VaultEditor.member-address-placeholder")}
            />
          </div>
          <div>
            <label>{t("VaultEditor.member-image")}</label>
            <IconEditor name={`${basePath}.image-ipfs-link`} colorable value={member?.["image-ipfs-link"]} onChange={onChange} />
          </div>
        </div>
      </div>

      <div className="controller-buttons">
        {membersCount > 1 && (
          <button className="fill" onClick={() => onRemove(index)}>
            <img src={RemoveIcon} height={12} alt="remove-member" />
            {` ${t("VaultEditor.remove-member")}`}
          </button>
        )}
        {index === membersCount - 1 && (
          <button className="fill" onClick={addMember}>
            {t("VaultEditor.add-member")}
          </button>
        )}
      </div>
    </StyledCommitteeMemberCard>
  );
};

export default CommmitteeMemberCard;