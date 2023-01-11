import { useFieldArray } from "react-hook-form";
import { useEnhancedFormContext } from "hooks/useEnhancedFormContext";
import CommitteeMemberForm from "./CommitteeMemberForm/CommitteeMemberForm";
import { IEditedVaultDescription } from "../types";

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
