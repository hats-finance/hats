import { Colors } from "constants/constants";
import { StyledWhereverWidget } from "./styles";
import {
  NotificationFeed,
  NotificationFeedProvider,
  NotificationBell
} from "@wherever/react-notification-feed";
import { useEthers } from "@usedapp/core";

// Partner key and env should be included in the env config file
const PARTNER_KEY = "6bfd58ee-8fc8-4b5d-96f4-9562c7095e06";
const ENV = "development";

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
        env={ENV}
        partnerKey={PARTNER_KEY}
      >
        <NotificationFeed>
          <NotificationBell containerHeight={"100%"} containerWidth={"100%"} />
        </NotificationFeed>
      </NotificationFeedProvider>
    </StyledWhereverWidget>
  );
};

export { WhereverWidget };
