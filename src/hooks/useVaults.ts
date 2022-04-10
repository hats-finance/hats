import { useQuery } from "@apollo/client";
import { PROTECTED_TOKENS } from "data/vaults";
import { GET_VAULTS } from "graphql/subgraph";
import { useEffect, useMemo, useState } from "react";
import { IVault } from "types/types";
import { getTokensPrices } from "utils";


export function useVaults() {
    const { loading, error, data } = useQuery(GET_VAULTS, {
        fetchPolicy: "no-cache"
    });

    const [tokenPrices, setTokenPrices] = useState<{ [token: string]: number }>({});

    useEffect(() => {
        const getPrices = async () => {

            if (data && data.vaults) {
                const vaults = data.vaults as IVault[]
                const stakingTokens = vaults?.map((vault) => {
                    // TODO: Temporay until the protected token will be manifested in the subgraph.
                    if (PROTECTED_TOKENS.hasOwnProperty(vault.parentVault.stakingToken)) {
                        vault.parentVault.stakingToken = PROTECTED_TOKENS[vault.parentVault.stakingToken];
                    }
                    return vault.parentVault.stakingToken;
                })
                const uniqueTokens = Array.from(new Set(stakingTokens!));
                setTokenPrices(await getTokensPrices(uniqueTokens!));
            }
        }
        getPrices()
    }, [data])

    const vaultsWithTokenPrice = useMemo(() => {
        if (data && data.vaults) {
            const vaults = data?.vaults as IVault[]
            if (tokenPrices) {
                return vaults.map((vault) => {
                    const prices = tokenPrices[vault.parentVault.stakingToken]
                    const tokenPrice = prices ? prices['usd'] : undefined
                    return {
                        ...vault,
                        description: JSON.parse(vault.description as string),
                        parentDescription: vault.parentDescription && JSON.parse(vault.parentDescription as string),
                        parentVault: { ...vault.parentVault, tokenPrice }
                    };
                })
            } else {
                return data.vaults
            }
        }
        return undefined
    }, [tokenPrices, data])

    return { loading, error, vaults: vaultsWithTokenPrice };

}