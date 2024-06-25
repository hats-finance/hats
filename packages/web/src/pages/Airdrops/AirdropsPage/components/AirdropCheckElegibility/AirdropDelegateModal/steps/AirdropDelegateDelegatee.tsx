import { HATToken_abi } from "@hats.finance/shared";
import TwitterIcon from "assets/icons/social/twitter.icon";
import { Button } from "components";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { IDelegateeInfo } from "pages/Airdrops/airdropsService";
import { useDelegatees } from "pages/Airdrops/hooks";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Identicon from "react-identicons";
import { ipfsTransformUri } from "utils";
import { shortenIfAddress } from "utils/addresses.utils";
import { Amount } from "utils/amounts.utils";
import { useContractRead } from "wagmi";
import { AirdropDelegateModalContext } from "../store";
import { StyledDelegateeCard } from "../styles";

const DELEGATEES_PER_PAGE = 4;

export const AirdropDelegateDelegatee = () => {
  const { t } = useTranslation();
  const { nextStep, selectedDelegatee } = useContext(AirdropDelegateModalContext);

  const { data: delegatees, isLoading } = useDelegatees();
  const [page, setPage] = useState(0);

  const delegateesToShow = delegatees?.slice(page * DELEGATEES_PER_PAGE, (page + 1) * DELEGATEES_PER_PAGE);
  const totalPages = delegatees ? Math.ceil(delegatees?.length / DELEGATEES_PER_PAGE) : 1;

  return (
    <div className="content-modal">
      <img className="banner" src={require("assets/images/hats_claim.png")} alt="hats claim" />
      <h2>{t("Airdrop.chooseDelegatee")}</h2>

      <div className="delegatees-list">
        {isLoading ? <div>Loading...</div> : delegateesToShow?.map((delegatee) => <DelegateeCard delegatee={delegatee} />)}
      </div>

      <div className={`buttons ${totalPages === 1 ? "center" : ""}`}>
        {totalPages > 1 && (
          <div className="left">
            <Button
              styleType="outlined"
              size="medium"
              disabled={page === 0}
              onClick={() => setPage((prev) => (prev === 0 ? prev : prev - 1))}
            >
              ⬅️
            </Button>
            <Button
              size="medium"
              disabled={page === totalPages - 1}
              onClick={() => setPage((prev) => (prev === totalPages - 1 ? prev : prev + 1))}
            >
              ➡️
            </Button>
          </div>
        )}
        <Button onClick={nextStep} disabled={!selectedDelegatee} bigHorizontalPadding>
          {t("Airdrop.selectDelegatee")}
        </Button>
      </div>
    </div>
  );
};

const DelegateeCard = ({ delegatee }: { delegatee: IDelegateeInfo }) => {
  const { selectedDelegatee, setSelectedDelegatee, airdropData } = useContext(AirdropDelegateModalContext);

  const { data: delegateeVotes, isLoading } = useContractRead({
    address: airdropData ? (airdropData.token as `0x${string}`) : undefined,
    abi: HATToken_abi,
    functionName: "getVotes",
    args: [delegatee.address as `0x${string}`],
    chainId: airdropData.chainId,
  });

  const getDelegateeIcon = () => {
    if (!delegatee) return null;
    if (delegatee.icon) return <img src={ipfsTransformUri(delegatee.icon, { isPinned: true })} alt="avatar" />;
    return <Identicon string={delegatee.address} bg="#fff" size={50} />;
  };

  return (
    <StyledDelegateeCard
      onClick={() => setSelectedDelegatee(delegatee.address)}
      selected={selectedDelegatee === delegatee.address}
    >
      <div className="icon">{getDelegateeIcon()}</div>
      {!isLoading && <div className="votes">{new Amount(delegateeVotes, 18).number.toFixed(2)} votes</div>}
      <div className="address">{shortenIfAddress(delegatee.address)}</div>
      <div className="name">
        <span>{delegatee.name}</span>
        {delegatee.twitterProfile && (
          <a {...defaultAnchorProps} href={`https://twitter.com/${delegatee.twitterProfile}`}>
            <TwitterIcon />
          </a>
        )}
      </div>

      <div className="description" dangerouslySetInnerHTML={{ __html: delegatee.description }} />
    </StyledDelegateeCard>
  );
};
