import { useEffect, useState } from "react";
import { getAddressSafes, IPayoutResponse, IVault, PayoutStatus } from "@hats-finance/shared";
import { useAccount } from "wagmi";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Loading } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { PayoutsWelcome } from "./PayoutsWelcome";
import { PayoutCard } from "../components";
import * as PayoutsService from "../payoutsService";
import { StyledPayoutsListPage, PayoutListSections, PayoutListSection } from "./styles";

export const PayoutsListPage = () => {
  const { t } = useTranslation();

  const { address } = useAccount();
  const { allVaults } = useVaults();

  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<"in_progress" | "finished">("in_progress");
  const [userVaults, setUserVaults] = useState<IVault[]>([]);

  const [allPayouts, setAllPayouts] = useState<IPayoutResponse[]>([]);
  const [payoutsGroupsByDate, setPayoutsGroupsByDate] = useState<{ date: string; payouts: IPayoutResponse[] }[]>([]);

  // Get user vaults
  useEffect(() => {
    const populateVaultsOptions = async () => {
      if (!address || !allVaults || allVaults.length === 0) return setUserVaults([]);
      const foundVaults = [] as IVault[];

      for (const vault of allVaults) {
        if (!vault.description) continue;

        const userSafes = await getAddressSafes(address, vault.chainId);
        const isSafeMember = userSafes.some((safeAddress) => safeAddress === vault.description?.committee["multisig-address"]);
        const isMultisigAddress = vault.description?.committee["multisig-address"] === address;

        if ((isSafeMember || isMultisigAddress) && vault.version === "v2") foundVaults.push(vault);
      }

      setTimeout(() => setLoading(false), 200);
      setUserVaults(foundVaults);
    };
    populateVaultsOptions();
  }, [address, allVaults]);

  // Get user payouts
  useEffect(() => {
    const loadData = async () => {
      if (userVaults.length === 0) return;

      const payouts = await PayoutsService.getPayoutsListByVault(
        userVaults.map((vault) => ({ chainId: vault.chainId as number, vaultAddress: vault.id }))
      );
      setAllPayouts(payouts);
    };
    loadData();
  }, [userVaults]);

  // Filter payouts by section
  useEffect(() => {
    if (allPayouts.length === 0) return setPayoutsGroupsByDate([]);

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

    console.log(payoutGroupsByDateArray);
    setPayoutsGroupsByDate(payoutGroupsByDateArray);
  }, [allPayouts, section]);

  if (loading && address && allVaults) return <Loading />;
  if (!address || userVaults.length === 0) return <PayoutsWelcome />;

  return (
    <StyledPayoutsListPage className="content-wrapper-md">
      <div className="title-container">
        <div className="title">
          <p>{t("payouts")}</p>
        </div>
      </div>

      <PayoutListSections>
        <PayoutListSection active={section === "in_progress"} onClick={() => setSection("in_progress")}>
          {t("inProgress")}
        </PayoutListSection>
        <PayoutListSection active={section === "finished"} onClick={() => setSection("finished")}>
          {t("history")}
        </PayoutListSection>
      </PayoutListSections>

      {payoutsGroupsByDate.map((payoutGroup) => (
        <div className="group" key={payoutGroup.date}>
          <p className="group-date">{moment(payoutGroup.date, "MM/DD/YYYY").format("MMM DD, YYYY")}</p>
          {payoutGroup.payouts.map((payout) => (
            <PayoutCard key={payout._id} payout={payout} />
          ))}
        </div>
      ))}
    </StyledPayoutsListPage>
  );
};
