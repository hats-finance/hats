import CloseIcon from "assets/icons/close.icon";
import classNames from "classnames";
import { EligibilityStatus } from "components/Airdrop/constants";
import Loading from "components/Shared/Loading";
import { Colors } from "constants/constants";
import { isAddress } from "ethers/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "reducers";
import { normalizeAddress } from "../../../../utils";
//import TokenAirdrop from "../TokenAirdrop/TokenAirdrop";
import NFTAirdrop from "../NFTAirdop/NFTAirdrop";
import { useParams } from "react-router-dom";
import { useActions } from "actions/contractsActions";
import "./index.scss";
import { useTranslation } from "react-i18next";

export default function Airdrop() {
  const { t } = useTranslation();
  const { hasClaimed, isRedeemed } = useActions();
  const { walletAddress } = useParams();
  const [userInput, setUserInput] = useState(walletAddress);
  const nftET = useSelector((state: RootState) => state.dataReducer.airdrop?.nft);
  const tokenET = useSelector((state: RootState) => state.dataReducer.airdrop?.token);
  const [nftEligibilityStatus, setNFTEligibilityStatus] = useState(EligibilityStatus.UNKNOWN);
  const [tokenId, setTokenId] = useState<string>();
  //const [tokenEligibilityStatus, setTokenEligibilityStatus] = useState(EligibilityStatus.UNKNOWN);
  //const [tokenAmount, setTokenAmount] = useState<number>();
  const [inTokenAirdop, setInTokenAirdrop] = useState(false);

  const checkAirdrop = useCallback(async () => {
    if (userInput && isAddress(userInput) && nftET) {
      const address = normalizeAddress(userInput);
      if (Object.values(nftET).includes(address)) {
        const tokenId = Object.keys(nftET!).find(key => nftET[key] === address);
        setTokenId(tokenId);
        if (tokenId && await isRedeemed(tokenId, address)) {
          setNFTEligibilityStatus(EligibilityStatus.REDEEMED);
        } else {
          setNFTEligibilityStatus(EligibilityStatus.ELIGIBLE);
        }
      } else {
        setNFTEligibilityStatus(EligibilityStatus.NOT_ELIGIBLE);
      }

      // TODO: Temporary disable Token Airdrop
      // if (tokenET) {
      //   if (Object.keys(tokenET).includes(address)) {
      //     setTokenAmount(tokenET[address]);
      //     if (await hasClaimed(address)) {
      //       setTokenEligibilityStatus(EligibilityStatus.REDEEMED);
      //     } else {
      //       setTokenEligibilityStatus(EligibilityStatus.ELIGIBLE);
      //     }
      //   } else {
      //     setTokenEligibilityStatus(EligibilityStatus.NOT_ELIGIBLE);
      //   }
      // }

    } else {
      setNFTEligibilityStatus(EligibilityStatus.UNKNOWN);
      //setTokenEligibilityStatus(EligibilityStatus.UNKNOWN);
    }
  }, [nftET, tokenET, hasClaimed, isRedeemed, userInput])

  useEffect(() => {
    checkAirdrop();
  }, [checkAirdrop])

  useEffect(() => {
    checkAirdrop();
  }, [userInput, checkAirdrop])

  // TODO: Temporary disable Token Airdrop
  // const renderTokenAirdrop = (tokenEligibilityStatus: EligibilityStatus) => {
  //   switch (tokenEligibilityStatus) {
  //     case EligibilityStatus.REDEEMED:
  //     case EligibilityStatus.ELIGIBLE:
  //       return (
  //         <TokenAirdrop
  //           address={normalizeAddress(userInput!)}
  //           eligibilityStatus={tokenEligibilityStatus}
  //           tokenAmount={tokenAmount!}
  //           eligibleTokens={tokenET!}
  //           setInTokenAirdrop={setInTokenAirdrop}
  //           setTokenEligibilityStatus={setTokenEligibilityStatus} />);
  //     case EligibilityStatus.NOT_ELIGIBLE:
  //       return <div className="error-label">{t("Airdrop.not-eligible-token")}</div>;
  //   }
  // }

  const renderNFTAirdrop = (nftEligibilityStatus: EligibilityStatus) => {
    switch (nftEligibilityStatus) {
      case EligibilityStatus.REDEEMED:
      case EligibilityStatus.ELIGIBLE:
        return (
          <NFTAirdrop
            tokenId={tokenId!}
            eligibleTokens={nftET!}
            walletAddress={normalizeAddress(userInput!)}
            eligibilityStatus={nftEligibilityStatus}
            setEligibilityStatus={setNFTEligibilityStatus} />);
      case EligibilityStatus.NOT_ELIGIBLE:
        return <div className="error-label">{t("Airdrop.not-eligible-nft")}</div>;
    }
  }

  return (
    <div className={classNames({ "content": true, "airdrop-wrapper": true, "disabled": !nftET || !tokenET })}>
      <div className="airdorp-content">
        {!inTokenAirdop && (
          <div className="search-wrapper">
            <span>{t("Airdrop.enter-address")}</span>
            <div className={classNames({ "input-container": true, "input-error": userInput && !isAddress(userInput) })}>
              <input className="address-input" type="text" value={userInput} placeholder={t("Airdrop.search-placeholder")} onChange={(e) => setUserInput(e.target.value)} />
              <button className="clear-input" onClick={() => setUserInput("")}><CloseIcon width="10" height="10" fill={Colors.gray} /></button>
            </div>
            {userInput && !isAddress(userInput) && <span className="error-label">{t("Airdrop.search-error")}</span>}
          </div>
        )}
        {/* {renderTokenAirdrop(tokenEligibilityStatus)} */}
        {!inTokenAirdop && renderNFTAirdrop(nftEligibilityStatus)}

        {(!nftET || !tokenET) && <Loading />}
      </div>
    </div>
  )
}
