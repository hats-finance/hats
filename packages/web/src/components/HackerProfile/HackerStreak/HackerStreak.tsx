import { Button, Modal } from "components";
import { LocalStorage } from "constants/constants";
import useModal from "hooks/useModal";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyledExplanationModal, StyledHackerStreak } from "./styles";

export type IHackerStreakProps = {
  maxStreak: number;
  streak: number;
};

export const HackerStreak = ({ streak, maxStreak }: IHackerStreakProps) => {
  const { t } = useTranslation();
  const { isShowing: isShowingExplanationModal, show: showExplanationModal, hide: hideExplanationModal } = useModal();

  useEffect(() => {
    const hasSeenExplanation = localStorage.getItem(LocalStorage.CompetitionStreak);
    if (!hasSeenExplanation) {
      showExplanationModal();
      localStorage.setItem(LocalStorage.CompetitionStreak, "true");
    }
  }, [showExplanationModal]);

  return (
    <>
      <StyledHackerStreak streak={streak} maxStreak={maxStreak} onClick={showExplanationModal}>
        <div className="track" />
        <div className="streak-track">
          <p>{t("streak")}</p>
          <div className="streak-value">{streak}</div>
        </div>
      </StyledHackerStreak>
      <Modal isShowing={isShowingExplanationModal} onHide={hideExplanationModal}>
        <StyledExplanationModal>
          <div className="title" dangerouslySetInnerHTML={{ __html: t("HackerProfile.streakExplanationTitle") }} />
          <div className="streak-example">
            <StyledHackerStreak streak={5} maxStreak={5}>
              <div className="track" />
              <div className="streak-track">
                <p>{t("streak")}</p>
                <div className="streak-value">{streak}</div>
              </div>
            </StyledHackerStreak>
          </div>
          <div className="description" dangerouslySetInnerHTML={{ __html: t("HackerProfile.streakExplanationDescription") }} />
          <div className="buttons">
            <Button bigHorizontalPadding onClick={hideExplanationModal}>
              {t("gotIt")}
            </Button>
          </div>
        </StyledExplanationModal>
      </Modal>
    </>
  );
};
