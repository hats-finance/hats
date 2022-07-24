import { useEthers } from "@usedapp/core";
import { useCallback, useEffect } from "react";
import { TEMP_WALLETS } from "./data";
import { solidityKeccak256 } from "ethers/lib/utils";
import { AirdropMachineWallet } from "types/types";
import { useTokenActions } from "hooks/tokenContractHooks";
import { ipfsTransformUri } from "utils";

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

export const useFetchAirdropData = async (toggleAirdropPrompt: () => void) => {
  const { isBeforeDeadline, extendedEligibility } = useTokenActions();
  const somethingToRedeem = extendedEligibility?.some(nft => !nft.isRedeemed);

  useEffect(() => {
    if (isBeforeDeadline && somethingToRedeem) {
      toggleAirdropPrompt();
    }
  }, [isBeforeDeadline, somethingToRedeem])
}
