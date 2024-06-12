import { HackerStreak } from "components";
import { useProfileByAddress } from "pages/HackerProfile/hooks";
import { useAddressesStreak } from "pages/HackerProfile/useAddressesStreak";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";

const STREAK_MULTIPLIER_FACTOR = 0.3;

export const StreakMultiplierCard = () => {
  const { t } = useTranslation();

  const { address: account } = useAccount();
  const { data: createdProfile } = useProfileByAddress(account);
  const streakStats = useAddressesStreak(createdProfile?.addresses ?? []);

  const streakCount = streakStats.streakCount ?? 0;
  const streakMultiplier = streakCount * STREAK_MULTIPLIER_FACTOR;

  return (
    <div className="multiplier">
      <p className="value">x{streakMultiplier}</p>
      <div className="info">
        <p className="name">{t("MyWallet.streak")}</p>
        <div>
          <p className="mb-2">{t("MyWallet.streakMultiplierCalculation")}</p>
          <strong>
            <i>{t("MyWallet.yourStreak")}</i> x {STREAK_MULTIPLIER_FACTOR} = <strong>{streakMultiplier}</strong>
          </strong>
        </div>
        <div>
          <p className="mb-3">{t("MyWallet.yourStreak")}</p>
          <HackerStreak streak={streakCount} maxStreak={streakCount} />
        </div>
      </div>
    </div>
  );
};
