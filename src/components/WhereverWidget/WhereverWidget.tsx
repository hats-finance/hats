import { Colors } from "constants/constants";
import { StyledWhereverWidget } from "./styles";
import {
  NotificationFeed,
  NotificationFeedProvider,
  NotificationBell
} from "@wherever/react-notification-feed";
import { useEthers } from "@usedapp/core";
import { WHEREVER_SETTINGS } from "settings";

const WhereverWidget = () => {
  const { account } = useEthers();

  if (!account) {
    return null;
  }

  return (
    <StyledWhereverWidget>
      <NotificationFeedProvider
        theme={{
          bellColor: Colors.turquoise,
          backgroundColor: Colors.fieldBlue,
          primaryColor: Colors.strongRed,
          fontFamily: '"RobotoMono", sans-serif'
        }}
        env={WHEREVER_SETTINGS.env}
        partnerKey={WHEREVER_SETTINGS.partnerKey}
      >
        <NotificationFeed>
          <NotificationBell containerHeight={"100%"} containerWidth={"100%"} />
        </NotificationFeed>
      </NotificationFeedProvider>
    </StyledWhereverWidget>
  );
};

export { WhereverWidget };
