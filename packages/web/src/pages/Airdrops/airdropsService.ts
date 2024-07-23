import { AirdropFactoryConfig, HATAirdropFactory_abi, HATToken_abi } from "@hats.finance/shared";
import { Amount } from "utils/amounts.utils";
import { getContract, getProvider, readContract } from "wagmi/actions";
import { DropData } from "./types";
import { getGeneralAirdropData } from "./utils/getGeneralAirdropData";

export type IDelegateeInfo = {
  icon?: string;
  address: string;
  name?: string;
  twitterProfile?: string;
  hatsProfile?: string;
  description?: string;
  votes?: number;
};

/**
 * Gets the delegatees
 */
export async function getDelegatees(token: string | undefined, chainId: number | undefined): Promise<IDelegateeInfo[]> {
  try {
    const delegatees = [
      {
        address: "0x0a5b058560e2Db597f57FedB910f3C2F50F4438C",
        name: "mahdiRostami",
        twitterProfile: "0xmahdirostami",
        hatsProfile: "mahdirostami",
        description: `
        <ul>
          <li>Holds a Master's in Computer Science.</li>
          <li>Experienced in auditing dApp codebases.</li>
          <li>Leads the Hats Finance all-time leaderboard.</li>
        </ul>
        `,
      },
      {
        address: "0x83C85B50110062c7821AF2AC245DcCFB68F6dEB7",
        name: "0xfuje",
        twitterProfile: "0xfuje",
        hatsProfile: "0xfuje",
        description: `
          <ul>
            <li>Smart contract security researcher & bounty hunter.</li>
            <li>Active competitor on Hats, top 10 on leaderboard.</li>
            <li>Frog working in crypto since 2022</li>
            <p class="mt-1">Focus as a delegate:</p>
            <ul>
              <li>Improving judging standards & user experience as a competitor</li>
              <li>find ways to attract more projects to host competitions with us</li>
            </ul>
          </ul>
        `,
      },
      {
        address: "0x6386B0A730C4Be11575B51A7DB93134a3D4d2ddF",
        name: "Atharv181",
        twitterProfile: "atharv_181",
        icon: "https://pbs.twimg.com/profile_images/1781747145868967936/gQsUoEJQ_400x400.jpg",
        description: `
          <ul>
          <li>Developed key infrastructure for blockchain platforms including Frontier Wallet and Manta Network.</li>
          <li>Engaged in Ethereum ecosystem projects and blockchain education since college.</li>
          <li>Recent focus on smart contract security, auditing diverse DeFi and infrastructure projects.</li>
          </ul>
          `,
      },
      {
        address: "0x52661dc90C2D192c07CDc93e232b03d54b5d47D1",
        name: "Rodion Trubnikov",
        twitterProfile: "atharv_181",
        hatsProfile: "ABAIKUNANBAEV",
        description: `
          <ul>
            <li>Experienced auditor in Solidity, Rust, and Golang with 1.5 years of auditing experience.</li>
            <li>Portfolio showcases a diverse range of audits: GitHub Audits.</li>
            <li>Ranked top #12 all-time on Hats Finance and top #200 on C4 in 2024.</li>
          </ul>
        `,
      },
      {
        address: "0xABCDE0360aBCbA45098125E55437B005aE5DF46F",
        name: "Nue",
        twitterProfile: "chainNue",
        hatsProfile: "chainNue",
        description: `
        <ul>
          <li>Guardian of Decentralized Trust.</li>
        </ul>
        `,
      },
      {
        address: "0x36A391B00c70e11F88Fd2F20dC5701Dd54B837e6",
        name: "0xWeb3boy",
        hatsProfile: "0xWeb3boy",
        description: `
        <ul>
          <li>Passionate about blockchain and security as a whole.</li>
          <li>Have been Auditing for over an year now.</li>
          <li>I worked with renowned organization like ISRO, Income tax department, Ministry of defence.</li>
          <li>Transitioning my career in web3 security and looking forward to growing with big names like Hats.</li>
        </ul>
        `,
      },
      {
        address: "0xc9221e9ffed5277b7e0a62f5275fcf13c6b89b92",
        name: "kn0t",
        twitterProfile: "0xknot",
        hatsProfile: "kn0t",
        description: `
          <ul>
            <li>Master's in Comp Eng, 17 yrs full-stack dev, 2 yrs blockchain sec.</li>
            <li>Developed IDE for audit & defense; created Tera analyzer.</li>
            <li>Won 1st in CodeQuest, 3rd in RuntimeVerification workshop.</li>
          </ul>
        `,
      },
      {
        address: "0x6940324206962242b15c2277Fb3E90B31f843C91",
        name: "0xShax2nk_in",
        twitterProfile: "0xShashanks_07",
        hatsProfile: "0xShax2nk_in",
        description: `
        <ul>
          <li>Security Researcher!</li>
        </ul>
        `,
      },
      {
        address: "0x1D8a08c8C3Ce0A852Cb4Da902754991759F7F625",
        name: "Rex Hygate",
        twitterProfile: "rhygate",
        icon: "https://pbs.twimg.com/profile_images/838595417545695232/gGEHwpB-_400x400.jpg",
        description: `
        <ul>
          <li>Started DeFiSafety in March 2020, looking at DeFi security from a process/OpSec perspective.</li>
          <li>Helping DeFi users get impartial quality data of DeFi protocols and chains.</li>
          <li>New focus is security consulting on good OpSec specifically mitigating lost keys and insider threats.</li>
          <li>Through DeFiSafety reviews, we have read hundreds of audit reports and are very familiar with quality content within audits.</li>
        </ul>
        `,
      },
      {
        address: "0xb7806Bb862A37317949D2009ABA80CD19d680B45",
        name: "alp1n3.eth",
        twitterProfile: "alp1n3_eth",
        hatsProfile: "alp1n3.eth",
        description: `
          <ul>
            <li>Current malware analyst for Army Cyber Command.</li>
            <li>Previous web application security consultant (pentesting). Transitioning back into this role at the moment.</li>
            <li>Certified bug bounty hunter from HackTheBox.</li>
            <li>MS in Cyber Defense, BS in Cyber Ops from a DoD/NSA certified university.</li>
          </ul>
        `,
      },
    ];

    if (!token || !chainId) return delegatees;

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

export async function getAirdropsDataByFactory(factory: AirdropFactoryConfig): Promise<DropData[]> {
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
    ).filter((data) => data !== undefined) as DropData[];

    return airdropsData;
  } catch (error) {
    console.log(error);
    return [];
  }
}
