import { ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { Seo } from "components";
import { KeystoreProvider } from "components/Keystore";
import { NotificationProvider } from "components/Notifications/NotificationProvider";
import { queryClient } from "config/reactQuery";
import { theme } from "config/theme";
import { wagmiClient } from "config/wagmi";
import { SiweAuthProvider } from "hooks/siwe/useSiweAuth";
import { ConfirmDialogProvider } from "hooks/useConfirm";
import { VaultsProvider } from "hooks/vaults/useVaults";
import "i18n.ts";
import { useEffect } from "react";
import HttpsRedirect from "react-https-redirect";
import { useTranslation } from "react-i18next";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { GlobalStyle } from "styles";
import { WagmiConfig } from "wagmi";
import store from "../store";
import App from "./App";

function Root() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const language = window.localStorage.getItem("i18nextLng");
    if (language && language !== i18n.language) i18n.changeLanguage(language);
  }, [i18n]);

  return (
    <>
      <Seo isMainPage />
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
