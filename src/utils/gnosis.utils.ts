import { Chain } from "@wagmi/core";
import axios from "axios";

const getGnosisApiEndpoint = (txHash: string, chain: Chain | undefined): string => {
  if (!chain) return "";
  return `https://safe-transaction-${chain.network}.safe.global/api/v1/multisig-transactions/${txHash}`;
};

export const isAGnosisSafeTx = async (tx: string, chain: Chain | undefined): Promise<boolean> => {
  try {
    const res = await axios.get(getGnosisApiEndpoint(tx, chain));

    return !!res.data?.safeTxHash;
  } catch (error) {
    return false;
  }
};
