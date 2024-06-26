import { AirdropFactoryConfig, HATAirdropFactory_abi, HATToken_abi } from "@hats.finance/shared";
import { Amount } from "utils/amounts.utils";
import { getContract, getProvider, readContract } from "wagmi/actions";
import { AirdropData } from "./types";
import { getGeneralAirdropData } from "./utils/getGeneralAirdropData";

export type IDelegateeInfo = {
  icon?: string;
  address: string;
  name: string;
  twitterProfile: string;
  description: string;
  votes?: number;
};

/**
 * Gets the delegatees
 */
export async function getDelegatees(token: string, chainId: number): Promise<IDelegateeInfo[]> {
  try {
    const delegatees = [
      {
        address: "0xCC5BD779A1EACeEFA704315A1F504446B6D25a1F",
        name: "Chapeu #1",
        twitterProfile: "hatsfinance",
        description: `
          <ul>
            <li>Hats' lead developer</li>
            <li>Ex-Prysmatic Labs</li>
            <li>Web3 Dev since 2014</li>
            <li>2nd Web3 Start-up</li>
          </ul>
        `,
      },
      {
        address: "0xaFd8C4f6f5f0d64f0e8bcE4C22DAa7b575506400",
        name: "Chapeu #2",
        twitterProfile: "hatsfinance",
        description: `
          <ul>
            <li>Hats' lead developer</li>
            <li>Ex-Prysmatic Labs</li>
          </ul>
        `,
      },
      {
        address: "0x56E889664F5961452E5f4183AA13AF568198eaD2",
        name: "Chapeu #3",
        twitterProfile: "hatsfinance",
        description: `
          <ul>
            <li>Hats' lead developer</li>
            <li>Ex-Prysmatic Labs</li>
            <li>Web3 Dev since 2014</li>
            <li>2nd Web3 Start-up</li>
          </ul>
        `,
      },
      {
        address: "0x0000000000000000000000000000000000000000",
        name: "Zero #1",
        twitterProfile: "hatsfinance",
        description: `
          <ul>
            <li>Hats' lead developer</li>
            <li>Ex-Prysmatic Labs</li>
          </ul>
        `,
      },
      {
        address: "0x0000000000000000000000000000000000000001",
        name: "Zero #2",
        twitterProfile: "hatsfinance",
        description: `
          <ul>
            <li>Web3 Dev since 2014</li>
            <li>2nd Web3 Start-up</li>
          </ul>
        `,
      },
      {
        address: "0x0000000000000000000000000000000000000002",
        name: "Zero #3",
        twitterProfile: "hatsfinance",
        description: `
          <ul>
            <li>Web3 Dev since 2014</li>
            <li>2nd Web3 Start-up</li>
          </ul>
        `,
      },
    ];

    const withVotingPower = await Promise.all(
      delegatees.map(async (delegatee) => {
        try {
          const votes = await readContract({
            address: token as `0x${string}`,
            abi: HATToken_abi,
            functionName: "getVotes",
            args: [delegatee.address as `0x${string}`],
            chainId,
          });
          return { ...delegatee, votes: +new Amount(votes, 18).number.toFixed(2) };
        } catch (error) {
          return { ...delegatee, votes: 0 };
        }
      })
    );

    withVotingPower.sort((a, b) => b.votes - a.votes);
    return withVotingPower;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAirdropsDataByFactory(factory: AirdropFactoryConfig): Promise<AirdropData[]> {
  try {
    type AirdropCreatedEventArgs = {
      _hatAirdrop: string;
    };

    const provider = getProvider({ chainId: factory.chain.id });
    const airdropFactoryContract = getContract({
      abi: HATAirdropFactory_abi,
      address: factory.address,
      signerOrProvider: provider,
    });

    const airdropCreatedEvents = await airdropFactoryContract.queryFilter("HATAirdropCreated", 0);
    const airdropsAddresses = airdropCreatedEvents
      .map((event) => (event?.args as AirdropCreatedEventArgs | undefined)?._hatAirdrop)
      .filter((address) => address !== undefined)
      .map((address) => (address as string).toLowerCase());

    const airdropsData = (
      await Promise.all(
        airdropsAddresses.map(async (address) => {
          const airdropData = await getGeneralAirdropData(address, factory.chain.id, factory.address);
          return airdropData;
        })
      )
    ).filter((data) => data !== undefined) as AirdropData[];

    return airdropsData;
  } catch (error) {
    console.log(error);
    return [];
  }
}
