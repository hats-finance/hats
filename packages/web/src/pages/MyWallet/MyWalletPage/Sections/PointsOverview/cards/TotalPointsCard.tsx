import { useProfileByAddress } from "pages/HackerProfile/hooks";
import { useAccount } from "wagmi";
import { usePointsDataByUser } from "../../../../hooks";

export const TotalPointsCard = () => {
  const { address: account } = useAccount();
  const { data: profile } = useProfileByAddress(account);

  const { data: pointsData } = usePointsDataByUser(profile?.username);
  console.log(pointsData);

  return (
    <div className="overview-card">
      <p>{pointsData?.hatsPoints ?? "--"}</p>
      <p>Total points</p>
    </div>
  );
};
