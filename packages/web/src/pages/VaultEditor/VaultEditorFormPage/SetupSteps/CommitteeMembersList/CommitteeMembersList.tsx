import { useContext } from "react";
import { createNewCommitteeMember, IEditedVaultDescription } from "@hats.finance/shared";
import { useTranslation } from "react-i18next";
import { Alert, Button } from "components";
import { useEnhancedFormContext } from "hooks/form/useEnhancedFormContext";
import { getPath } from "utils/objects.utils";
import CommitteeMemberForm from "./CommitteeMemberForm/CommitteeMemberForm";
import { VaultEditorFormContext } from "../../store";
import AddIcon from "@mui/icons-material/Add";

export function CommitteeMembersList() {
  const { t } = useTranslation();

  const { committeeMembersFieldArray, allFormDisabled } = useContext(VaultEditorFormContext);
  const { fields: members, append, remove } = committeeMembersFieldArray;

  const {
    formState: { errors },
  } = useEnhancedFormContext<IEditedVaultDescription>();

  const lastMultisigMemberIdx = members.length - 1 - [...members].reverse().findIndex((member) => member.linkedMultisigAddress);

  return (
    <>
      {members.length < 2 && <Alert className="mt-5 mb-5" content={t("weRecommendToAddAtLeastTwoMembers")} type="warning" />}

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

      {getPath(errors, "committee.members")?.type === "min-pgp-keys-required" && (
        <Alert className="mt-5" content={getPath(errors, "committee.members")?.message} type="error" />
      )}
    </>
  );
}
