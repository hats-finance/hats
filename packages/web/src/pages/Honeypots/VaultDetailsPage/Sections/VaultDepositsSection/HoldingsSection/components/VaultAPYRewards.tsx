import { IVault } from "@hats.finance/shared";
import { ReactComponent as HatsTokenIcon } from "assets/icons/hat-token.svg";
import { Button, Loading, Modal } from "components";
import { ClaimRewardContract, PendingRewardContract } from "contracts";
import useModal from "hooks/useModal";
import { IVaultApy, useVaultApy } from "hooks/vaults/useVaultApy";
import millify from "millify";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Amount } from "utils/amounts.utils";
import { useAccount, useWaitForTransaction } from "wagmi";
import { SuccessActionModal } from "../../components";

type VaultAPYRewardsProps = {
  vault: IVault;
};

export const VaultAPYRewards = ({ vault }: VaultAPYRewardsProps) => {
  const vaultApys = useVaultApy(vault);
  const pendingRewards = PendingRewardContract.hook(vault);

  if (!pendingRewards || pendingRewards.length === 0) return <></>;

  return (
    <>
      {vaultApys.map((apyInfo, index) => (
        <RewardControllerRewards key={index} index={index} vaultApy={apyInfo} pendingRewards={pendingRewards} vault={vault} />
      ))}
    </>
  );
};

type IRewardControllerRewardsProps = {
  index: number;
  vaultApy: IVaultApy;
  vault: IVault;
  pendingRewards: Amount[];
};

const RewardControllerRewards = ({ vaultApy, vault, pendingRewards, index }: IRewardControllerRewardsProps) => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const { isShowing: isShowingSuccessModal, show: showSuccessModal, hide: hideSuccessModal } = useModal();

  const isAudit = vault.description && vault.description["project-metadata"].type === "audit";

  const getActionButton = () => {
    return (
      <Button size="medium" filledColor={isAudit ? "primary" : "secondary"} onClick={handleClaimRewards}>
        {t("claimRewards")}
      </Button>
    );
  };

  // -------> CLAIM REWARDS
  const claimRewardsCall = ClaimRewardContract.hook(vaultApy.rewardController.id, vault);
  const waitingClaimRewardsCall = useWaitForTransaction({
    hash: claimRewardsCall.data?.hash as `0x${string}`,
    onSuccess: () => showSuccessModal(),
  });
  const handleClaimRewards = useCallback(() => {
    claimRewardsCall.send();
  }, [claimRewardsCall]);

  const getRewardsToClaim = () => {
    const rewardsInToken = pendingRewards[index].formatted();
    const rewardsInUsd = millify(pendingRewards[index].number * vaultApy.rewardController.tokenPriceUsd);
    return `${rewardsInToken} (~$${rewardsInUsd})`;
  };

  const getClaimedRewards = () => {
    const staker = vault.stakers.find((staker) => staker.address.toLowerCase() === address?.toLowerCase());
    if (!staker || staker.totalRewardPaid === "0") return "-";

    const claimedRewards = new Amount(
      staker.totalRewardPaid as any,
      vaultApy.rewardController.rewardTokenDecimals,
      vaultApy.rewardController.rewardTokenSymbol
    );
    const rewardsInToken = claimedRewards.formatted();
    const rewardsInUsd = millify(claimedRewards.number * vaultApy.rewardController.tokenPriceUsd);
    return `${rewardsInToken} (~$${rewardsInUsd})`;
  };

  return (
    <div>
      <div className="row">
        <div className="token-reward-info">
          <div className="logo">{vaultApy.rewardController.rewardTokenSymbol === "HAT" && <HatsTokenIcon />}</div>
          <div>{vaultApy.rewardController.rewardTokenSymbol}</div>
        </div>
        <div>{getRewardsToClaim()}</div>
        <div>{getClaimedRewards()}</div>
        <div className="action-button">{getActionButton()}</div>
      </div>

      {claimRewardsCall.isLoading && <Loading fixed extraText={`${t("checkYourConnectedWallet")}...`} />}
      {waitingClaimRewardsCall.isLoading && <Loading fixed extraText={`${t("claimingRewards")}...`} />}

      <Modal isShowing={isShowingSuccessModal} onHide={() => hideSuccessModal()}>
        <SuccessActionModal
          title={t("successRewardsClaimModalTitle")}
          content={t("successRewardsClaimModalContent")}
          closeModal={hideSuccessModal}
        />
      </Modal>
    </div>
  );
};
