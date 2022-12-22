import { Colors } from "constants/constants";
import { StyledWhereverWidget, StyledWhereverWidgetContainer } from "./styles";
import { NotificationFeed, NotificationFeedProvider, NotificationBell } from "@wherever/react-notification-feed";
import { useAccount, useNetwork, useProvider } from "wagmi";
import { useSupportedNetwork } from "hooks/wagmi";
import { Button } from "../Button/Button";
import { useTranslation } from "react-i18next";
import { WhereverPartnerKeys } from "config/wherever";

type WhereverWidgetProps = {
  type?: "bell" | "subscribe";
};

const WhereverWidget = ({ type = "bell" }: WhereverWidgetProps) => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const isSupportedChain = useSupportedNetwork();

  if (!account || !chain || !isSupportedChain) return null;

  const whereverKey = WhereverPartnerKeys[chain.id];
  if (!whereverKey) return null;

  return (
    <StyledWhereverWidgetContainer>
      <NotificationFeedProvider
        provider={provider}
        theme={{
          buttonTextColor: Colors.black,
          bellColor: Colors.turquoise,
          backgroundColor: Colors.fieldBlue,
          primaryColor: Colors.turquoise,
          borderRadius: "none",
          uppercasePageTitles: true,
          fontFamily: '"RobotoMono", sans-serif',
        }}
        partnerKey={whereverKey}>
        <NotificationFeed>
          {type === "bell" ? (
            <StyledWhereverWidget>
              <NotificationBell />
            </StyledWhereverWidget>
          ) : (
            <Button onClick={() => console.log("adasdasdasdasd")} styleType="filled">
              {t("subscribe")}
            </Button>
          )}
        </NotificationFeed>
      </NotificationFeedProvider>
    </StyledWhereverWidgetContainer>
  );
};

export { WhereverWidget };
