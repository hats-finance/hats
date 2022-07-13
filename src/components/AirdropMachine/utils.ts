import { useEthers } from "@usedapp/core";
import { useCallback, useEffect } from "react";
import { TEMP_WALLETS } from "./data";

export const checkEligibility = async (address: string) => (
  TEMP_WALLETS.wallets.find(wallet => wallet.id === address)
)

export const useFetchAirdropData = async (toggleAirdropPrompt: () => void) => {
  const { account } = useEthers();

  const getAirdropData = useCallback(async () => {
    if (account) {
      const eligibaleData = await checkEligibility(account);
      /** TODO: show only when:
       * 1. not redeemed - need to check
       * 2. not appears in the local storage
       */
      if (eligibaleData) {
        toggleAirdropPrompt();
      }
    }
  }, [account, toggleAirdropPrompt])

  useEffect(() => {
    getAirdropData();
  }, [account]);
}
