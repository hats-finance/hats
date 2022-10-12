import { Colors } from "constants/constants";
import { StyledWhereverWidget } from "./styles";
import {
  NotificationFeed,
  NotificationFeedProvider,
  NotificationBell
} from "@wherever/react-notification-feed";

const PARTNER_KEY = "6bfd58ee-8fc8-4b5d-96f4-9562c7095e06";

const WhereverWidget = () => {
  console.log(process.env.NODE_ENV);

  return (
    <StyledWhereverWidget>
      <NotificationFeedProvider
        theme={{
          bellColor: Colors.turquoise,
          backgroundColor: Colors.fieldBlue,
          primaryColor: Colors.strongRed,
          fontFamily: '"RobotoMono", sans-serif'
        }}
        env={"development"}
        partnerKey={PARTNER_KEY}
      >
        <NotificationFeed>
          <NotificationBell />
        </NotificationFeed>
      </NotificationFeedProvider>
    </StyledWhereverWidget>
  );
};

export { WhereverWidget };
