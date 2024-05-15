import { AirdropChainConfig, AirdropConfig } from "@hats.finance/shared";
import { NextArrowIcon } from "assets/icons/next-arrow";
import { Button, FormInput, Modal } from "components";
import { isAddress } from "ethers/lib/utils.js";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IS_PROD } from "settings";
import { useAccount, useNetwork } from "wagmi";
import { AirdropCard } from "./AirdropCard/AirdropCard";
import { AirdropDelegateModal } from "./AirdropDelegateModal/AirdropDelegateModal";
import { AirdropRedeemModal } from "./AirdropRedeemModal/AirdropRedeemModal";
import { StyledAirdropCheckElegibility } from "./styles";

export const AirdropCheckElegibility = () => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { chain: connectedChain } = useNetwork();

  // const [showPastAidrops, setShowPastAidrops] = useState<boolean>(false);
  const [addressToCheck, setAddressToCheck] = useState<string>("");
  const [airdropToClaim, setAirdropToClaim] = useState<AirdropConfig>();
  const [airdropToDelegate, setAirdropToDelegate] = useState<AirdropConfig>();
  const [checkElegibility, setCheckElegibility] = useState<boolean>();

  const isTestnet = !IS_PROD && connectedChain?.testnet;
  const env = isTestnet ? "test" : "prod";
  const airdrops = AirdropChainConfig[env];

  return (
    <StyledAirdropCheckElegibility>
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

      {checkElegibility && addressToCheck && (
        <div className="mt-5">
          {/* <h2 className="underline">{t("Airdrop.liveAirdrops")}</h2> */}
          {airdrops.map((airdrop, idx) => (
            <AirdropCard
              addressToCheck={addressToCheck}
              idx={idx}
              airdrop={airdrop}
              key={airdrop.address}
              onOpenClaimModal={() => setAirdropToClaim(airdrop)}
              onOpenDelegateModal={() => setAirdropToDelegate(airdrop)}
              showFilter="all"
            />
          ))}
        </div>
      )}

      {/* {checkElegibility && addressToCheck && (
        <div className="mt-5">
          <h2 className="underline selectable" onClick={() => setShowPastAidrops((prev) => !prev)}>
            <ArrowIcon className="arrow" /> {t("Airdrop.pastAirdrops")}
          </h2>
          {showPastAidrops &&
            airdrops.map((airdrop, idx) => (
              <AirdropCard
                addressToCheck={addressToCheck}
                idx={idx}
                airdrop={airdrop}
                key={airdrop.address}
                onOpenClaimModal={() => setAirdropToClaim(airdrop)}
                onOpenDelegateModal={() => setAirdropToDelegate(airdrop)}
                showFilter="past"
              />
            ))}
        </div>
      )} */}

      {airdropToClaim && addressToCheck && (
        <Modal isShowing={!!airdropToClaim} onHide={() => setAirdropToClaim(undefined)} disableOnOverlayClose>
          <AirdropRedeemModal
            addressToCheck={addressToCheck}
            aidropData={airdropToClaim}
            closeModal={() => setAirdropToClaim(undefined)}
          />
        </Modal>
      )}

      {airdropToDelegate && addressToCheck && (
        <Modal isShowing={!!airdropToDelegate} onHide={() => setAirdropToDelegate(undefined)} disableOnOverlayClose>
          <AirdropDelegateModal
            addressToCheck={addressToCheck}
            aidropData={airdropToDelegate}
            closeModal={() => setAirdropToDelegate(undefined)}
          />
        </Modal>
      )}
    </StyledAirdropCheckElegibility>
  );
};
