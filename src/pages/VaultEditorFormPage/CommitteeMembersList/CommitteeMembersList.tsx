import { useFieldArray, useFormContext } from "react-hook-form";
import { newMember } from "../utils";
import CommitteeMemberForm from "./CommitteeMemberForm/CommitteeMemberForm";

export function CommitteeMembersList() {

  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "committee.members" });

  const appendEmpty = () => {
    append(newMember);
  }

  return (
    <>
      {fields.map((field, index) => (
        <CommitteeMemberForm
          key={field.id}
          index={index}
          membersCount={fields.length}
          append={appendEmpty}
          remove={remove}
        />
      ))}
    </>
  );
}
