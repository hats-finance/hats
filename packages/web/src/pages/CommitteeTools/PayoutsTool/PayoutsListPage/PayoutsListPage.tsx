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

export const PayoutsListPage = () => {
  const { t } = useTranslation();

  const { tryAuthentication, isAuthenticated } = useSiweAuth();
  const { address } = useAccount();
  const { allVaults } = useVaults();

  const { isShowing: isShowingCreateModal, show: showCreateModal, hide: hideCreateModal } = useModal();
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<"in_progress" | "finished">("in_progress");
  const [userVaults, setUserVaults] = useState<IVault[]>([]);

  const [allPayouts, setAllPayouts] = useState<IPayoutResponse[] | undefined>();
  const [payoutsGroupsByDate, setPayoutsGroupsByDate] = useState<{ date: string; payouts: IPayoutResponse[] }[] | undefined>();

  // Get user vaults
  useEffect(() => {
    const populateVaultsOptions = async () => {
      if (!address || !allVaults || allVaults.length === 0) return setUserVaults([]);
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
    setAllPayouts(payouts);
  });

  // Filter payouts by section
  useEffect(() => {
    if (!allPayouts) return setPayoutsGroupsByDate(undefined);
    if (allPayouts && allPayouts?.length === 0) return setPayoutsGroupsByDate([]);

    const payoutsFilteredBySection = allPayouts.filter((payout) => {
      if (section === "in_progress") return payout.status !== PayoutStatus.Executed;
      return payout.status === PayoutStatus.Executed;
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
                    {section === "in_progress" ? (
                      <>
                        <Alert type="info">{t("Payouts.noPayoutsInProgress")}</Alert>
                        <Button onClick={handleCreatePayout} className="mt-4">
                          <AddIcon className="mr-2" />
                          {t("Payouts.createPayout")}
                        </Button>
                      </>
                    ) : (
                      <Alert type="info">{t("Payouts.noPayoutsHistory")}</Alert>
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
