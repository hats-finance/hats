import { AirdropFactoriesChainConfig, HATAirdropFactory_abi } from "@hats.finance/shared";
import ArrowIcon from "assets/icons/arrow.icon";
import { NextArrowIcon } from "assets/icons/next-arrow";
import { Button, FormInput, HatSpinner, Loading, Modal } from "components";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils.js";
import { useAirdropsByFactories } from "pages/Airdrops/hooks";
import { DropData } from "pages/Airdrops/types";
import { getAirdropMerkleTree, hashToken } from "pages/Airdrops/utils/getAirdropMerkleTree";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IS_PROD } from "settings";
import { switchNetworkAndValidate } from "utils/switchNetwork.utils";
import { useAccount, useNetwork } from "wagmi";
import { writeContract } from "wagmi/actions";
import { AirdropCard } from "./AirdropCard/AirdropCard";
import { AirdropRedeemModal } from "./AirdropRedeemModal/AirdropRedeemModal";
import { StyledAirdropCheckEligibility } from "./styles";

export const AirdropCheckEligibility = () => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { chain: connectedChain } = useNetwork();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPastAidrops, setShowPastAidrops] = useState<boolean>(false);
  const [addressToCheck, setAddressToCheck] = useState<string>("");
  const [airdropsToClaim, setAirdropsToClaim] = useState<DropData[]>([]);
  const [checkEligibility, setCheckEligibility] = useState<boolean>();

  const isTestnet = connectedChain?.testnet;
  const env = isTestnet && !IS_PROD ? "test" : "prod";
  const { data: airdropsData, isLoading: isLoadingAirdrops } = useAirdropsByFactories(AirdropFactoriesChainConfig[env].airdrop);
  const eligibilityChain =
    airdropsData?.find((airdrop) => airdrop.isLive && airdrop.eligibleFor?.includes(addressToCheck.toLowerCase()))?.chainId ??
    airdropsData?.[0].chainId;

  const isEligibleForSomeAirdrop =
    airdropsData?.some((airdrop) => airdrop.isLive && airdrop.eligibleFor?.includes(addressToCheck.toLowerCase())) ?? false;

  const isUserBugDuplicated =
    airdropsData?.some(
      (airdrop) =>
        airdrop.isLive &&
        airdrop.eligibleFor?.filter((address) => address.toLowerCase() === addressToCheck.toLowerCase()).length > 1
    ) ?? false;

  const redeemableAirdrops = airdropsData?.filter(
    (airdrop) =>
      airdrop.isLive &&
      airdrop.eligibleFor?.includes(addressToCheck.toLowerCase()) &&
      !airdrop.redeemedBy?.includes(addressToCheck.toLowerCase())
  );
  const areRedeemableAirdrops = (redeemableAirdrops?.length ?? 0) > 0 ?? false;

  if (isLoadingAirdrops) {
    return (
      <StyledAirdropCheckEligibility id="check-eligibility">
        <h3 className="mb-4">{t("Airdrop.checkingEligibility")}</h3>
        <HatSpinner text={`${t("Airdrop.loadingAirdrops")}...`} />
      </StyledAirdropCheckEligibility>
    );
  }

  // Airdrops that are live but not redeemed by the user
  let liveAirdrops = JSON.parse(
    JSON.stringify(
      airdropsData?.filter((airdrop) => airdrop.isLive && !airdrop.redeemedBy.includes(addressToCheck.toLowerCase())) ?? []
    )
  ) as DropData[];
  liveAirdrops = liveAirdrops.filter((airdrop) => (eligibilityChain ? airdrop.chainId === eligibilityChain : true));
  // Sort liveAirdrops by redeemable
  liveAirdrops.sort((a, b) => (a.eligibleFor.includes(addressToCheck.toLowerCase()) ? -1 : 1));

  // Airdrops that were redeemed by the user
  const redeemedAirdrops = airdropsData?.filter((airdrop) => airdrop.redeemedBy.includes(addressToCheck.toLowerCase())) ?? [];
  // Airdrops that are not live and were not redeemed by the user
  const pastAirdrops =
    airdropsData?.filter((airdrop) => !airdrop.isLive && !airdrop.redeemedBy.includes(addressToCheck.toLowerCase())) ?? [];

  return (
    <StyledAirdropCheckEligibility id="check-eligibility">
      <h3 className="mb-4">{checkEligibility ? t("Airdrop.checkingEligibility") : t("Airdrop.checkEligibility")}</h3>

      <FormInput
        value={addressToCheck}
        label={t("Airdrop.checkEligibility")}
        placeholder={t("Airdrop.addressToCheck")}
        disabled={checkEligibility}
        onChange={(e) => {
          setAddressToCheck(e.target.value as string);
          setCheckEligibility(false);
        }}
      />

      <div className="buttons">
        {!checkEligibility && (
          <>
            {account && (
              <Button styleType="outlined" onClick={() => setAddressToCheck(account)}>
                {t("Airdrop.useConnectedWallet")}
              </Button>
            )}
            <Button disabled={!addressToCheck || !isAddress(addressToCheck)} onClick={() => setCheckEligibility(true)}>
              {t("Airdrop.checkEligibility")} <NextArrowIcon className="ml-1 " />
            </Button>
          </>
        )}
        {checkEligibility && (
          <Button styleType="outlined" onClick={() => setCheckEligibility(false)}>
            {t("Airdrop.checkAnotherAddress")}
          </Button>
        )}
      </div>

      {checkEligibility && addressToCheck && liveAirdrops.length > 0 && (
        <div className="mt-5">
          <h2 className="underline">{t("Airdrop.liveAirdrops")}</h2>
          {liveAirdrops.map((airdropData, idx) => (
            <AirdropCard
              key={airdropData.address}
              addressToCheck={addressToCheck}
              airdropData={airdropData}
              onOpenClaimModal={() => setAirdropsToClaim([airdropData])}
              onOpenDelegateModal={() => {}}
            />
          ))}
        </div>
      )}

      {((liveAirdrops.length > 0 && checkEligibility && isEligibleForSomeAirdrop) || isUserBugDuplicated) && (
        <div className="buttons mt-5">
          {liveAirdrops.length > 0 && checkEligibility && isEligibleForSomeAirdrop && (
            <Button
              disabled={!areRedeemableAirdrops}
              onClick={() => {
                // Get all airdrops that are redeemable and are on the same factory
                const redeemable = liveAirdrops.filter(
                  (airdrop) =>
                    airdrop.eligibleFor?.includes(addressToCheck.toLowerCase()) &&
                    !airdrop.redeemedBy?.includes(addressToCheck.toLowerCase())
                );
                const sameFactoryAirdrops = redeemable.filter((airdrop) => airdrop.factory === redeemable[0].factory);
                setAirdropsToClaim(sameFactoryAirdrops);
              }}
            >
              {areRedeemableAirdrops
                ? t("Airdrop.redeemAllAirdropsQuantity", { quantity: redeemableAirdrops?.length })
                : t("Airdrop.allAirdropsRedeemed")}
              <NextArrowIcon className="ml-2" />
            </Button>
          )}
          {isUserBugDuplicated && airdropsData && checkEligibility && account?.toLowerCase() === addressToCheck.toLowerCase() && (
            <Button
              onClick={async () => {
                try {
                  if (!account || !connectedChain) return;
                  setIsLoading(true);
                  await new Promise((resolve) => setTimeout(resolve, 100));

                  const duplicatedAirdropsToClaim = [] as { address: string; amount: string; airdrop: DropData }[];
                  let factory = "";

                  for (const airdrop of airdropsData) {
                    if (airdrop.descriptionData.merkletree[addressToCheck.toLowerCase()]) {
                      factory = airdrop.factory;
                      const duplicatedAddressInfo = Object.entries(airdrop.descriptionData.merkletree).find(
                        ([add]) => add === addressToCheck.toLowerCase()
                      )?.[1];

                      const totalAllocatedToDuplicatedAddress = duplicatedAddressInfo
                        ? Object.keys(duplicatedAddressInfo.token_eligibility)
                            .reduce(
                              (acc, key) => acc.add(BigNumber.from(duplicatedAddressInfo.token_eligibility[key] ?? 0)),
                              BigNumber.from(0)
                            )
                            .toString()
                        : "0";

                      duplicatedAirdropsToClaim.push({
                        address: addressToCheck.toLowerCase(),
                        amount: totalAllocatedToDuplicatedAddress,
                        airdrop,
                      });
                    }
                  }

                  await switchNetworkAndValidate(connectedChain.id, duplicatedAirdropsToClaim[0].airdrop.chainId);

                  const addresses = duplicatedAirdropsToClaim.map((airdrop) => airdrop.airdrop.address as `0x${string}`);
                  const amounts = duplicatedAirdropsToClaim.map((airdrop) =>
                    airdrop.amount ? BigNumber.from(airdrop.amount) : BigNumber.from(0)
                  );
                  const proofsPromises = duplicatedAirdropsToClaim.map(async (drop, index) => {
                    const merkleTree = await getAirdropMerkleTree(drop.airdrop.descriptionData.merkletree);
                    const amount = amounts[index];
                    const proof = merkleTree.getHexProof(hashToken(addressToCheck.toLowerCase(), amount)) as `0x${string}`[];
                    return proof;
                  });
                  const proofs = await Promise.all(proofsPromises);
                  const vaults = duplicatedAirdropsToClaim.map(
                    (_) => "0x0000000000000000000000000000000000000000" as `0x${string}`
                  );
                  const deposits = duplicatedAirdropsToClaim.map((_) => BigNumber.from(0));
                  const minShares = duplicatedAirdropsToClaim.map((_) => BigNumber.from(0));

                  await writeContract({
                    mode: "recklesslyUnprepared",
                    address: factory as `0x${string}`,
                    abi: HATAirdropFactory_abi,
                    functionName: "redeemMultipleAirdrops",
                    args: [addresses, amounts, proofs, vaults, deposits, minShares],
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {t("Airdrop.redeemTreasuryHutAirdrops")}
              <NextArrowIcon className="ml-2" />
            </Button>
          )}
        </div>
      )}

      {checkEligibility && addressToCheck && redeemedAirdrops.length > 0 && (
        <div className="mt-5">
          <h2 className="underline">{t("Airdrop.redeemedAirdrops")}</h2>
          {redeemedAirdrops.map((airdropData, idx) => (
            <AirdropCard
              key={airdropData.address}
              addressToCheck={addressToCheck}
              airdropData={airdropData}
              onOpenClaimModal={() => setAirdropsToClaim([airdropData])}
              onOpenDelegateModal={() => {}}
            />
          ))}
        </div>
      )}

      {checkEligibility && addressToCheck && pastAirdrops.length > 0 && (
        <div className="mt-5">
          <h2 className="underline selectable" onClick={() => setShowPastAidrops((prev) => !prev)}>
            <ArrowIcon className="arrow" /> {t("Airdrop.pastAirdrops")}
          </h2>
          {showPastAidrops &&
            pastAirdrops.map((airdropData, idx) => (
              <AirdropCard
                key={airdropData.address}
                addressToCheck={addressToCheck}
                airdropData={airdropData}
                onOpenClaimModal={() => setAirdropsToClaim([airdropData])}
                onOpenDelegateModal={() => {}}
              />
            ))}
        </div>
      )}

      {isLoading && <Loading fixed extraText={`${t("redeemingYourAirdrop")}...`} />}

      {airdropsToClaim.length > 0 && addressToCheck && (
        <Modal isShowing={!!airdropsToClaim} onHide={() => setAirdropsToClaim([])} disableOnOverlayClose>
          <AirdropRedeemModal
            chainId={airdropsToClaim[0].chainId}
            airdropFactory={airdropsToClaim[0].factory}
            addressToCheck={addressToCheck}
            airdropsData={airdropsToClaim}
          />
        </Modal>
      )}
    </StyledAirdropCheckEligibility>
  );
};
