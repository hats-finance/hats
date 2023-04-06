import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import { useTranslation } from "react-i18next";
import HttpsRedirect from "react-https-redirect";
import { BrowserRouter } from "react-router-dom";
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

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <Provider store={store}>
          <VaultsProvider>
            <HttpsRedirect>
              <BrowserRouter>
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
              </BrowserRouter>
            </HttpsRedirect>
          </VaultsProvider>
        </Provider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default Root;
