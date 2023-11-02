import { useValidPayouts } from "hooks/leaderboard";

export const useAddressesStats = (addresses?: string[]) => {
  const validPayouts = useValidPayouts();
  console.log(validPayouts);

  return [];
};
