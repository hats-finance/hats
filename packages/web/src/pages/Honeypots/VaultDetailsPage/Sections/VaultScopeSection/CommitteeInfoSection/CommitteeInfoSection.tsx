import { IVault } from "@hats.finance/shared";
import profilePlaceholder from "assets/images/profile-placeholder.jpg";
import { CopyToClipboard } from "components";
import { useTranslation } from "react-i18next";
import { ipfsTransformUri } from "utils";
import { shortenIfAddress } from "utils/addresses.utils";
import { StyledCommitteeInfoSection } from "./styles";

type CommitteeInfoSectionProps = {
  vault: IVault;
  noDeployed?: boolean;
};

export const CommitteeInfoSection = ({ vault, noDeployed = false }: CommitteeInfoSectionProps) => {
  const { t } = useTranslation();

  if (!vault.description) return null;

  const committee = vault.description.committee;
  const committeeAddress = vault.committee;

  return (
    <StyledCommitteeInfoSection className="subsection-container">
      <div className="committee-address">
        <span className="bold">{t("committeeMultisigAddress")}:</span>
        <span>{shortenIfAddress(committeeAddress, { startLength: 6, endLength: 6 })}</span>
        <CopyToClipboard valueToCopy={committeeAddress} />
      </div>

      <div className="members">
        {committee.members.map((member, idx) => (
          <div className="member" key={idx}>
            <img
              src={
                member["image-ipfs-link"]
                  ? ipfsTransformUri(member["image-ipfs-link"], { isPinned: !noDeployed })
                  : profilePlaceholder
              }
              alt={member.name}
            />
            <p className="bold mt-2">{member.name}</p>
            <p>{member["twitter-link"]?.split("/").pop() ?? ""}</p>
          </div>
        ))}
      </div>
    </StyledCommitteeInfoSection>
  );
};
