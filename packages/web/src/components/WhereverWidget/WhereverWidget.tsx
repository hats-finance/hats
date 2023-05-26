import { NotificationBell, NotificationFeed, NotificationFeedProvider } from "@wherever/react-notification-feed";
import { useKeyWhereverWidget } from "config/wherever";
import { Colors } from "constants/constants";
import { useTranslation } from "react-i18next";
import { useProvider } from "wagmi";
import { Button } from "../Button/Button";
import { StyledWhereverWidget, StyledWhereverWidgetContainer } from "./styles";

type WhereverWidgetProps = {
  type?: "bell" | "subscribe";
};

const WhereverWidget = ({ type = "bell" }: WhereverWidgetProps) => {
  const { t } = useTranslation();
  const provider = useProvider();
  const whereverKey = useKeyWhereverWidget();

  if (!whereverKey) return null;

  return (
    <StyledWhereverWidgetContainer>
      <NotificationFeedProvider
        provider={provider}
        theme={{
          primaryColor: Colors.secondaryLight,
          bellColor: Colors.white,
          backgroundColor: Colors.background2,
          buttonTextColor: Colors.black,
          borderRadius: "none",
          uppercasePageTitles: true,
          fontFamily: '"RobotoMono", sans-serif',
        }}
        partnerKey={whereverKey}
      >
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
