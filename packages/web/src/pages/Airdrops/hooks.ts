import { useQuery } from "@tanstack/react-query";
import { getDelegatees } from "./airdropsService";

/**
 * Gets the delegatees
 */
export const useDelegatees = () => {
  return useQuery({
    queryKey: ["delegatees"],
    queryFn: () => getDelegatees(),
  });
};
