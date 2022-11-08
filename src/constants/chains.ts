import { Chain, ChainId, Goerli, /*Hardhat, */ Mainnet } from "@usedapp/core";

interface IChainConfiguration {
    vaultsNFTContract: string;
    chain: Chain;
    endpoint: string;
    subgraph: string;
}

export const Chains: { [index: number]: IChainConfiguration } = {
    [ChainId.Mainnet]: {
        vaultsNFTContract: "0x1569Fd54478B25E3AcCf3baC3f231108D95F50C4",
        chain: Mainnet,
        endpoint: "https://eth-mainnet.alchemyapi.io/v2/c4ovmC7YsQq1qM0lp6h7Ao9bGX_v4JG-",
        subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/hatsmainnetv6",
    },
    [ChainId.Goerli]: {
        vaultsNFTContract: "0x4bdDe617aB54C6E45b4Bf08963F008dFC5da92aD",
        chain: Goerli,
        endpoint: "https://eth-goerli.g.alchemy.com/v2/HMtXCk0FyIfbiNAVm4Xcgr8Eqlc5_DKd",
        subgraph: "https://api.thegraph.com/subgraphs/name/hats-finance/goerli_v2_1"
    },
    // [ChainId.Hardhat]: {
    //     vaultsNFTContract: "",
    //     chain: Hardhat,
    //     endpoint: "http://localhost:8545",
    //     subgraph: "http://localhost:8000/subgraphs/name/hats-nft"
    // }
}
