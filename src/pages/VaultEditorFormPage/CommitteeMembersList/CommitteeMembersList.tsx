import { useFieldArray } from "react-hook-form";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import { IEditedVaultDescription } from "../types";
import CommitteeMemberForm from "./CommitteeMemberForm/CommitteeMemberForm";

export function CommitteeMembersList() {
  const { control } = useEnhancedFormContext<IEditedVaultDescription>();
  const { fields: members, append, remove } = useFieldArray({ control, name: "committee.members" });

  return (
    <>
      {members.map((member, index) => (
        <CommitteeMemberForm key={member.id} index={index} append={append} remove={remove} membersCount={members.length} />
      ))}
    </>
  );
}
