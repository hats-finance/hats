import { Colors, WhereverPartnerKeys } from "constants/constants";
import { StyledWhereverWidget, StyledWhereverWidgetContainer } from "./styles";
import { NotificationFeed, NotificationFeedProvider, NotificationBell } from "@wherever/react-notification-feed";
import { useAccount, useNetwork } from "wagmi";
import { useSupportedNetwork } from "hooks/wagmi";

const WhereverWidget = () => {
  // const { library } = useEthers();
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const isSupportedChain = useSupportedNetwork();

  if (!account || !chain || !isSupportedChain) return null;

  return (
    <StyledWhereverWidgetContainer>
      <NotificationFeedProvider
        // provider={library!}
        theme={{
          buttonTextColor: Colors.black,
          bellColor: Colors.turquoise,
          backgroundColor: Colors.fieldBlue,
          primaryColor: Colors.turquoise,
          borderRadius: "none",
          uppercasePageTitles: true,
          fontFamily: '"RobotoMono", sans-serif',
        }}
        partnerKey={WhereverPartnerKeys[chain.id]}>
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
