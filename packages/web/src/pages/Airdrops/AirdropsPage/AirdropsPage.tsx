import { AirdropChainConfig, AirdropConfig } from "@hats.finance/shared";
import { Button, FormInput, Modal } from "components";
import { isAddress } from "ethers/lib/utils.js";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IS_PROD } from "settings";
import { useAccount, useNetwork } from "wagmi";
import { AirdropCard } from "./components/AirdropCard/AirdropCard";
import { AirdropRedeemModal } from "./components/AirdropRedeemModal/AirdropRedeemModal";
import { StyledAirdropsPage } from "./styles";

export const AirdropsPage = () => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { chain: connectedChain } = useNetwork();

  const [addressToCheck, setAddressToCheck] = useState<string | undefined>(account);
  const [airdropToClaim, setAidropToClaim] = useState<AirdropConfig>();
  const [checkElegibility, setCheckElegibility] = useState<boolean>();

  const isTestnet = !IS_PROD && connectedChain?.testnet;
  const env = isTestnet ? "test" : "prod";
  const aidrops = AirdropChainConfig[env];

  if (!account) return <p>You need to be connected</p>;

  return (
    <StyledAirdropsPage>
      <h3 className="mb-4">Airdrops</h3>

      {/* <button
        onClick={async () => {
          const a = JSON.parse(`{
            "0xC2d10F4dE6e9cF298D7e79Db5126184f5f883A69": {
              "token_eligibility": {
                "committee_member": "0",
                "depositor": "100000000000000000000",
                "crow": "0",
                "coder": "0",
                "early_contributor": "500000000000000000000"
              }
            },
            "0x0B7602011EC2B862Bc157fF08d27b1018aEb18d5": {
              "token_eligibility": {
                "committee_member": "0",
                "depositor": "100000000000000000000",
                "crow": "0",
                "coder": "0",
                "early_contributor": "0"
              }
            },
            "0x5b7B59862447Cf3dE479C8166cc2784cbf8e53D6": {
              "token_eligibility": {
                "committee_member": "100000000000000000000",
                "depositor": "200000000000000000000",
                "crow": "0",
                "coder": "40000000000000000000",
                "early_contributor": "0"
              }
            },
            "0xaFd8C4f6f5f0d64f0e8bcE4C22DAa7b575506400": {
              "token_eligibility": {
                "committee_member": "100000000000000000000",
                "depositor": "200000000000000000000",
                "crow": "0",
                "coder": "30000000000000000000",
                "early_contributor": "0"
              }
            },
            "0xCC5BD779A1EACeEFA704315A1F504446B6D25a1F": {
              "token_eligibility": {
                "committee_member": "100000000000000000000",
                "depositor": "200000000000000000000",
                "crow": "0",
                "coder": "20000000000000000000",
                "early_contributor": "0"
              }
            },
            "0x1885B7c7a3AE1F35BA71C0392C13153A95c4914f": {
              "token_eligibility": {
                "committee_member": "0",
                "depositor": "100000000000000000000",
                "crow": "0",
                "coder": "0",
                "early_contributor": "0"
              }
            }
          }`);
          const merkeltree = await getAirdropMerkelTree(a);
          const contractInterface = new ethers.utils.Interface(HATAirdrop_abi);
          const initData = contractInterface.encodeFunctionData("initialize", [
            "QmSXtBgRmeGs5P1yXadcCMjKG9PFjQRpGGKKWZWPDWUBtW",
            merkeltree.getHexRoot(),
            1713195154,
            1714080754,
            1714080754,
            30,
            "0xbdb34BB8665510d331FacAAaA0eeAe994a5B6612",
            "0x0153A75550E32CDf9a4458301bb89b600e745EAf",
          ]);

          console.log(initData);
        }}
      >
        Get merkeltree
      </button> */}

      <FormInput
        value={addressToCheck}
        label={t("Airdrop.checkElegibility")}
        placeholder={t("Airdrop.addressToCheck")}
        onChange={(e) => {
          setAddressToCheck(e.target.value as string);
          setCheckElegibility(false);
        }}
      />

      <Button disabled={!addressToCheck || !isAddress(addressToCheck)} onClick={() => setCheckElegibility(true)}>
        {t("Airdrop.checkElegibility")}
      </Button>

      {checkElegibility && addressToCheck && (
        <div className="mt-5">
          {aidrops.map((airdrop) => (
            <AirdropCard
              addressToCheck={addressToCheck}
              airdrop={airdrop}
              key={airdrop.address}
              onOpenClaimModal={() => setAidropToClaim(airdrop)}
            />
          ))}
        </div>
      )}

      {airdropToClaim && addressToCheck && (
        <Modal isShowing={!!airdropToClaim} onHide={() => setAidropToClaim(undefined)}>
          <AirdropRedeemModal
            addressToCheck={addressToCheck}
            aidropData={airdropToClaim}
            closeModal={() => setAidropToClaim(undefined)}
          />
        </Modal>
      )}
    </StyledAirdropsPage>
  );
};
