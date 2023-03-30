import { IPayoutResponse, PayoutStatus } from "@hats-finance/shared";
import { BASE_SERVICE_URL } from "settings";
import { axiosClient } from "config/axiosClient";

/**
 * Gets a list of all the payouts of a vault
 * @param vaultAddress - The vault address
 * @param chainId - The vault chain id
 */
export async function getPayoutsListByVault(vaultsList: { chainId: number; vaultAddress: string }[]): Promise<IPayoutResponse[]> {
  //   const response = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/${editSessionId}`);

  return [
    {
      _id: "1",
      chainId: 5,
      vaultAddress: "0x000000",
      lastActionNeededNotifiedAt: new Date(),
      nonce: 1,
      minSignaturesNeeded: 3,
      status: PayoutStatus.Creating,
      signatures: [],
      txToSign: "0x000000",
      payoutTxHash: "0x000000",
      createdAt: new Date("04/06/2023"),
      updatedAt: new Date("04/06/2023"),
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
    {
      _id: "2",
      chainId: 5,
      minSignaturesNeeded: 3,
      vaultAddress: "0x000001",
      lastActionNeededNotifiedAt: new Date(),
      nonce: 1,
      status: PayoutStatus.Creating,
      signatures: [],
      txToSign: "0x000000",
      payoutTxHash: "0x000000",
      createdAt: new Date("05/06/2023"),
      updatedAt: new Date("05/06/2023"),
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
    {
      _id: "4",
      chainId: 5,
      minSignaturesNeeded: 3,
      vaultAddress: "0x000001",
      lastActionNeededNotifiedAt: new Date(),
      nonce: 1,
      status: PayoutStatus.Creating,
      signatures: [],
      txToSign: "0x000000",
      payoutTxHash: "0x000000",
      createdAt: new Date("05/06/2023"),
      updatedAt: new Date("05/06/2023"),
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
    {
      _id: "3",
      chainId: 5,
      minSignaturesNeeded: 3,
      vaultAddress: "0x000002",
      lastActionNeededNotifiedAt: new Date(),
      nonce: 1,
      status: PayoutStatus.Executed,
      signatures: [],
      txToSign: "0x000000",
      payoutTxHash: "0x000000",
      createdAt: new Date("05/06/2023"),
      updatedAt: new Date("05/06/2023"),
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
