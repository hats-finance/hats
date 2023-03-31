import { useEffect, useState } from "react";
import { getAddressSafes, IPayoutResponse, IVault, PayoutStatus } from "@hats-finance/shared";
import { useAccount } from "wagmi";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Alert, Button, HatSpinner, Loading, Modal } from "components";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useVaults } from "hooks/vaults/useVaults";
import useModal from "hooks/useModal";
import { PayoutsWelcome } from "./PayoutsWelcome";
import { PayoutCreateModal } from "./PayoutCreateModal";
import { PayoutCard } from "../components";
import * as PayoutsService from "../payoutsService";
import { StyledPayoutsListPage, PayoutListSections, PayoutListSection } from "./styles";
import AddIcon from "@mui/icons-material/AddOutlined";
import { useOnChange } from "hooks/usePrevious";

const DraftStatus = [PayoutStatus.Creating];
const InProgressStatus = [PayoutStatus.Pending, PayoutStatus.ReadyToExecute, PayoutStatus.UnderReview];
const FinishedStatus = [PayoutStatus.Executed, PayoutStatus.Rejected];

export const PayoutsListPage = () => {
  const { t } = useTranslation();

  const { tryAuthentication, isAuthenticated } = useSiweAuth();
  const { address } = useAccount();
  const { allVaults } = useVaults();

  const { isShowing: isShowingCreateModal, show: showCreateModal, hide: hideCreateModal } = useModal();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<"drafts" | "in_progress" | "finished">("in_progress");
  const [userVaults, setUserVaults] = useState<IVault[]>([]);

  const [allPayouts, setAllPayouts] = useState<IPayoutResponse[] | undefined>();
  const [payoutsGroupsByDate, setPayoutsGroupsByDate] = useState<{ date: string; payouts: IPayoutResponse[] }[] | undefined>();

  // Get user vaults
  useEffect(() => {
    const populateVaultsOptions = async () => {
      if (!address || !allVaults || allVaults.length === 0) {
        setAllPayouts(undefined);
        setPayoutsGroupsByDate(undefined);
        setUserVaults([]);
        setSection("in_progress");
        setInitialized(false);
        return;
      }
      const foundVaults = [] as IVault[];

      for (const vault of allVaults) {
        if (!vault.description) continue;

        const userSafes = await getAddressSafes(address, vault.chainId);
        const isSafeMember = userSafes.some((safeAddress) => safeAddress === vault.description?.committee["multisig-address"]);

        if (isSafeMember && vault.version === "v2") foundVaults.push(vault);
      }

      setTimeout(() => setLoading(false), 200);
      setUserVaults(foundVaults);
    };
    populateVaultsOptions();
  }, [address, allVaults]);

  // Get user payouts
  useOnChange(userVaults, async (newVal, prevVal) => {
    if (JSON.stringify(newVal) === JSON.stringify(prevVal)) return;
    if (newVal.length === 0) return;

    const signedIn = await tryAuthentication();
    if (!signedIn) return setAllPayouts([]);

    const payouts = await PayoutsService.getPayoutsListByVault(
      userVaults.map((vault) => ({ chainId: vault.chainId as number, vaultAddress: vault.id }))
    );

    if (!initialized && payouts.some((payout) => DraftStatus.includes(payout.status))) setSection("drafts");
    if (!initialized && payouts.some((payout) => InProgressStatus.includes(payout.status))) setSection("in_progress");

    setAllPayouts(payouts);
    setInitialized(true);
  });

  // Filter payouts by section
  useEffect(() => {
    if (!allPayouts) return setPayoutsGroupsByDate(undefined);
    if (allPayouts && allPayouts?.length === 0) return setPayoutsGroupsByDate([]);

    const payoutsFilteredBySection = allPayouts.filter((payout) => {
      if (section === "drafts") return DraftStatus.includes(payout.status);
      if (section === "in_progress") return InProgressStatus.includes(payout.status);
      return FinishedStatus.includes(payout.status);
    });

    const payoutGroupsByDate = payoutsFilteredBySection.reduce((groups, payout) => {
      const date = moment(payout.createdAt).format("MM/DD/YYYY");
      if (!groups[date]) groups[date] = [];
      groups[date].push(payout);
      return groups;
    }, {});

    const payoutGroupsByDateArray = Object.keys(payoutGroupsByDate).map((date) => {
      return {
        date,
        payouts: payoutGroupsByDate[date],
      };
    });

    // Order array by date
    payoutGroupsByDateArray.sort((a, b) => {
      const dateA = moment(a.date, "MM/DD/YYYY");
      const dateB = moment(b.date, "MM/DD/YYYY");
      return dateB.diff(dateA);
    });

    setPayoutsGroupsByDate(payoutGroupsByDateArray);
  }, [allPayouts, section]);

  const handleCreatePayout = async () => {
    const signedIn = await tryAuthentication();
    if (!signedIn) return;

    showCreateModal();
  };

  if (loading && address && allVaults) return <Loading />;
  if (!address || userVaults.length === 0) return <PayoutsWelcome />;

  return (
    <>
      <StyledPayoutsListPage className="content-wrapper-md">
        <div className="title-container">
          <div className="title">
            <p>{t("payouts")}</p>
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
            {payoutsGroupsByDate ? (
              <>
                {payoutsGroupsByDate.length > 0 ? (
                  payoutsGroupsByDate.map((payoutGroup) => (
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
        newStyles
        overflowVisible
      >
        <PayoutCreateModal closeModal={hideCreateModal} />
      </Modal>
    </>
  );
};
