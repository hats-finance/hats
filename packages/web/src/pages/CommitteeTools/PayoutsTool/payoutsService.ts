import { IPayoutResponse, PayoutStatus } from "@hats-finance/shared";
import { BASE_SERVICE_URL } from "settings";
import { axiosClient } from "config/axiosClient";

/**
 * Gets a list of all the payouts of a vault
 * @param vaultAddress - The vault address
 * @param chainId - The vault chain id
 */
export async function getPayoutsListByVault(editSessionId: string): Promise<IPayoutResponse[]> {
  //   const response = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/${editSessionId}`);

  return [
    {
      _id: "1",
      chainId: 5,
      vaultAddress: "0x000000",
      lastActionNeededNotifiedAt: new Date(),
      nonce: 1,
      status: PayoutStatus.Creating,
      signatures: [],
      txToSign: "0x000000",
      payoutTxHash: "0x000000",
      payoutData: {
        beneficiary: "0x000000",
        decryptedMessage: "",
        encryptedMessage: "",
        percentageToPay: 90,
        reportDate: new Date(),
        title: "Payout 1",
        reportTxid: "0x000000",
      },
    },
  ];
}
