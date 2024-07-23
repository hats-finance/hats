import { HATToken_abi, HATTokensConfig } from "@hats.finance/shared";
import HatsLogo from "assets/icons/hats-logo-circle.svg";
import TwitterIcon from "assets/icons/social/twitter.icon";
import { Alert, Button, HackerProfileImage, Loading, Modal, WithTooltip } from "components";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import useModal from "hooks/useModal";
import { IDelegateeInfo } from "pages/Airdrops/airdropsService";
import { useDelegatees } from "pages/Airdrops/hooks";
import { useCachedProfile } from "pages/HackerProfile/useCachedProfile";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Identicon from "react-identicons";
import { IS_PROD, appChains } from "settings";
import { ipfsTransformUri } from "utils";
import { shortenIfAddress } from "utils/addresses.utils";
import { useAccount, useContractRead, useNetwork, useWaitForTransaction } from "wagmi";
import { DelegateHATTokensContract } from "./contracts/DelegateHATTokens";
import { StyledDelegateManager, StyledDelegateeCard, StyledSuccessModal } from "./styles";

export const DelegateManager = () => {
  const { t } = useTranslation();

  const [showingMoreDelegate, setShowingMoreDelegate] = useState<IDelegateeInfo>();

  const { address: account } = useAccount();
  const { chain: connectedChain } = useNetwork();

  const { isShowing: isShowingSuccessModal, show: showSuccessModal, hide: hideSuccessModal } = useModal();
  const [isEditingDelegate, setIsEditingDelegate] = useState(false);
  const [delegateToSet, setDelegateToSet] = useState<string>();

  const isTestnet = connectedChain?.testnet;
  const env = isTestnet && !IS_PROD ? "test" : "prod";

  const tokenInfo = Object.entries(HATTokensConfig[env]).find(([chainId]) => Number(chainId) === connectedChain?.id);
  const hatInChains = Object.keys(HATTokensConfig[env]).map((chainId: string) => appChains[Number(chainId)].chain);

  const {
    data: delegate,
    isLoading: isLoadingDelegate,
    refetch: refetchDelegate,
  } = useContractRead({
    address: tokenInfo?.[1]?.address as `0x${string}` | undefined,
    abi: HATToken_abi,
    functionName: "delegates",
    chainId: Number(tokenInfo?.[0]),
    args: [account ?? "0x0000000000000000000000000000000000000000"],
    enabled: !!account && !!tokenInfo,
  });

  const { data: delegateOptions, isLoading: isLoadingDelegateOptions } = useDelegatees(
    tokenInfo?.[1]?.address,
    Number(tokenInfo?.[0])
  );

  const needsDelegate = !delegate || delegate === "0x0000000000000000000000000000000000000000";
  const currentDelegateOpt = delegateOptions?.find((option) => option.address.toLowerCase() === delegate?.toLowerCase());

  const delegateHATCall = DelegateHATTokensContract.hook(tokenInfo?.[1]?.address, Number(tokenInfo?.[0]));
  const waitingDelegateHATCall = useWaitForTransaction({
    hash: delegateHATCall.data?.hash as `0x${string}`,
    onSuccess: async () => {
      await refetchDelegate();
      showSuccessModal();
      setDelegateToSet(undefined);
      setIsEditingDelegate(false);
    },
  });

  return (
    <StyledDelegateManager>
      <h1>{t("MyWallet.delegateSelection")}</h1>
      {!isLoadingDelegate && !isLoadingDelegateOptions && (
        <>
          {tokenInfo ? (
            <>
              <p className="mt-3" dangerouslySetInnerHTML={{ __html: t("MyWallet.delegateSelectionExplanation") }} />
              <p className="mt-3 mb-4">{needsDelegate ? t("MyWallet.chooseADelegate") : t("MyWallet.yourDelegate")}:</p>
              {needsDelegate || isEditingDelegate ? (
                <div className="change-delegate-container">
                  <div className="delegatees-list">
                    {delegateOptions?.map((delegatee) => (
                      <DelegateeCard
                        delegatee={delegatee}
                        selected={
                          delegateToSet
                            ? delegateToSet.toLowerCase() === delegatee.address.toLowerCase()
                            : currentDelegateOpt?.address.toLowerCase() === delegatee.address.toLowerCase()
                        }
                        onSelect={(address) => setDelegateToSet(address.toLowerCase())}
                        onShowMore={!!delegatee ? () => setShowingMoreDelegate(delegatee as IDelegateeInfo) : undefined}
                      />
                    ))}
                  </div>
                  <div className="buttons">
                    {isEditingDelegate && (
                      <Button
                        styleType="outlined"
                        className="mt-5"
                        onClick={() => {
                          setIsEditingDelegate(false);
                          setDelegateToSet(undefined);
                        }}
                      >
                        {t("MyWallet.cancelEdition")}
                      </Button>
                    )}
                    <Button
                      disabled={!delegateToSet || delegateToSet.toLowerCase() === delegate?.toLowerCase()}
                      bigHorizontalPadding
                      className="mt-5"
                      onClick={() => delegateHATCall.send(delegateToSet)}
                    >
                      {t("MyWallet.submitDelegate")}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {currentDelegateOpt ? (
                    <DelegateeCard delegatee={currentDelegateOpt as IDelegateeInfo | "self"} />
                  ) : (
                    <>
                      {delegate.toLowerCase() === account?.toLowerCase() ? (
                        <DelegateeCard delegatee="self" />
                      ) : (
                        <DelegateeCard delegatee={{ address: delegate }} />
                      )}
                    </>
                  )}
                  <Button bigHorizontalPadding className="mt-5" onClick={() => setIsEditingDelegate((prev) => !prev)}>
                    {t("MyWallet.editDelegate")}
                  </Button>
                </>
              )}
            </>
          ) : (
            <Alert type="warning" className="mt-3">
              {t("MyWallet.hatsTokenNotInChainError", {
                connected: connectedChain?.name,
                correctChains: hatInChains.map((chain) => chain.name).join(", "),
              })}
            </Alert>
          )}
        </>
      )}

      {delegateHATCall.isLoading && <Loading fixed extraText={`${t("checkYourConnectedWallet")}...`} />}
      {waitingDelegateHATCall.isLoading && <Loading fixed extraText={`${t("MyWallet.delegatingYourTokens")}...`} />}

      <Modal isShowing={isShowingSuccessModal} onHide={hideSuccessModal}>
        <StyledSuccessModal>
          <img src={require("assets/images/success_check.png")} alt="success" />
          <h2>{t("MyWallet.delegateSubmitted")}</h2>
          <p>{t("MyWallet.delegateSubmittedExplanation")}</p>
          <Button bigHorizontalPadding className="mt-5" onClick={hideSuccessModal}>
            {t("done")}
          </Button>
        </StyledSuccessModal>
      </Modal>

      <Modal isShowing={!!showingMoreDelegate} onHide={() => setShowingMoreDelegate(undefined)} hideCloseIcon>
        <>{showingMoreDelegate && <DelegateeCard delegatee={showingMoreDelegate} modal />}</>
      </Modal>
    </StyledDelegateManager>
  );
};

const DelegateeCard = ({
  delegatee,
  selected = false,
  onSelect = undefined,
  onShowMore,
  modal = false,
}: {
  delegatee: IDelegateeInfo | "self";
  selected?: boolean;
  onSelect?: (address: string) => void;
  onShowMore?: () => void;
  modal?: boolean;
}) => {
  const { t } = useTranslation();
  const hackerProfile = useCachedProfile(delegatee !== "self" ? delegatee.hatsProfile : undefined);

  const getDelegateeIcon = () => {
    if (!delegatee || delegatee === "self") return null;
    if (hackerProfile) return <HackerProfileImage size="fit" hackerProfile={hackerProfile} />;
    if (delegatee.icon) return <img src={ipfsTransformUri(delegatee.icon, { isPinned: true })} alt="avatar" />;
    return <Identicon string={delegatee.address} bg="#fff" size={50} />;
  };

  return (
    <StyledDelegateeCard
      modal={modal}
      onClick={() => onSelect?.(delegatee === "self" ? "self" : delegatee.address)}
      selected={selected}
    >
      {delegatee === "self" ? (
        <div className="delegate-self">
          <p>{t("Airdrop.delegateSelf")}</p>
        </div>
      ) : (
        <>
          <div className="icon">{getDelegateeIcon()}</div>
          <WithTooltip text={delegatee.address} placement="bottom">
            <div className="address">{shortenIfAddress(delegatee.address)}</div>
          </WithTooltip>
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
