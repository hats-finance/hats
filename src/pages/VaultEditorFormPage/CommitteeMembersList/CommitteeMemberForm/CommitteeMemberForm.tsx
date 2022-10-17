import { useTranslation } from "react-i18next";
import { UseFieldArrayRemove, useFormContext } from "react-hook-form";
import { FormInput, FormIconInput } from "components";
import RemoveIcon from "assets/icons/remove-member.svg";
import { ICommitteeMember } from "types/types";
import { createNewCommitteeMember } from "../../utils";
import { IEditedVaultDescription } from "../../types";
import { StyledCommitteeMemberForm } from "./styles";

type CommitteeMemberFormProps = {
  index: number;
  append: (data: ICommitteeMember) => void;
  remove: UseFieldArrayRemove;
};

const CommitteeMemberForm = ({ index, append, remove }: CommitteeMemberFormProps) => {
  const { t } = useTranslation();
  const { register, watch, formState, getFieldState } = useFormContext<IEditedVaultDescription>();

  const members = watch("committee.members") as ICommitteeMember[];
  const membersCount = members.length;

  return (
    <StyledCommitteeMemberForm>
      <div className="member-details">
        <div className="index-number">{index + 1}</div>

        <div className="content">
          <div className="inputs">
            <FormInput
              {...register(`committee.members.${index}.name`)}
              isDirty={getFieldState(`committee.members.${index}.name`, formState).isDirty}
              label={t("VaultEditor.member-name")}
              colorable
              placeholder={t("VaultEditor.member-name-placeholder")}
            />

            <FormInput
              {...register(`committee.members.${index}.twitter-link`)}
              isDirty={getFieldState(`committee.members.${index}.twitter-link`, formState).isDirty}
              label={t("VaultEditor.member-twitter")}
              pastable
              colorable
              placeholder={t("VaultEditor.member-twitter-placeholder")}
            />

            <FormInput
              {...register(`committee.members.${index}.address`)}
              isDirty={getFieldState(`committee.members.${index}.address`, formState).isDirty}
              label={t("VaultEditor.member-address")}
              pastable
              colorable
              placeholder={t("VaultEditor.member-address-placeholder")}
            />
          </div>

          <div>
            <FormIconInput
              {...register(`committee.members.${index}.image-ipfs-link`)}
              isDirty={getFieldState(`committee.members.${index}.image-ipfs-link`, formState).isDirty}
              label={t("VaultEditor.member-image")}
              colorable
            />
          </div>
        </div>
      </div>

      <div className="controller-buttons">
        {membersCount > 1 && (
          <button type="button" className="fill" onClick={() => remove(index)}>
            <img src={RemoveIcon} height={12} alt="remove-member" />
            {` ${t("VaultEditor.remove-member")}`}
          </button>
        )}
        {index === membersCount - 1 && (
          <button type="button" className="fill" onClick={() => append(createNewCommitteeMember())}>
            {t("VaultEditor.add-member")}
          </button>
        )}
      </div>
    </StyledCommitteeMemberForm>
  );
};

export default CommitteeMemberForm;
