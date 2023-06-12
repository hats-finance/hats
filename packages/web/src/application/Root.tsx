import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import { useTranslation } from "react-i18next";
import HttpsRedirect from "react-https-redirect";
import { ChainsConfig } from "@hats-finance/shared";
import { stagingServiceUrl, prodServiceUrl } from "../constants/constants";
import { Helmet } from 'react-helmet';
import { HashRouter } from "react-router-dom";
import { WagmiConfig } from "wagmi";
import { queryClient } from "config/reactQuery";
import { wagmiClient } from "config/wagmi";
import { theme } from "config/theme";
import { VaultsProvider } from "hooks/vaults/useVaults";
import { ConfirmDialogProvider } from "hooks/useConfirm";
import { SiweAuthProvider } from "hooks/siwe/useSiweAuth";
import { GlobalStyle } from "styles";
import { KeystoreProvider } from "components/Keystore";
import { NotificationProvider } from "components/Notifications/NotificationProvider";
import App from "./App";
import store from "../store";
import "i18n.ts";

function Root() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const language = window.localStorage.getItem("i18nextLng");
    if (language && language !== i18n.language) i18n.changeLanguage(language);
  }, [i18n]);
  // Define your allowed endpoints
  const allowedEndpoints = [
    "'self'",
    "https://*.hats.finance",
    "https://*.infura.io",
    "https://api.coingecko.com/",
    "https://cloudflare-eth.com/",
    stagingServiceUrl,
    prodServiceUrl,
    ...Object.values(ChainsConfig).map((chain) => chain.subgraph),
    ...Object.values(ChainsConfig).map((chain) => chain.uniswapSubgraph),
  ];
  const allowedImageSources = [
    "'self'",
    "data:",
    "https://*.hats.finance",
    "https://ipfs.io",
    "https://cloudflare-ipfs.com",
    "https://*.mypinata.cloud/",
    "https://raw.githubusercontent.com",
    "https://svgshare.com",
    "https://avatars.githubusercontent.com",
    "https://ipfs.kleros.io",
  ];

  // Join the endpoints into a string
  const connectSrc = allowedEndpoints.join(' ');
  const connectImgSrc = allowedImageSources.join(' ');
  return (
    <>
      <Helmet>
        <meta 
          http-equiv="Content-Security-Policy" 
          content={`default-src 'self'; connect-src ${connectSrc}; style-src 'self' 'unsafe-inline'; img-src ${connectImgSrc};`}
        />
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={wagmiClient}>
          <Provider store={store}>
            <VaultsProvider>
              <HttpsRedirect>
                <HashRouter>
                  <GlobalStyle />
                  <ThemeProvider theme={theme}>
                    <NotificationProvider>
                      <ConfirmDialogProvider>
                        <KeystoreProvider>
                          <SiweAuthProvider>
                            <App />
                          </SiweAuthProvider>
                        </KeystoreProvider>
                      </ConfirmDialogProvider>
                    </NotificationProvider>
                  </ThemeProvider>
                </HashRouter>
              </HttpsRedirect>
            </VaultsProvider>
          </Provider>
        </WagmiConfig>
      </QueryClientProvider>
    </>
  );
}

export default Root;
