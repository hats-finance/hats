import { useTranslation } from "react-i18next";
import RemoveIcon from "assets/icons/remove-member.svg";
import { HatsFormInput, IconEditor } from "components";
import { StyledCommitteeMemberForm } from "./styles";
import { UseFieldArrayRemove, useFormContext } from "react-hook-form";

type CommitteeMemberFormProps = {
  index: number;
  membersCount: number;
  append: () => void;
  remove: UseFieldArrayRemove;
};

const CommitteeMemberForm = ({ index, membersCount, append, remove }: CommitteeMemberFormProps) => {
  const { t } = useTranslation();
  const { register } = useFormContext();
  const basePath = `committee.members.${index}`;

  return (
    <StyledCommitteeMemberForm>
      <div className="member-details">
        <div className="index-number">{index + 1}</div>

        <div className="content">
          <div className="inputs">
            <label>{t("VaultEditor.member-name")}</label>
            <HatsFormInput
              colorable
              {...register(`${basePath}.name`)}
              placeholder={t("VaultEditor.member-name-placeholder")}
            />
            <label>{t("VaultEditor.member-twitter")}</label>
            <HatsFormInput
              {...register(`${basePath}.twitter-link`)}
              pastable
              colorable
              placeholder={t("VaultEditor.member-twitter-placeholder")}
            />
            <label>{t("VaultEditor.member-address")}</label>
            <HatsFormInput
              {...register(`${basePath}.address`)}
              pastable
              colorable
              placeholder={t("VaultEditor.member-address-placeholder")}
            />
          </div>
          <div>
            <label>{t("VaultEditor.member-image")}</label>
            <IconEditor
              {...register(`${basePath}.image-ipfs-link`)}
              colorable
            />
          </div>
        </div>
      </div>

      <div className="controller-buttons">
        {membersCount > 1 && (
          <button className="fill" onClick={() => remove(index)}>
            <img src={RemoveIcon} height={12} alt="remove-member" />
            {` ${t("VaultEditor.remove-member")}`}
          </button>
        )}
        {index === membersCount - 1 && (
          <button className="fill" onClick={append}>
            {t("VaultEditor.add-member")}
          </button>
        )}
      </div>
    </StyledCommitteeMemberForm>
  );
};

export default CommitteeMemberForm;