import { NotificationBell, NotificationFeed, NotificationFeedProvider } from "@wherever/react-notification-feed";
import { useKeyWhereverWidget } from "config/wherever";
import { Colors } from "constants/constants";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpened] = useState<true | undefined>(undefined);

  useEffect(() => {
    const shouldW2WBeOpened = searchParams.get("w2w") && searchParams.get("w2w") === "open";
    if (shouldW2WBeOpened) {
      setTimeout(() => setIsOpened(true), 1000);
      setTimeout(() => setIsOpened(undefined), 1500);
    }
  }, [searchParams]);

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
          fontFamily: '"IBM Plex Sans", sans-serif',
        }}
        partnerKey={whereverKey}
        isOpen={isOpen}
      >
        <NotificationFeed gapFromBell={20}>
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
