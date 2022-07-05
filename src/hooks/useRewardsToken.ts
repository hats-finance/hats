import { useApolloClient } from "@apollo/client";
import { GET_REWARDS_TOKEN } from "graphql/subgraph";
import { useEffect, useState } from "react";

export function useRewardsToken() {
  const apolloClient = useApolloClient();
  const [rewardsToken, setRewardsToken] = useState();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!cancelled) {
        setRewardsToken((await apolloClient.query({
          query: GET_REWARDS_TOKEN
        }))?.data?.masters[0]?.rewardsToken);
      }
    })();

    return () => {
      cancelled = true;
    }
  }, [apolloClient])

  return { rewardsToken };
}
