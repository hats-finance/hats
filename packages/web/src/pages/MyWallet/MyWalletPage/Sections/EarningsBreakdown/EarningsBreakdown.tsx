import { useProfileByAddress } from "pages/HackerProfile/hooks";
import { useAddressesStreak } from "pages/HackerProfile/useAddressesStreak";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { StyledEarningsBreakdown } from "./styles";

export const EarningsBreakdown = () => {
  const { t } = useTranslation();

  const { address: account } = useAccount();
  const { data: createdProfile } = useProfileByAddress(account);
  const streakStats = useAddressesStreak(createdProfile?.addresses ?? []);

  return (
    <StyledEarningsBreakdown>
      <h3>{t("MyWallet.earningsBreakdown")}</h3>
    </StyledEarningsBreakdown>
  );
};
