import Identicon from "react-identicons";
import { useTranslation } from "react-i18next";
import { getGnosisChainPrefixByChainId } from "@hats-finance/shared";
import { useEnsName } from "wagmi";
import { CopyToClipboard, Pill } from "components";
import { shortenIfAddress } from "utils/addresses.utils";
import { StyledSignerCard } from "./styles";

type SignerCardProps = {
  signerAddress: string;
  chainId: number;
  signed: boolean;
};

export const SignerCard = ({ signerAddress, chainId, signed }: SignerCardProps) => {
  const { t } = useTranslation();
  const { data: ens } = useEnsName({ address: signerAddress as `0x${string}` });

  const safeChainPrefix = getGnosisChainPrefixByChainId(chainId);

  return (
    <StyledSignerCard>
      <Identicon string={signerAddress} size={35} bg="#fff" />
      <p className="address">
        {safeChainPrefix}:{ens || shortenIfAddress(signerAddress, { startLength: 6 })}
      </p>

      <CopyToClipboard overlayText={t("copyAddress")} tooltipPlacement="right" valueToCopy={signerAddress} />

      <Pill color={signed ? "blue" : "yellow"} text={signed ? t("approved") : t("waitingSignature")} />
    </StyledSignerCard>
  );
};
