# Hats.finance decentralized webapp
A User interface for the decentralized bug bounty protocol. You can learn more about the protocol by going to the [smart contract repository](https://github.com/hats-finance/hats-contracts).
# Features
- Viewing Vaults as a home page redirect or /vaults route and viewing their description 
- Deposit/Withdraw - Allows users to provide liquidity to vaults
- Submit Vurnability - allows user to fill in a form starting from choosing a project, supplying his details and creating an encrypted message using the projects public key(s) and then creating an on-chain transaction with a hash of the message.
- PGP Keys Vault - As part of set of tools to be used by committees utilizes local store and keyphrase encryption to generate/store/import pgp keys for committee members.
- Vault Editor - a tool used to define vaults description which includes its name and owners and covered contracts. This is an early version of the tool.
- Proof of Deposit - redeeming NFTs according to depositors part of the vaults
- NFT Airdrop redeeming
- Switching Network(chain) - the application will always reflect the connected wallet's network, if supported. a user can view data from the smart contract when he is not connected with a wallet using a default network which can be set in the environment variables
# Overview
Currently the data the app uses is mostly from decentralized sources. this includes:

- [subgraph](https://github.com/hats-finance/subgraph-v2) which aggregataes the data about the deployed contracts and its vaults
- [Hats Vaults Smart Contract(V1)](https://github.com/hats-finance/hats-contracts)
- [NFT Vault](https://github.com/hats-finance/vault_nft/tree/tree-updates) an ERC1155 smart contract which mints NFTs for depositors which as well includes a merkletree airdrop
- [Coingecko Api](https://www.coingecko.com/en/api/documentation) to get prices for tokens used for vaults

Some important dependencies include:

- [useDapp](https://github.dev/TrueFiEng/useDApp) for interacting with the web3 provider
- [web3modal](https://github.com/WalletConnect/web3modal) for handling wallet connection
- [Apollo Client](https://github.com/apollographql/apollo-client) to query the data from the subgraph and other graphql oracles.
- [openpgp](https://github.com/openpgpjs/openpgpjs)
- [react-i18next](https://github.com/i18next/react-i18next) for applying internationalization using a dict file
- [react-router-dom](https://reactrouter.com/) using v6 of react-router-dom for handing the route state
# Vaults
In order to obtain the list of vaults, the subgraph is queried for a list of vaults, as well as masters which means the contract they come from. while we support different chains, currently Mainnet, Rikneby(deprecated) and Goerli, the correct subgraph should be queried according to the selected network in the wallet, useDapp always reports the selected chainId and fires a re-render on network switching. a special [Apollo Link](src/config/apollo.ts) is used to choose the proper graph according to chain id and also directives can be defined to choose a different graph altogether as used for [UniswapV3](src/graphql/uniswap.ts) queries.

the VaultsContext is a singleton context used to fetch all the vaults data in a singleton manner. it also takes care of fetching additional oracle data(currently coin prices to show TVL). it may be easily used using the [useVaults()](src/hooks/useVaults.tsx) hook, as well all its functionality is defined there.

After the vaults are received from the graph its description is loaded from ipfs according to its descriptionHash(cid), its additional vaults are aggregated on the parent one(additinal vaults allow the use of multiple assets on a single parent vault), and prices are fetched both from coingecko and some contracts.

# Vulnerability Submission
A Vulnerability sumission requires the white-hat hacker to create an on-chain proof for his submission. each vault's description contains one or more pgp public keys that will be used to encrypt the description of the vulnerability filled by the hacker so that only the committee can review it. an ipfs-hash is created from the content and a transaction is being written on-chain, after that, a call to a bot-service is done to immediately notify the committee of the new submission.
# PGP Keys Vault
A tool to store pgp keys in an encrypted manner on in the browser's local storage has been added to the dapp, to simplify encryption for users. The tool is used when creating a new vault using the [Vault Editor](src/components/VaultEditor/VaultEditor.tsx). The data is stored in the local storage encrypted using a password created by the user. the locked/unlocked state are all handled in the confusingly-named [VaultContext](src/components/CommitteeTools/store.tsx).
# Web3 - useDapp
useDapp is used for read and write calls on the blockchain.  when useCall is used, the hook will listen to block updates and refetch data as blocks are mined, this means that additional reads are taking place, but does not present any problem when using our alchemy key and provides a good user experience. For write functions useCallFunction is used. In order to wait for a transaction to complete an await should be used on the send function. another technique used to detect a transaction is taking place or completed is reading the transactions fromt the global state using useTransactions().

Web3Modal is used for implementing WalletConnect selection.
# Getting Started
To get started, clone this repository and run:

```
yarn
yarn start
```
