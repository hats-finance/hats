import { ISeverity } from "types/types"

export const severities: ISeverity[] = [{
    "name": "low",
    "index": 7,
    "contracts-covered": [],
    "nft-metadata": {
        "name": "Good citizen",
        "description": " Vault low severity reward",
        "animation_url": "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Low-Tech%20Sphere.mp4",
        "image": "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Low-Tech%20Sphere.mp4",
        "external_url": ""

    },
    "description": "Contract does not function as expected, with no loss of funds. Prize will be capped to 5% of the amount that could be frozen, extracted or at risk in production at the time of disclosure."
},
{
    "name": "medium",
    "index": 14,
    "contracts-covered": [],
    "nft-metadata": {
        "name": "Protocol protector",
        "description": " Vault medium severity reward",
        "animation_url": "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-%20Medium-%20Electric%20Dreams.mp4",
        "image": "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-%20Medium-%20Electric%20Dreams.mp4",
        "external_url": ""

    },
    "description": "Contract consumes unbounded gas,block stuffing, griefing denial of service (i.e. attacker spends as much in gas as damage to the contract), gas griefing. Prize will be capped to 20% of the amount that could be frozen, extracted or at risk in production at the time of disclosure."
},
{
    "name": "high",
    "index": 16,
    "contracts-covered": [],
    "nft-metadata": {
        "name": "Protocol champion",
        "description": " high severity reward",
        "animation_url": "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSizeHigh-%20Altair.mp4",
        "image": "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSizeHigh-%20Altair.mp4",

        "external_url": ""
    },
    "description": "Token holders temporarily unable to transfer holdings ,users spoof each other, theft of yield - Transient consensus failures. Prize will be capped to 30% of the amount that could be frozen, extracted or at risk in production at the time of disclosure."
},
{
    "name": "critical",
    "index": 20,
    "contracts-covered": [],
    "nft-metadata": {
        "name": "Protocol savior",
        "description": " critical severity reward",
        "animation_url": "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Critical-Swarm%20of%20Thoughts.mp4",
        "image": "ipfs://ipfs/QmZAuKhEivpnrhPyvhJyPGti4fGLLYQLqvUtRtvsL8wkuC/SmallSize-Critical-Swarm%20of%20Thoughts.mp4",

        "external_url": ""
    },
    "description": "Empty or freeze the contract's holdings (e.g. economic attacks, flash loans, reentrancy, MEV, logic errors, integer over-/under-flow), Cryptographic flaws. Prize will be capped to the amount that could be frozen, extracted or at risk in production at the time of disclosure."
}]