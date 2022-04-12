import { useApolloClient } from "@apollo/client";
import { updateHatsPrice, updateRewardsToken, updateVaults, updateWithdrawSafetyPeriod } from "actions";
import { PROTECTED_TOKENS } from "data/vaults";
import { GET_MASTER_DATA, GET_VAULTS } from "graphql/subgraph";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reducers";
import { IVault } from "types/types";
import { calculateApy, getTokenPrice, getTokensPrices, getWithdrawSafetyPeriod } from "utils";


export function useVaults() {
    const dispatch = useDispatch()
    const apolloClient = useApolloClient()
    const { hatsPrice, vaults } = useSelector((state: RootState) => state.dataReducer);
    const [tokenPrices, setTokenPrices] = useState<{ [token: string]: number }>();

    const getMasterData = useCallback(async () => {
        const { data } = await apolloClient.query({ query: GET_MASTER_DATA })
        if (data) {
            const { rewardsToken, withdrawPeriod, safetyPeriod } = data.masters[0];
            dispatch(updateRewardsToken(rewardsToken));
            dispatch(updateWithdrawSafetyPeriod(getWithdrawSafetyPeriod(withdrawPeriod, safetyPeriod)));
            dispatch(updateHatsPrice(await getTokenPrice(rewardsToken)))
        }
    }, [apolloClient, dispatch])

    const getVaults = useCallback(async () => {
        const { data } = await apolloClient.query({ query: GET_VAULTS })
        if (data) {
            dispatch(updateVaults((data.vaults as IVault[]).map(vault => ({
                ...vault,
                description: JSON.parse(vault.description as string),
                parentDescription: vault.parentDescription ? JSON.parse(vault.parentDescription as string) : undefined
            }))));
        }
    }, [apolloClient, dispatch])

    const getPrices = useCallback(async () => {
        if (vaults) {
            const stakingTokens = vaults?.map((vault) => {
                // TODO: Temporay until the protected token will be manifested in the subgraph.
                if (PROTECTED_TOKENS.hasOwnProperty(vault.parentVault.stakingToken)) {
                    vault.parentVault.stakingToken = PROTECTED_TOKENS[vault.parentVault.stakingToken];
                }
                return vault.parentVault.stakingToken;
            })
            const uniqueTokens = Array.from(new Set(stakingTokens!));
            const tokenPrices = await getTokensPrices(uniqueTokens!)
            if (tokenPrices) {
                setTokenPrices(tokenPrices);
                dispatch(updateVaults(vaults.map((vault) => {
                    const prices = tokenPrices[vault.parentVault.stakingToken]
                    const tokenPrice = prices ? prices['usd'] : undefined
                    return {
                        ...vault,
                        parentVault: { ...vault.parentVault, tokenPrice }
                    };
                })));

            }
        }
    }, [vaults, setTokenPrices, dispatch])

    useEffect(() => {
        if (vaults && !tokenPrices) {
            getPrices()
        }
    }, [vaults, tokenPrices, getPrices])

    useEffect(() => {
        if (vaults) {
        } else {
            getVaults()
            getMasterData();

        }
    }, [vaults, getVaults, getMasterData])

    useEffect(() => {
        if (hatsPrice && vaults) {
            for (const vault of vaults!) {
                vault.parentVault.apy = calculateApy(vault.parentVault, hatsPrice, vault.parentVault.tokenPrice);
            }
            dispatch(updateVaults(vaults!));

        }
    }, [dispatch, hatsPrice, vaults, getMasterData]);


    return { vaults }
}