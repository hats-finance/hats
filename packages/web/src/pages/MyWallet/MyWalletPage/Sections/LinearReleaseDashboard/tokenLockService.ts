import { HATTokenLockFactory_abi } from "@hats.finance/shared";
import { getContract, getProvider } from "wagmi/actions";

export async function getTokenLocksByFactory(
  tokenLockFactory: {
    chainId: number;
    address: string;
  },
  account: string | undefined
): Promise<{ chainId: number; address: string }[]> {
  try {
    if (!account) return [];

    type TokenLockCreatedEventArgs = {
      contractAddress: string;
      beneficiary: string;
    };

    const provider = getProvider({ chainId: tokenLockFactory.chainId });
    const tokenLockFactoryContract = getContract({
      abi: HATTokenLockFactory_abi,
      address: tokenLockFactory.address,
      signerOrProvider: provider,
    });

    const tokenLockCreatedEvents = await tokenLockFactoryContract.queryFilter("TokenLockCreated", 0);
    const accountTokenLocksEvents = tokenLockCreatedEvents.filter(
      (event) => (event?.args as TokenLockCreatedEventArgs | undefined)?.beneficiary.toLowerCase() === account.toLowerCase()
    );
    const tokenLocksAddresses = accountTokenLocksEvents
      .map((event) => (event?.args as TokenLockCreatedEventArgs | undefined)?.contractAddress)
      .filter((address) => address !== undefined)
      .map((address) => (address as string).toLowerCase());

    return tokenLocksAddresses.map((address) => ({ chainId: tokenLockFactory.chainId, address }));
  } catch (error) {
    console.log(error);
    return [];
  }
}
