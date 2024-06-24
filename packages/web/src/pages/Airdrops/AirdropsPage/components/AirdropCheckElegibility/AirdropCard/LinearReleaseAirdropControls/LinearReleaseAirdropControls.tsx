import { NextArrowIcon } from "assets/icons/next-arrow";
import { Button, Loading, Modal } from "components";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import useModal from "hooks/useModal";
import moment from "moment";
import { VAULT_TO_DEPOSIT } from "pages/Airdrops/constants";
import { ReleaseTokenLockContract } from "pages/Airdrops/contracts/ReleaseTokenLockContract";
import { AirdropData } from "pages/Airdrops/types";
import { AirdropRedeemData } from "pages/Airdrops/utils/getAirdropRedeemedData";
import { VaultDepositWithdrawModal } from "pages/Honeypots/VaultDetailsPage/Sections/VaultDepositsSection/components";
import { useTranslation } from "react-i18next";
import { useWaitForTransaction } from "wagmi";
import { useLinearReleaseAidropInfo } from "./hooks";
import { StyledLinearReleaseAirdropControls, StyledLinearReleaseProgressBar } from "./styles";

type LinearReleaseAirdropControlsProps = {
  airdropData: AirdropData;
  redeemedData: AirdropRedeemData;
  addressToCheck: string;
};

export const LinearReleaseAirdropControls = ({
  airdropData,
  redeemedData,
  addressToCheck,
}: LinearReleaseAirdropControlsProps) => {
  const { t } = useTranslation();
  const { isShowing: isShowingDepositModal, show: showDepositModal, hide: hideDepositModal } = useModal();

  const { allVaults } = useVaults();
  const vaultToDeposit = allVaults?.find((vault) => vault.id === VAULT_TO_DEPOSIT);

  const { data, isLoading } = useLinearReleaseAidropInfo(addressToCheck, redeemedData.tokenLock?.address, airdropData.chainId);
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

  const releaseTokensCall = ReleaseTokenLockContract.hook(redeemedData.tokenLock?.address, airdropData.chainId);
  const waitingReleaseTokensCall = useWaitForTransaction({
    hash: releaseTokensCall.data?.hash as `0x${string}`,
    confirmations: 2,
    onSuccess: async () => showDepositModal(),
  });

  if (isLoading) return null;

  return (
    <StyledLinearReleaseAirdropControls>
      {/* <p>{redeemedData.tokenLock?.address}</p> */}

      <div className="legend">
        <div className="legend__item">
          <div className="dot released" />
          <p>
            {t("Airdrop.released")} - <span>{data?.released.formatted(2)}</span>
          </p>
        </div>
        <div className="legend__item">
          <div className="dot releasable" />
          <p>
            {t("Airdrop.releasable")} - <span>{data?.releasable.formatted(2)}</span>
          </p>
        </div>
        <div className="legend__item">
          <div className="dot pending" />
          <p>
            {t("Airdrop.linearlyReleased")} - <span>{data?.pending.formatted(2)}</span>
          </p>
        </div>
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
