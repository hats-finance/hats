import { AirdropFactoriesChainConfig } from "@hats.finance/shared";
import ArrowIcon from "assets/icons/arrow.icon";
import { NextArrowIcon } from "assets/icons/next-arrow";
import { Button, FormInput, HatSpinner, Modal } from "components";
import { isAddress } from "ethers/lib/utils.js";
import { useAirdropsByFactories } from "pages/Airdrops/hooks";
import { AirdropData } from "pages/Airdrops/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IS_PROD } from "settings";
import { useAccount, useNetwork } from "wagmi";
import { AirdropCard } from "./AirdropCard/AirdropCard";
import { AirdropRedeemModal } from "./AirdropRedeemModal/AirdropRedeemModal";
import { StyledAirdropCheckElegibility } from "./styles";

export const AirdropCheckElegibility = () => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { chain: connectedChain } = useNetwork();

  const [showPastAidrops, setShowPastAidrops] = useState<boolean>(false);
  const [addressToCheck, setAddressToCheck] = useState<string>("");
  const [airdropsToClaim, setAirdropsToClaim] = useState<AirdropData[]>([]);
  const [checkElegibility, setCheckElegibility] = useState<boolean>();

  const isTestnet = !IS_PROD && connectedChain?.testnet;
  const env = isTestnet ? "test" : "prod";
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
      <StyledAirdropCheckElegibility id="check-elegibility">
        <h3 className="mb-4">{t("Airdrop.checkingElegibility")}</h3>
        <HatSpinner text={`${t("Airdrop.loadingAirdrops")}...`} />
      </StyledAirdropCheckElegibility>
    );
  }

  const liveAirdrops = airdropsData?.filter((airdrop) => airdrop.isLive) ?? [];
  const pastAirdrops = airdropsData?.filter((airdrop) => !airdrop.isLive) ?? [];

  return (
    <StyledAirdropCheckElegibility id="check-elegibility">
      <h3 className="mb-4">{checkElegibility ? t("Airdrop.checkingElegibility") : t("Airdrop.checkElegibility")}</h3>

      <FormInput
        value={addressToCheck}
        label={t("Airdrop.checkElegibility")}
        placeholder={t("Airdrop.addressToCheck")}
        disabled={checkElegibility}
        onChange={(e) => {
          setAddressToCheck(e.target.value as string);
          setCheckElegibility(false);
        }}
      />

      <div className="buttons">
        {!checkElegibility && (
          <>
            {account && (
              <Button styleType="outlined" onClick={() => setAddressToCheck(account)}>
                {t("Airdrop.useConnectedWallet")}
              </Button>
            )}
            <Button disabled={!addressToCheck || !isAddress(addressToCheck)} onClick={() => setCheckElegibility(true)}>
              {t("Airdrop.checkElegibility")} <NextArrowIcon className="ml-1 " />
            </Button>
          </>
        )}
        {checkElegibility && (
          <Button styleType="outlined" onClick={() => setCheckElegibility(false)}>
            {t("Airdrop.checkAnotherAddress")}
          </Button>
        )}
      </div>

      {liveAirdrops.length > 0 && checkElegibility && isEligibleForSomeAirdrop && (
        <div className="buttons mt-5">
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

      {checkElegibility && addressToCheck && (
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

      {checkElegibility && addressToCheck && pastAirdrops.length > 0 && (
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
    </StyledAirdropCheckElegibility>
  );
};
