import { useTranslation } from "react-i18next";
import { StyledHackerStreak } from "./styles";

export type IHackerStreakProps = {
  maxStreak: number;
  streak: number;
};

export const HackerStreak = ({ streak, maxStreak }: IHackerStreakProps) => {
  const { t } = useTranslation();

  return (
    <StyledHackerStreak streak={streak} maxStreak={maxStreak}>
      <div className="track" />
      <div className="streak-track">
        <p>{t("streak")}</p>
        <div className="streak-value">{streak}</div>
      </div>
    </StyledHackerStreak>
  );
};
