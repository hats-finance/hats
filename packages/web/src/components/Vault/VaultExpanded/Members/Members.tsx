import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { ipfsTransformUri } from "utils";
import TwitterImageIcon from "assets/icons/twitterImage.icon";
import { ICommitteeMember } from "types";
import "./Members.scss";

interface IProps {
  members: Array<ICommitteeMember>;
  preview?: boolean;
}

export default function Members(props: IProps) {
  const members = props.members?.map((member: ICommitteeMember, index: number) => {
    return (
      <a className="member-link-wrapper" key={index} href={member?.["twitter-link"]} {...defaultAnchorProps}>
        {member?.["image-ipfs-link"] ? (
          <img
            src={ipfsTransformUri(member?.["image-ipfs-link"], { isPinned: !props.preview })}
            alt="twitter avatar"
            className="twitter-avatar"
          />
        ) : (
          <TwitterImageIcon />
        )}
        <span className="member-username">{member.name}</span>
      </a>
    );
  });
  return <>{members}</>;
}
