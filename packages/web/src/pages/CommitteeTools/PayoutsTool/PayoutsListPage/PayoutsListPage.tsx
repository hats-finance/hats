import { IPayoutResponse, PayoutStatus } from "@hats-finance/shared";
import AddIcon from "@mui/icons-material/AddOutlined";
import { Alert, Button, HatSpinner, Modal, Seo } from "components";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import useModal from "hooks/useModal";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";
import { PayoutCard } from "../components";
import { usePayoutsBySiweUser } from "../payoutsService.hooks";
import { PayoutCreateModal } from "./PayoutCreateModal";
import { PayoutsWelcome } from "./PayoutsWelcome";
import { PayoutListSection, PayoutListSections, StyledPayoutsListPage } from "./styles";

const DraftStatus = [PayoutStatus.Creating];
const InProgressStatus = [PayoutStatus.Pending, PayoutStatus.ReadyToExecute];
const FinishedStatus = [PayoutStatus.Executed, PayoutStatus.Rejected, PayoutStatus.Approved];

export const PayoutsListPage = () => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { tryAuthentication, isAuthenticated } = useSiweAuth();

  const { isShowing: isShowingCreateModal, show: showCreateModal, hide: hideCreateModal } = useModal();

  const [section, setSection] = useState<"drafts" | "in_progress" | "finished">("in_progress");

  const { data: allPayouts, isLoading: isLoadingPayouts } = usePayoutsBySiweUser();

  useEffect(() => {
    tryAuthentication();
  }, [tryAuthentication]);

  // Only the first time the payouts are loaded, check if there are any drafts or in progress payouts
  useEffect(() => {
    if (isLoadingPayouts) return;

    if (allPayouts?.some((payout) => DraftStatus.includes(payout.status))) setSection("drafts");
    if (allPayouts?.some((payout) => InProgressStatus.includes(payout.status))) setSection("in_progress");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingPayouts]);

  const handleCreatePayout = async () => {
    const signedIn = await tryAuthentication();
    if (!signedIn) return;

    showCreateModal();
  };

  // Gets the payouts, filter them by section and group them by date
  const getPayoutsToShow = useCallback((): { date: string; payouts: IPayoutResponse[] }[] => {
    if (isLoadingPayouts) return [];
    if (!allPayouts || allPayouts.length === 0) return [];

    const payoutsFilteredBySection = allPayouts.filter((payout) => {
      if (section === "drafts") return DraftStatus.includes(payout.status);
      if (section === "in_progress") return InProgressStatus.includes(payout.status);
      return FinishedStatus.includes(payout.status);
    });

    const payoutGroupsByDate = payoutsFilteredBySection.reduce<{ [key: string]: IPayoutResponse[] }>((groups, payout) => {
      const date = moment(payout.createdAt).format("MM/DD/YYYY");
      if (!groups[date]) groups[date] = [];
      groups[date].push(payout);
      return groups;
    }, {});

    const payoutGroupsByDateArray = Object.keys(payoutGroupsByDate).map((date) => {
      return {
        date,
        payouts: payoutGroupsByDate[date].sort(
          (a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime()
        ),
      };
    });

    // Order array by date
    payoutGroupsByDateArray.sort((a, b) => {
      const dateA = moment(a.date, "MM/DD/YYYY");
      const dateB = moment(b.date, "MM/DD/YYYY");
      return dateB.diff(dateA);
    });

    return payoutGroupsByDateArray;
  }, [allPayouts, isLoadingPayouts, section]);

  if (!address) return <PayoutsWelcome />;

  const payoutsToShow = getPayoutsToShow();

  return (
    <>
      <Seo title={t("seo.payoutsDashboardTitle")} />
      <StyledPayoutsListPage className="content-wrapper-md">
        <div className="title-container">
          <div className="title">
            <p>
              {t("committeeTools")}/<span className="bold">{t("payouts")}</span>
            </p>
          </div>

          <Button onClick={handleCreatePayout}>
            <AddIcon className="mr-2" />
            {t("Payouts.createPayout")}
          </Button>
        </div>

        <PayoutListSections>
          {allPayouts && allPayouts.some((payout) => payout.status === PayoutStatus.Creating) && (
            <PayoutListSection active={section === "drafts"} onClick={() => setSection("drafts")}>
              {t("drafts")}
            </PayoutListSection>
          )}
          <PayoutListSection active={section === "in_progress"} onClick={() => setSection("in_progress")}>
            {t("inProgress")}
          </PayoutListSection>
          <PayoutListSection active={section === "finished"} onClick={() => setSection("finished")}>
            {t("history")}
          </PayoutListSection>
        </PayoutListSections>

        {!isAuthenticated && (
          <>
            <Alert type="warning">{t("Payouts.signInToSeePayouts")}</Alert>
            <Button onClick={tryAuthentication} className="mt-4">
              {t("signInWithEthereum")}
            </Button>
          </>
        )}

        {isAuthenticated && (
          <>
            {!isLoadingPayouts ? (
              <>
                {payoutsToShow.length > 0 ? (
                  payoutsToShow.map((payoutGroup) => (
                    <div className="group" key={payoutGroup.date}>
                      <p className="group-date">{moment(payoutGroup.date, "MM/DD/YYYY").format("MMM DD, YYYY")}</p>
                      {payoutGroup.payouts.map((payout) => (
                        <PayoutCard key={payout._id} payout={payout} />
                      ))}
                    </div>
                  ))
                ) : (
                  <>
                    {section === "finished" ? (
                      <Alert type="info">{t("Payouts.noPayoutsHistory")}</Alert>
                    ) : (
                      <>
                        <Alert type="info">{t("Payouts.noPayoutsInProgress")}</Alert>
                        <Button onClick={handleCreatePayout} className="mt-4">
                          <AddIcon className="mr-2" />
                          {t("Payouts.createPayout")}
                        </Button>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <HatSpinner expanded text={`${t("Payouts.loadingPayouts")}...`} />
            )}
          </>
        )}
      </StyledPayoutsListPage>

      <Modal
        isShowing={isShowingCreateModal}
        title={t("Payouts.createNewPayout")}
        titleIcon={<AddIcon className="mr-2" />}
        onHide={hideCreateModal}
        overflowVisible
      >
        <PayoutCreateModal closeModal={hideCreateModal} />
      </Modal>
    </>
  );
};
