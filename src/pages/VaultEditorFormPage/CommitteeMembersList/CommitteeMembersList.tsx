import { useFieldArray, useFormContext } from "react-hook-form";
import { IEditedVaultDescription } from "../types";
import CommitteeMemberForm from "./CommitteeMemberForm/CommitteeMemberForm";

export function CommitteeMembersList() {
  const { control } = useFormContext<IEditedVaultDescription>();
  const { fields: members, append, remove } = useFieldArray({ control, name: "committee.members" });

  return (
    <>
      {members.map((member, index) => (
        <CommitteeMemberForm key={member.id} index={index} append={append} remove={remove} />
      ))}
    </>
  );
}
