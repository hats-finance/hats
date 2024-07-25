import { BackArrowIcon } from "assets/icons/back-arrow";
import HatsLogo from "assets/icons/hats-logo-circle.svg";
import { NextArrowIcon } from "assets/icons/next-arrow";
import TwitterIcon from "assets/icons/social/twitter.icon";
import { Button, HackerProfileImage, Modal } from "components";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { IDelegateeInfo } from "pages/Airdrops/airdropsService";
import { useDelegatees } from "pages/Airdrops/hooks";
import { useCachedProfile } from "pages/HackerProfile/useCachedProfile";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import Identicon from "react-identicons";
import { ipfsTransformUri } from "utils";
import { shortenIfAddress } from "utils/addresses.utils";
import { AirdropRedeemModalContext } from "../store";
import { StyledDelegateeCard } from "../styles";

const DELEGATEES_PER_PAGE = 4;

export const AirdropRedeemDelegatee = () => {
  const { t } = useTranslation();
  const { nextStep, selectedDelegatee, airdropsData } = useContext(AirdropRedeemModalContext);
  const [showingMoreDelegate, setShowingMoreDelegate] = useState<IDelegateeInfo>();

  const { data: delegatees, isLoading } = useDelegatees(airdropsData[0].token, airdropsData[0].chainId);
  const delegateesToUse = delegatees ? [...delegatees, "self"] : [];
  const [page, setPage] = useState(0);

  const delegateesToShow = delegateesToUse?.slice(page * DELEGATEES_PER_PAGE, (page + 1) * DELEGATEES_PER_PAGE);
  const totalPages = delegateesToUse ? Math.ceil(delegateesToUse?.length / DELEGATEES_PER_PAGE) : 1;

  return (
    <>
      <div className="content-modal">
        {/* <img className="banner" src={require("assets/images/hats_delegatee.png")} alt="hats claim" /> */}
        <h2 className="mb-2">{t("Airdrop.chooseDelegatee")}</h2>
        <p dangerouslySetInnerHTML={{ __html: t("Airdrop.chooseDelegateeExplanation") }} />

        <div className="delegatees-list">
          {!isLoading && delegateesToShow && delegateesToShow?.length > 0 ? (
            delegateesToShow?.map((delegatee) => (
              <DelegateeCard
                delegatee={delegatee as IDelegateeInfo | "self"}
                onShowMore={delegatee !== "self" ? () => setShowingMoreDelegate(delegatee as IDelegateeInfo) : undefined}
              />
            ))
          ) : (
            <div>Loading...</div>
          )}
        </div>

        <div className="pages">
          {page + 1}/{totalPages}
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
                <BackArrowIcon />
              </Button>
              <Button
                size="medium"
                disabled={page === totalPages - 1}
                onClick={() => setPage((prev) => (prev === totalPages - 1 ? prev : prev + 1))}
              >
                <NextArrowIcon />
              </Button>
            </div>
          )}
          <Button onClick={nextStep} disabled={!selectedDelegatee} bigHorizontalPadding>
            {t("Airdrop.selectDelegatee")}
          </Button>
        </div>
      </div>

      <Modal isShowing={!!showingMoreDelegate} onHide={() => setShowingMoreDelegate(undefined)} hideCloseIcon>
        <>
          {showingMoreDelegate && (
            <>
              <DelegateeCard delegatee={showingMoreDelegate} modal />
              <div style={{ display: "flex", justifyContent: "center" }} className="mt-2">
                <Button
                  size="small"
                  className="show-more mb-1 mt-3"
                  styleType="invisible"
                  onClick={() => setShowingMoreDelegate(undefined)}
                >
                  {t("showLess")}
                </Button>
              </div>
            </>
          )}
        </>
      </Modal>
    </>
  );
};

const DelegateeCard = ({
  delegatee,
  onShowMore,
  modal = false,
}: {
  delegatee: IDelegateeInfo | "self";
  onShowMore?: () => void;
  modal?: boolean;
}) => {
  const { t } = useTranslation();
  const hackerProfile = useCachedProfile(delegatee !== "self" ? delegatee.hatsProfile : undefined);

  const { selectedDelegatee, setSelectedDelegatee } = useContext(AirdropRedeemModalContext);

  const getDelegateeIcon = () => {
    if (!delegatee || delegatee === "self") return null;
    if (hackerProfile) return <HackerProfileImage size="fit" hackerProfile={hackerProfile} />;
    if (delegatee.icon) return <img src={ipfsTransformUri(delegatee.icon, { isPinned: true })} alt="avatar" />;
    return <Identicon string={delegatee.address} bg="#fff" size={50} />;
  };

  return (
    <StyledDelegateeCard
      modal={modal}
      onClick={() => setSelectedDelegatee(delegatee === "self" ? "self" : delegatee.address)}
      selected={delegatee === "self" ? selectedDelegatee === "self" : selectedDelegatee === delegatee.address}
    >
      {delegatee === "self" ? (
        <div className="delegate-self">
          <p>{t("Airdrop.delegateSelf")}</p>
        </div>
      ) : (
        <>
          <div className="icon">{getDelegateeIcon()}</div>
          <div className="votes">{delegatee.votes ?? 0} votes</div>
          <div className="address">{shortenIfAddress(delegatee.address)}</div>
          <div className="name">
            {delegatee.name && <span>{delegatee.name}</span>}
            <div className="socials">
              {delegatee.hatsProfile && (
                <a {...defaultAnchorProps} href={`https://app.hats.finance/profile/${delegatee.hatsProfile}`}>
                  <img width={25} height={25} src={HatsLogo} alt="hats logo" />
                </a>
              )}
              {delegatee.twitterProfile && (
                <a {...defaultAnchorProps} href={`https://twitter.com/${delegatee.twitterProfile}`}>
                  <TwitterIcon />
                </a>
              )}
            </div>
          </div>

          {delegatee.description && <div className="description" dangerouslySetInnerHTML={{ __html: delegatee.description }} />}
          {!modal && (
            <Button size="small" className="show-more mb-1 mt-3" styleType="invisible" onClick={onShowMore}>
              {t("showMore")}
            </Button>
          )}
        </>
      )}
    </StyledDelegateeCard>
  );
};
