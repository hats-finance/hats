import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { t } from "i18next";
import { createTransaction, getBaseURI, getDeadline, redeemNFT } from "actions/contractsActions";
import { IPFS_PREFIX } from "constants/constants";
import { INFTAirdropElement, NFTAirdropET } from "types/types";
import { isDateBefore, isProviderAndNetwork, linkToTokenEtherscan } from "utils";
import Image from "../../../Shared/Image/Image";
import Countdown from "components/Shared/Countdown/Countdown";
import { RootState } from "reducers";
import { EligibilityStatus } from "components/Airdrop/constants";
import { NFT_AIRDROP_ADDRESS } from "settings";
import OpenInIcon from "assets/icons/openIn.icon";
import "./index.scss";
import { hashNFT } from "components/Airdrop/utils";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

interface IProps {
  tokenId: string
  eligibleTokens: NFTAirdropET
  walletAddress: string
  eligibilityStatus: EligibilityStatus
  setEligibilityStatus: (value: EligibilityStatus) => void
  pendingWallet: (value: boolean) => void
}

export default function NFTAirdrop({ tokenId, eligibleTokens, walletAddress, eligibilityStatus, setEligibilityStatus, pendingWallet }: IProps) {
  const dispatch = useDispatch();
  const provider = useSelector((state: RootState) => state.web3Reducer.provider);
  const [merkleTree, setMerkleTree] = useState();
  const [deadline, setDeadline] = useState();
  const [redeemable, setRedeemable] = useState(false);
  const [nftData, setNftData] = useState<INFTAirdropElement>();

  useEffect(() => {
    (async () => {
      const deadline = await getDeadline();
      setDeadline(deadline);
      setRedeemable(isDateBefore(deadline));
    })();
  }, [])

  useEffect(() => {
    try {
      setMerkleTree(new MerkleTree(Object.entries(eligibleTokens).map(token => hashNFT(...token)), keccak256, { sortPairs: true }));
    } catch (error) {
      console.error(error);
    }
  }, [eligibleTokens])

  useEffect(() => {
    (async () => {
      try {
        const tokenBaseURI = await getBaseURI();
        const data = await axios.get(`${IPFS_PREFIX}/${tokenBaseURI.substring(7)}${tokenId}`);
        setNftData(data.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [tokenId])

  const redeem = async () => {
    const proof = (merkleTree as any).getHexProof(hashNFT(tokenId, walletAddress));
    pendingWallet(true);
    await createTransaction(
      async () => redeemNFT(walletAddress, tokenId, proof),
      () => { },
      () => { setEligibilityStatus(EligibilityStatus.REDEEMED); pendingWallet(false); },
      () => { pendingWallet(false); },
      dispatch,
      t("Airdrop.NFTAirdrop.redeem-success")
    );
  }

  return (
    <fieldset className="nft-airdrop-wrapper">
      <legend>{t("Airdrop.NFTAirdrop.your-nft")}</legend>
      <div className="nft-container-wrapper">
        <span className="nft-text">{t("Airdrop.NFTAirdrop.nft-text")}</span>
        <div className="nft-container">
          <Image
            source={`${IPFS_PREFIX}/${nftData?.image.substring(7)}`}
            alt="nft"
            className="nft-image" />
          {eligibilityStatus === EligibilityStatus.REDEEMED && (
            <span className="redeemed-info-wrapper">
              <span>{t("Airdrop.redeemed-link")}</span>
              <span className="open-in-icon" onClick={() => window.open(linkToTokenEtherscan(NFT_AIRDROP_ADDRESS, tokenId))}>
                <OpenInIcon />
              </span>
            </span>
          )}
          {eligibilityStatus !== EligibilityStatus.REDEEMED && (
            <>
              {redeemable && <Countdown endDate={deadline!} compactView />}
              <button
                disabled={!isProviderAndNetwork(provider) || !redeemable}
                className="action-btn redeem-btn fill"
                onClick={redeem}>{t("NFTAirdop.Redeem.redeem")}</button>
            </>
          )}
        </div>
      </div>
    </fieldset>
  )
}
