import { Colors } from "constants/constants";
import { StyledWhereverWidget, StyledWhereverWidgetContainer } from "./styles";
import {
  NotificationFeed,
  NotificationFeedProvider,
  NotificationBell
} from "@wherever/react-notification-feed";
import { useEthers } from "@usedapp/core";
import { WHEREVER_KEY } from "settings";

const WhereverWidget = () => {
  const { account, library } = useEthers();

  if (!account) {
    return null;
  }

  return (
    <StyledWhereverWidgetContainer>
      <NotificationFeedProvider
        provider={library!}
        theme={{
          bellColor: Colors.turquoise,
          backgroundColor: Colors.fieldBlue,
          primaryColor: Colors.turquoise,
          fontFamily: '"RobotoMono", sans-serif'
        }}
        partnerKey={WHEREVER_KEY}
      >
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
