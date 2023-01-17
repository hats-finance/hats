import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "components";
import CommitteeMemberForm from "./CommitteeMemberForm/CommitteeMemberForm";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { IEditedVaultDescription } from "../types";
import { createNewCommitteeMember } from "../utils";
import AddIcon from "@mui/icons-material/Add";

export function CommitteeMembersList() {
  const { t } = useTranslation();

  const { control } = useEnhancedFormContext<IEditedVaultDescription>();
  const { fields: members, append, remove } = useFieldArray({ control, name: "committee.members" });

  return (
    <>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorCommitteeMembersSafeExplanation") }} />

      {members.map((member, index) => (
        <CommitteeMemberForm key={member.id} index={index} append={append} remove={remove} membersCount={members.length} />
      ))}

      <Button styleType="invisible" onClick={() => append(createNewCommitteeMember())}>
        <AddIcon className="mr-1" />
        <span>{t("addMember")}</span>
      </Button>
    </>
  );
}
