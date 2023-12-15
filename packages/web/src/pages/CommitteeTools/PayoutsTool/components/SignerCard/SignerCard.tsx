import { getGnosisChainPrefixByChainId } from "@hats.finance/shared";
import { CopyToClipboard, Pill } from "components";
import { useTranslation } from "react-i18next";
import Identicon from "react-identicons";
import { shortenIfAddress } from "utils/addresses.utils";
import { useAccount, useEnsName } from "wagmi";
import { StyledSignerCard } from "./styles";

type SignerCardProps = {
  signerAddress: string;
  chainId: number;
  signed: boolean;
};

export const SignerCard = ({ signerAddress, chainId, signed }: SignerCardProps) => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { data: ens } = useEnsName({ address: signerAddress as `0x${string}` });

  const safeChainPrefix = getGnosisChainPrefixByChainId(chainId);

  return (
    <StyledSignerCard>
      <Identicon string={signerAddress} size={35} bg="#fff" />
      <p className="address">
        {safeChainPrefix}:{ens || shortenIfAddress(signerAddress, { startLength: 6 })}{" "}
        {address === signerAddress && <strong>({t("you")})</strong>}
      </p>

      <div className="mr-4">
        <CopyToClipboard overlayText={t("copyAddress")} tooltipPlacement="right" valueToCopy={signerAddress} />
      </div>

      <Pill dotColor={signed ? "blue" : "yellow"} text={signed ? t("approved") : t("waitingSignature")} />
    </StyledSignerCard>
  );
};
