import { AirdropChainConfig, AirdropConfig } from "@hats.finance/shared";
import { Modal } from "components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IS_PROD } from "settings";
import { useAccount, useNetwork } from "wagmi";
import { AirdropModal } from "./AirdropModal/AirdropModal";
import { StyledAirdropsPage } from "./styles";

export const AirdropsPage = () => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { chain: connectedChain } = useNetwork();

  const [selectedAirdrop, setSelectedAirdrop] = useState<AirdropConfig>();

  const isTestnet = !IS_PROD && connectedChain?.testnet;
  const env = isTestnet ? "test" : "prod";
  const aidrops = AirdropChainConfig[env];

  if (!account) return <p>You need to be connected</p>;

  return (
    <StyledAirdropsPage>
      <h3 className="mb-4">Airdrops</h3>

      {aidrops.map((airdrop, idx) => (
        <div key={airdrop.address} onClick={() => setSelectedAirdrop(airdrop)}>
          <h4>
            #{idx} - {airdrop.address}
          </h4>
          <p>{airdrop.chain.name}</p>
        </div>
      ))}

      {selectedAirdrop && (
        <Modal isShowing={!!selectedAirdrop} onHide={() => setSelectedAirdrop(undefined)}>
          <AirdropModal aidropData={selectedAirdrop} closeModal={() => setSelectedAirdrop(undefined)} />
        </Modal>
      )}
    </StyledAirdropsPage>
  );
};
