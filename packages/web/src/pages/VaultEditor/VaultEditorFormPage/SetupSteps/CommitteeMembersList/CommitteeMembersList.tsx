import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "components";
import CommitteeMemberForm from "./CommitteeMemberForm/CommitteeMemberForm";
import { createNewCommitteeMember } from "@hats-finance/shared";
import { VaultEditorFormContext } from "../../store";
import AddIcon from "@mui/icons-material/Add";

export function CommitteeMembersList() {
  const { t } = useTranslation();

  const { committeeMembersFieldArray, allFormDisabled } = useContext(VaultEditorFormContext);
  const { fields: members, append, remove } = committeeMembersFieldArray;

  const lastMultisigMemberIdx = members.length - 1 - [...members].reverse().findIndex((member) => member.linkedMultisigAddress);

  return (
    <>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorCommitteeMembersSafeExplanation") }} />

      {members.map((member, index) => (
        <CommitteeMemberForm
          key={member.id}
          index={index}
          remove={remove}
          membersCount={members.length}
          isLastMultisigMember={index === lastMultisigMemberIdx}
        />
      ))}

      {!allFormDisabled && (
        <Button styleType="invisible" onClick={() => append(createNewCommitteeMember())}>
          <AddIcon className="mr-1" />
          <span>{t("addMember")}</span>
        </Button>
      )}
    </>
  );
}
