export const getOldTokenPrice = (payoutId: string) => {
  // Premia bug bounty (approved at Sunday, 28 May 2023 14:43:48)
  if (payoutId === "0xa1b450da7a1c081ed962b1c30d7c97628fa81c57f24a3704ca162f3b94270ef3") {
    return 1; // USDC
  }

  // Spiral DAO bug bounty (approved at Thursday, 8 June 2023 16:20:23)
  if (payoutId === "0x22dfd9c7a536f5da81749f4e0600b93de78bfa02f2cb40ccabda382c44d3b127") {
    return 2.38; // SPR
  }

  // Spiral DAO bug bounty (approved at Thursday, 6 July 2023 14:07:47)
  if (payoutId === "0x3cb28dfe7b24bcba88052df101ace5f34439f0d94009230089686b21d36379d6") {
    return 2.77; // SPR
  }

  // Raft Finance bug bounty (approved at Friday, 16 June 2023 15:29:23)
  if (payoutId === "0xca9ea82e981a5a5c239ce921a89dd790d8a77ab4d744eea0bf0b8a7e48faf937") {
    return 0.03686; // TEMP
  }

  // HOPR bug bounty (approved at Monday, 5 June 2023 23:14:11)
  if (payoutId === "0x2ef81a42193c9785c033a9b051813bb370076df1241e6d852e7a857e83638e8c") {
    return 0.05144; // HOPR
  }

  return undefined;
};
