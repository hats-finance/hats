import { useAuditCompetitionsVaults } from "./hooks";

export const AuditVaultsPage = () => {
  const a = useAuditCompetitionsVaults();
  console.log(a);

  return <div>AuditVaultsPage</div>;
};
