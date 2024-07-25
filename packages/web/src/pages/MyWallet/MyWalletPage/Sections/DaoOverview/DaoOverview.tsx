import { DelegateManager } from "./components/DelegateManager/DelegateManager";
import { HATHoldingsCard } from "./components/HATHoldingsCard/HATHoldingsCard";

export const DaoOverview = () => {
  return (
    <div>
      <HATHoldingsCard />
      <DelegateManager />
    </div>
  );
};
