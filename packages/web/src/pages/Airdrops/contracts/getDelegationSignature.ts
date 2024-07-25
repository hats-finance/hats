import { HATToken_abi } from "@hats.finance/shared";
import { fromRpcSig } from "ethereumjs-util";
import { readContract, signTypedData } from "wagmi/actions";

const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const Delegation = [
  { name: "delegatee", type: "address" },
  { name: "nonce", type: "uint256" },
  { name: "expiry", type: "uint256" },
];

const buildDataDelegation = (
  chainId: number,
  verifyingContract: `0x${string}`,
  delegatee: string,
  nonce: number,
  expiry: number
) => ({
  primaryType: "Delegation" as const,
  types: { EIP712Domain, Delegation } as const,
  domain: { name: "hats.finance", version: "1", chainId, verifyingContract } as const,
  message: { delegatee, nonce, expiry } as const,
});

export async function generateDelegationSig(account: string, chainId: number, token: string, delegatee: string, expiry: number) {
  const nonce = await readContract({
    address: token as `0x${string}`,
    abi: HATToken_abi,
    chainId,
    functionName: "nonces",
    args: [account as `0x${string}`],
  });

  const data = buildDataDelegation(chainId, token as `0x${string}`, delegatee, nonce.toNumber(), expiry);
  const signature = await signTypedData({ domain: data.domain, types: data.types, value: data.message });

  const { v, r, s } = fromRpcSig(signature);
  return { v, r, s };
}
