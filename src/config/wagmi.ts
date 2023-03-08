import { configureChains, createClient } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { INFURA_API_KEY } from "settings";
import { ChainsConfig } from "./chains";

const { chains, provider } = configureChains(
  Object.values(ChainsConfig).map((chain) => chain.chain),
  [infuraProvider({ apiKey: INFURA_API_KEY })]
);

const walletConnectors = [
  // new InjectedConnector({
  //   chains,
  //   options: {
  //     name: (detectedName) => `Injected (${typeof detectedName === "string" ? detectedName : detectedName.join(", ")})`,
  //   },
  // }),
  new MetaMaskConnector({ chains }),
  new CoinbaseWalletConnector({ chains, options: { appName: "Hats.finance" } }),
  new WalletConnectConnector({ chains, options: { qrcode: true } }),
];

const wagmiClient = createClient({
  autoConnect: true,
  persister: null,
  provider,
  connectors: walletConnectors,
});

export { wagmiClient };
