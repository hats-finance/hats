import { useFieldArray, useFormContext } from "react-hook-form";
import CommitteeMemberForm from "./CommitteeMemberForm/CommitteeMemberForm";

export function CommitteeMembersList() {

  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "committee.members" });

  const appendEmpty = () => {
    append({ name: "", "twitter-link": "", address: "", "image-ipfs-link": "" });
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
