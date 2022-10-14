import { useTranslation } from "react-i18next";
import { UseFieldArrayRemove, useFormContext } from "react-hook-form";
import { FormInput, FormIconInput } from "components";
import RemoveIcon from "assets/icons/remove-member.svg";
import { ICommitteeMember } from "types/types";
import { StyledCommitteeMemberForm } from "./styles";

type CommitteeMemberFormProps = {
  index: number;
  append: (data: any) => void;
  remove: UseFieldArrayRemove;
};

const CommitteeMemberForm = ({ index, append, remove }: CommitteeMemberFormProps) => {
  const { t } = useTranslation();
  const basePath = `committee.members.${index}`;
  const { register, watch } = useFormContext();
  const members = watch("committee.members") as ICommitteeMember[];
  const membersCount = members.length;

  return (
    <StyledCommitteeMemberForm>
      <div className="member-details">
        <div className="index-number">{index + 1}</div>

        <div className="content">
          <div className="inputs">
            <label>{t("VaultEditor.member-name")}</label>
            <FormInput {...register(`${basePath}.name`)} colorable placeholder={t("VaultEditor.member-name-placeholder")} />
            <label>{t("VaultEditor.member-twitter")}</label>
            <FormInput
              {...register(`${basePath}.twitter-link`)}
              pastable
              colorable
              placeholder={t("VaultEditor.member-twitter-placeholder")}
            />
            <label>{t("VaultEditor.member-address")}</label>
            <FormInput
              {...register(`${basePath}.address`)}
              pastable
              colorable
              placeholder={t("VaultEditor.member-address-placeholder")}
            />
          </div>
          <div>
            <label>{t("VaultEditor.member-image")}</label>
            <FormIconInput {...register(`${basePath}.image-ipfs-link`)} colorable />
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
