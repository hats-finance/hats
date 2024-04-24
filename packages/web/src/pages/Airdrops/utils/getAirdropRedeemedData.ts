import { HATAirdrop_abi, HATToken_abi } from "@hats.finance/shared";
import { BigNumber, ethers } from "ethers";
import { getContract, getProvider } from "wagmi/actions";

export type AirdropRedeemData = {
  account: string;
  amount: BigNumber;
  token: `0x${string}`;
  tokenLock?: {
    address: `0x${string}`;
  };
  currentVotes?: BigNumber;
  delegator?: {
    delegatee: string;
    votes: BigNumber;
  };
};

type TokensRedeemedEventArgs = {
  _account: string;
  _amount: BigNumber;
  _tokenLock: `0x${string}`;
};

/**
 * Returns the airdrop redeemed data for the selected address. If the address has not redeemed any airdrop, it will return undefined.
 *
 * @param address: string - The address to check the airdrop redeemed data.
 * @param airdropData: {address: string, chainId: number} - The airdrop contract address and chain id.
 */
export const getAirdropRedeemedData = async (
  address: string,
  airdropData: { address: string; chainId: number }
): Promise<AirdropRedeemData | undefined> => {
  const airdropContractAddress = airdropData.address;
  const chainId = airdropData.chainId;

  const provider = getProvider({ chainId });
  if (!airdropContractAddress) {
    alert(`Airdrop contract not found on chain ${chainId}`);
    throw new Error("Airdrop contract not found");
  }

  const airdropContract = getContract({
    abi: HATAirdrop_abi,
    address: airdropContractAddress,
    signerOrProvider: provider,
  });

  const redeemedEvents = await airdropContract.queryFilter("TokensRedeemed", 0);
  const addressEvent = redeemedEvents.find((event) => event.args?._account.toLowerCase() === address.toLowerCase());
  const addressEventArgs = addressEvent?.args as TokensRedeemedEventArgs | undefined;

  // If the address has not redeemed the airdrop, return undefined.
  if (!addressEvent || !addressEventArgs) return undefined;

  // If the tokenLock is the zero address, it means that the user redeemed the airdrop without locking the tokens.
  const usingTokenLock = addressEventArgs._tokenLock !== ethers.constants.AddressZero;

  const tokenAddress = await airdropContract.token();
  const tokenContract = getContract({
    abi: HATToken_abi,
    address: tokenAddress,
    signerOrProvider: provider,
  });

  /* Get votes information */
  const votes = await tokenContract.getVotes(address as `0x${string}`);

  /* Get delegator information */
  const votesChangedEvents = await tokenContract.queryFilter("DelegateVotesChanged", 0);
  const delegatedEvents = (await tokenContract.queryFilter("DelegateChanged", 0)).reverse();
  let delegatedEvent: ethers.Event | undefined;

  if (usingTokenLock) {
    delegatedEvent = delegatedEvents.find(
      (event) => event.args?.delegator.toLowerCase() === addressEventArgs._tokenLock.toLowerCase()
    );
  } else {
    delegatedEvent = delegatedEvents.find(
      (event) =>
        event.args?.delegator === ethers.constants.AddressZero && event.args?.fromDelegate.toLowerCase() === address.toLowerCase()
    );
  }

  const delegatee = delegatedEvent?.args?.toDelegate;
  const delegateeVotes = votesChangedEvents.filter((e) => e.args?.delegate.toLowerCase() === delegatee?.toLowerCase()).pop()
    ?.args?.newBalance;

  return {
    account: addressEventArgs._account,
    amount: addressEventArgs._amount,
    token: tokenAddress,
    tokenLock: usingTokenLock ? { address: addressEventArgs._tokenLock } : undefined,
    currentVotes: votes,
    delegator: delegatee ? { delegatee, votes: delegateeVotes } : undefined,
  };
};
