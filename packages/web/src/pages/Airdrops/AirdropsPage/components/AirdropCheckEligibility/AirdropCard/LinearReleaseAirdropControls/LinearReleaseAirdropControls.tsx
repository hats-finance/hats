import { NextArrowIcon } from "assets/icons/next-arrow";
import { Button, CopyToClipboard, Loading, Modal } from "components";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useModal from "hooks/useModal";
import moment from "moment";
import { VAULT_TO_DEPOSIT } from "pages/Airdrops/constants";
import { ReleaseTokenLockContract } from "pages/Airdrops/contracts/ReleaseTokenLockContract";
import { VaultDepositWithdrawModal } from "pages/Honeypots/VaultDetailsPage/Sections/VaultDepositsSection/components";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { shortenIfAddress } from "utils/addresses.utils";
import { useWaitForTransaction } from "wagmi";
import { useLinearReleaseAidropInfo } from "./hooks";
import { StyledLinearReleaseAirdropControls, StyledLinearReleaseProgressBar } from "./styles";

type LinearReleaseAirdropControlsProps = {
  chainId: number;
  tokenLockAddress: string;
  addressToCheck: string;
  standalone?: boolean;
};

export const LinearReleaseAirdropControls = ({
  chainId,
  tokenLockAddress,
  addressToCheck,
  standalone = false,
}: LinearReleaseAirdropControlsProps) => {
  const { t } = useTranslation();
  const { isShowing: isShowingDepositModal, show: showDepositModal, hide: hideDepositModal } = useModal();

  const { allVaults } = useVaults();
  const vaultToDeposit = allVaults?.find((vault) => vault.id === VAULT_TO_DEPOSIT.address);

  const {
    data,
    isLoading,
    refetch: refetchTokenLockInfo,
  } = useLinearReleaseAidropInfo(addressToCheck, tokenLockAddress, chainId);
  const areTokensToRelease = (data?.releasable.number ?? 0) > 0;

  const getProgressPercentages = () => {
    if (!data) {
      return {
        released: 0,
        releasable: 0,
      };
    }

    // Get the percentages based on a 100% of the progress bar
    // Example:
    // - total = 100 tokens
    // - released = 40 tokens
    // - releasable = 20 tokens
    // In percentages should be:
    // - released = 40%
    // - releasable = 60% (because it's the released + releasable tokens)

    const total = data.total.number;
    const released = (data.released.number / total) * 100;
    const releasable = ((data.released.number + data.releasable.number) / total) * 100;

    return {
      released,
      releasable,
    };
  };

  const releaseTokensCall = ReleaseTokenLockContract.hook(tokenLockAddress, chainId);
  const waitingReleaseTokensCall = useWaitForTransaction({
    hash: releaseTokensCall.data?.hash as `0x${string}`,
    confirmations: 2,
    onSuccess: async () => {
      refetchTokenLockInfo();
      showDepositModal();
    },
  });

  if (isLoading) return null;

  return (
    <StyledLinearReleaseAirdropControls standalone={standalone}>
      {standalone && (
        <div className="chain-address">
          <div className="address">
            {shortenIfAddress(tokenLockAddress)}
            <CopyToClipboard valueToCopy={tokenLockAddress} overlayText={t("copyAddress")} simple tooltipPlacement="right" />
          </div>
          <div className="network">
            {t("network")}:
            <img className="chain" src={require(`assets/icons/chains/${chainId}.png`)} alt="network" />
            {appChains[chainId].chain.name}
          </div>
        </div>
      )}

      <div className="legend">
        <div className="legend__item">
          <div className="dot released" />
          <p>
            {t("Airdrop.released")} - <span>{data?.released.formatted(2)}</span>
          </p>
        </div>
        {data?.releasable.number !== 0 && (
          <div className="legend__item">
            <div className="dot releasable" />
            <p>
              {t("Airdrop.releasable")} - <span>{data?.releasable.formatted(2)}</span>
            </p>
          </div>
        )}
        {data?.pending.number !== 0 && (
          <div className="legend__item">
            <div className="dot pending" />
            <p>
              {t("Airdrop.linearlyReleased")} - <span>{data?.pending.formatted(2)}</span>
            </p>
          </div>
        )}
      </div>

      <StyledLinearReleaseProgressBar percentages={getProgressPercentages()}>
        <div className="released" />
        <div className="releasable" />
      </StyledLinearReleaseProgressBar>

      <div className="dates">
        <p>
          {t("Airdrop.startDate")} <span>{moment(data?.startTime).format("MMM Do YY'")}</span>
        </p>
        <p>
          {t("Airdrop.endDate")} <span>{moment(data?.endTime).format("MMM Do YY'")}</span>
        </p>
      </div>

      <div className="buttons">
        <Button onClick={releaseTokensCall.send} disabled={!areTokensToRelease}>
          {areTokensToRelease ? (
            <>
              <span>{t("Airdrop.releaseTokens", { tokens: data?.releasable.formatted(2) })}</span>
              <NextArrowIcon className="ml-2" />
            </>
          ) : (
            t("Airdrop.noTokensToRelease")
          )}
        </Button>
        {/* <button onClick={showDepositModal}>open</button> */}
      </div>

      {releaseTokensCall.isLoading && <Loading fixed extraText={`${t("checkYourConnectedWallet")}...`} />}
      {waitingReleaseTokensCall.isLoading && <Loading fixed extraText={`${t("redeemingYourAirdrop")}...`} />}

      {vaultToDeposit && (
        <Modal
          title={t("depositToken", { token: vaultToDeposit.stakingTokenSymbol })}
          isShowing={isShowingDepositModal}
          onHide={hideDepositModal}
        >
          <VaultDepositWithdrawModal action="DEPOSIT" vault={vaultToDeposit} closeModal={hideDepositModal} fromReleaseTokens />
        </Modal>
      )}
    </StyledLinearReleaseAirdropControls>
  );
};
