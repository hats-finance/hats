import { AirdropFactoriesChainConfig } from "@hats.finance/shared";
import ArrowIcon from "assets/icons/arrow.icon";
import { NextArrowIcon } from "assets/icons/next-arrow";
import { Button, FormInput, HatSpinner, Modal } from "components";
import { isAddress } from "ethers/lib/utils.js";
import { useAirdropsByFactories } from "pages/Airdrops/hooks";
import { DropData } from "pages/Airdrops/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IS_PROD } from "settings";
import { useAccount, useNetwork } from "wagmi";
import { AirdropCard } from "./AirdropCard/AirdropCard";
import { AirdropRedeemModal } from "./AirdropRedeemModal/AirdropRedeemModal";
import { StyledAirdropCheckEligibility } from "./styles";

export const AirdropCheckEligibility = () => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { chain: connectedChain } = useNetwork();

  const [showPastAidrops, setShowPastAidrops] = useState<boolean>(false);
  const [addressToCheck, setAddressToCheck] = useState<string>("");
  const [airdropsToClaim, setAirdropsToClaim] = useState<DropData[]>([]);
  const [checkEligibility, setCheckEligibility] = useState<boolean>();

  const isTestnet = connectedChain?.testnet;
  const env = isTestnet && !IS_PROD ? "test" : "prod";
  const { data: airdropsData, isLoading } = useAirdropsByFactories(AirdropFactoriesChainConfig[env].airdrop);

  const isEligibleForSomeAirdrop =
    airdropsData?.some((airdrop) => airdrop.isLive && airdrop.eligibleFor?.includes(addressToCheck.toLowerCase())) ?? false;

  const redeemableAirdrops = airdropsData?.filter(
    (airdrop) =>
      airdrop.isLive &&
      airdrop.eligibleFor?.includes(addressToCheck.toLowerCase()) &&
      !airdrop.redeemedBy?.includes(addressToCheck.toLowerCase())
  );
  const areRedeemableAirdrops = (redeemableAirdrops?.length ?? 0) > 0 ?? false;

  if (isLoading) {
    return (
      <StyledAirdropCheckEligibility id="check-eligibility">
        <h3 className="mb-4">{t("Airdrop.checkingEligibility")}</h3>
        <HatSpinner text={`${t("Airdrop.loadingAirdrops")}...`} />
      </StyledAirdropCheckEligibility>
    );
  }

  // Airdrops that are live but not redeemed by the user
  const liveAirdrops =
    airdropsData?.filter((airdrop) => airdrop.isLive && !airdrop.redeemedBy.includes(addressToCheck.toLowerCase())) ?? [];
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

      {liveAirdrops.length > 0 && checkEligibility && isEligibleForSomeAirdrop && (
        <div className="buttons mt-2">
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
