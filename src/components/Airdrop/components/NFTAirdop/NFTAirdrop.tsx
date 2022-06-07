import { useEffect, useState } from "react";
import axios from "axios";
import { useActions } from "actions/contractsActions";
import { Chains, IPFS_PREFIX } from "constants/constants";
import { INFTAirdropElement, NFTAirdropET } from "types/types";
import { isDateBefore } from "utils";
import Image from "../../../Shared/Image/Image";
import Countdown from "components/Shared/Countdown/Countdown";
import { EligibilityStatus } from "components/Airdrop/constants";
import { CHAINID, NFT_AIRDROP_ADDRESS } from "settings";
import OpenInIcon from "assets/icons/openIn.icon";
import { hashNFT } from "components/Airdrop/utils";
import { useEthers } from "@usedapp/core";
import { useRedeemNFT } from "hooks/contractHooks";
import "./index.scss";
import { useTranslation } from "react-i18next";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

interface IProps {
  tokenId: string
  eligibleTokens: NFTAirdropET
  walletAddress: string
  eligibilityStatus: EligibilityStatus
  setEligibilityStatus: (value: EligibilityStatus) => void
}

export default function NFTAirdrop({ tokenId, eligibleTokens, walletAddress, eligibilityStatus, setEligibilityStatus }: IProps) {
  const chain = Chains[CHAINID];
  const { getBaseURI, getDeadline } = useActions();
  const { account } = useEthers();
  const merkleTree = new MerkleTree(Object.entries(eligibleTokens).map(token => hashNFT(...token)), keccak256, { sortPairs: true });
  const [deadline, setDeadline] = useState();
  const redeemable = deadline ? isDateBefore(deadline) : false;
  const [nftData, setNftData] = useState<INFTAirdropElement>();
  const { t } = useTranslation()

  useEffect(() => {
    (async () => {
      if (!deadline) {
        const deadline = await getDeadline();
        setDeadline(deadline);
      }
    })();
  }, [getDeadline, getBaseURI, deadline]);

  useEffect(() => {
    (async () => {
      try {
        if (!nftData) {
          const tokenBaseURI = await getBaseURI();
          const data = await axios.get(`${IPFS_PREFIX}/${tokenBaseURI.substring(7)}${tokenId}`);
          setNftData(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [tokenId, getBaseURI, nftData]);


  const { send: redeemNFT, state: redeemNFTState } = useRedeemNFT();

  const redeem = async () => {
    const proof = (merkleTree as any).getHexProof(hashNFT(tokenId, walletAddress));
    await redeemNFT(walletAddress, tokenId, proof);
  }

  useEffect(() => {
    if (redeemNFTState.status === "Success") {
      setEligibilityStatus(EligibilityStatus.REDEEMED);
    }
  }, [redeemNFTState.status, setEligibilityStatus])

  return (
    <fieldset className="nft-airdrop-wrapper">
      <legend>{t("Airdrop.NFTAirdrop.your-nft")}</legend>
      <div className="nft-container-wrapper">
        <span className="nft-text">{t("Airdrop.NFTAirdrop.nft-text")}</span>
        <div className="nft-container">
          {nftData && (
            <Image
              source={`${IPFS_PREFIX}/${nftData.image.substring(7)}`}
              alt="nft"
              className="nft-image" />
          )}
          {eligibilityStatus === EligibilityStatus.REDEEMED && (
            <span className="redeemed-info-wrapper">
              <span>{t("Airdrop.redeemed-link")}</span>
              <span className="open-in-icon" onClick={() => window.open(chain?.getExplorerAddressLink(NFT_AIRDROP_ADDRESS))}>
                <OpenInIcon />
              </span>
            </span>
          )}
          {eligibilityStatus !== EligibilityStatus.REDEEMED && (
            <>
              {redeemable ? (
                <>
                  <button
                    disabled={!account || !redeemable}
                    className="action-btn redeem-btn fill"
                    onClick={redeem}>{t("NFTAirdop.Redeem.redeem")}</button>
                  <Countdown endDate={deadline!} compactView />
                </>
              ) : "Redeem period ended"}
            </>
          )}
        </div>
      </div>
    </fieldset>
  )
}
