import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import useConfirm from "hooks/useConfirm";
import { CopyToClipboard, Button, Loading } from "components";
import { RoutePaths } from "navigation";
import { useDeletePayout, usePayout } from "../payoutsService.hooks";
import { StyledPayoutStatusPage } from "./styles";
import BackIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import RemoveIcon from "@mui/icons-material/DeleteOutlineOutlined";

export const PayoutStatusPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { payoutId } = useParams();
  const { data: payout, isLoading: isLoadingPayout } = usePayout(payoutId);

  const deletePayout = useDeletePayout();

  const handleDeletePayout = async () => {
    if (!payoutId || !payout) return;

    const wantsToDelete = await confirm({
      title: t("Payouts.deletePayout"),
      titleIcon: <RemoveIcon className="mr-2" fontSize="large" />,
      description: t("Payouts.deletePayoutDescription"),
      cancelText: t("no"),
      confirmText: t("delete"),
      confirmTextInput: {
        label: t("Payouts.payoutName"),
        placeholder: t("Payouts.payoutNamePlaceholder"),
        textToConfirm: payout.payoutData.title,
      },
    });

    if (!wantsToDelete) return;

    const wasDeleted = await deletePayout.mutateAsync({ payoutId });
    if (wasDeleted) navigate(`${RoutePaths.payouts}`);
  };

  if (isLoadingPayout) return <Loading extraText={`${t("Payouts.loadingPayoutData")}...`} />;

  return (
    <StyledPayoutStatusPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title" onClick={() => navigate(`${RoutePaths.payouts}`)}>
          <BackIcon />
          <p>{t("payouts")}</p>
        </div>

        <CopyToClipboard valueToCopy={DOMPurify.sanitize(document.location.href)} overlayText={t("Payouts.copyPayoutLink")} />
      </div>

      <div className="section-title">{t("Payouts.payoutStatus")}</div>

      <div className="buttons">
        <Button styleType="outlined" onClick={handleDeletePayout}>
          <RemoveIcon className="mr-2" />
          {t("Payouts.deletePayout")}
        </Button>

        <Button>{t("Payouts.signPayout")}</Button>
      </div>

      {deletePayout.isLoading && <Loading fixed extraText={`${t("Payouts.deletingPayout")}...`} />}
    </StyledPayoutStatusPage>
  );
};
