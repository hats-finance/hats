import { Colors, WhereverPartnerKeys } from "constants/constants";
import { StyledWhereverWidget, StyledWhereverWidgetContainer } from "./styles";
import { NotificationFeed, NotificationFeedProvider, NotificationBell } from "@wherever/react-notification-feed";
import { useAccount, useNetwork, useProvider } from "wagmi";
import { useSupportedNetwork } from "hooks/wagmi";

const WhereverWidget = () => {
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
          <StyledWhereverWidget>
            <NotificationBell />
          </StyledWhereverWidget>
        </NotificationFeed>
      </NotificationFeedProvider>
    </StyledWhereverWidgetContainer>
  );
};

export { WhereverWidget };
