import HistoryIcon from "@mui/icons-material/ManageSearchOutlined";
import InfoIcon from "assets/icons/info.icon";
import { Button, Loading, Modal, WithTooltip } from "components";
import { queryClient } from "config/reactQuery";
import { BigNumber } from "ethers";
import useConfirm from "hooks/useConfirm";
import useModal from "hooks/useModal";
import moment from "moment";
import { RedeemPointdropsContract } from "pages/MyWallet/contracts/RedeemPointdropsContract";
import { useTranslation } from "react-i18next";
import { Amount } from "utils/amounts.utils";
import { useWaitForTransaction } from "wagmi";
import { RedeemedHistoryModal } from "./RedeemedHistoryModal";
import { useAccountConvertibleTokens } from "./useAccountConvertibleTokens";

export const ConvertibleTokensCard = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { isShowing: isShowingRedeemedHistory, show: showRedeemedHistory, hide: hideRedeemedHistory } = useModal();

  const pointdropsData = useAccountConvertibleTokens();
  const pointdropsSameFactory = pointdropsData.redeemable.filter(
    (pointdrop) => pointdrop.factory === pointdropsData.redeemable[0].factory
  );
  const areRedeemableTokens = pointdropsData.redeemable.length > 0;
  const areRedeemedTokens = pointdropsData.redeemed.length > 0;

  const totalRedeemablePoints = pointdropsData.totalRedeemable.points;
  const totalRedeemableTokens = new Amount(pointdropsData.totalRedeemable.tokens, 18).formattedWithoutSymbol();

  const redeemPointdropsCall = RedeemPointdropsContract.hook(pointdropsSameFactory);
  const waitingRedeemPointdropsCall = useWaitForTransaction({
    hash: redeemPointdropsCall.data?.hash as `0x${string}`,
    confirmations: 2,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["airdrop-by-factories"] });
      const points = pointdropsSameFactory.reduce((acc, pointdrop) => acc + pointdrop.points, 0);
      const tokens = new Amount(
        pointdropsSameFactory.reduce((acc, pointdrop) => acc.add(pointdrop.tokens), BigNumber.from(0)),
        18
      ).formattedWithoutSymbol();

      confirm({
        title: t("MyWallet.tokensClaimed"),
        description: t("MyWallet.tokensClaimedDescription", { tokens, points }),
        confirmText: t("gotIt"),
        noCancel: true,
      });
    },
  });

  const getRedeemablePointsInfo = () => {
    if (pointdropsData.redeemable.length === 0) return t("MyWallet.noTokensToClaim");

    return pointdropsData.redeemable
      .map((airdrop) => {
        const date = moment(airdrop.startTimeDate).format("MMMM YY'");
        const points = airdrop.points;
        const tokens = new Amount(airdrop.tokens, 18).formattedWithoutSymbol();

        return `~ ${date}: ${points} points = ${tokens} HAT`;
      })
      .join("\n");
  };

  const handleClaimPointdrops = async () => {
    return redeemPointdropsCall.send();
  };

  return (
    <div className="overview-card">
      <WithTooltip text={getRedeemablePointsInfo()} placement="bottom">
        <div>
          {areRedeemableTokens ? (
            <p className="main-content convertible-points">
              {totalRedeemablePoints} points <strong> = {totalRedeemableTokens} HAT</strong>
            </p>
          ) : (
            <p className="main-content">-</p>
          )}
          <div className="flex mt-4">
            <p>{t("MyWallet.claimableTokens")}</p>
            <InfoIcon width={16} height={16} />
          </div>
        </div>
      </WithTooltip>
      <div className="convertible-buttons mt-5">
        <Button disabled={!areRedeemableTokens} className="action-button" onClick={handleClaimPointdrops}>
          {t("MyWallet.claimTokens")}
        </Button>
        {areRedeemedTokens && (
          <WithTooltip text={t("MyWallet.claimedTokensHistory")} placement="bottom">
            <Button styleType="outlined" size="medium" onClick={showRedeemedHistory}>
              <HistoryIcon />
            </Button>
          </WithTooltip>
        )}
      </div>

      <Modal
        isShowing={isShowingRedeemedHistory}
        title={t("MyWallet.claimedTokensHistory")}
        titleIcon={<HistoryIcon className="mr-2" />}
        onHide={hideRedeemedHistory}
        overflowVisible
      >
        <RedeemedHistoryModal redeemedPointdrops={pointdropsData.redeemed} totalRedeemed={pointdropsData.totalRedeemed} />
      </Modal>

      {redeemPointdropsCall.isLoading && <Loading fixed extraText={`${t("checkYourConnectedWallet")}...`} />}
      {waitingRedeemPointdropsCall.isLoading && <Loading fixed extraText={`${t("redeemingYourTokens")}...`} />}
    </div>
  );
};
