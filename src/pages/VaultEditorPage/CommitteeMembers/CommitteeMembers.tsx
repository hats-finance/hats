import React from "react";
import { ICommitteeMember } from "types/types";
import { CommmitteeMemberCard } from "./CommitteeMemberCard/CommitteeMemberCard";

type CommmitteeMembersProps = {
  members: ICommitteeMember[];
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRemove: (index: number) => void;
  addMember: () => void;
};

export default function CommmitteeMembers({ members, onChange, onRemove, addMember }: CommmitteeMembersProps) {
  return (
    <>
      {members.map((member, index) => (
        <CommmitteeMemberCard
          key={index}
          member={member}
          index={index}
          membersCount={members.length}
          onChange={onChange}
          onRemove={onRemove}
          addMember={addMember}
        />
      ))}
    </>
  );
}
