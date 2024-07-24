import { useTranslation } from "react-i18next";
import { DelegateManager } from "./components/DelegateManager/DelegateManager";
import { HATHoldingsCard } from "./components/HATHoldingsCard/HATHoldingsCard";

export const DaoOverview = () => {
  const { t } = useTranslation();

  return (
    <div>
      <p className="mt-5">{t("MyWallet.myWalletDAOExplanation")}</p>
      <HATHoldingsCard />
      <DelegateManager />
    </div>
  );
};
