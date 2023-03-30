import { IPayoutResponse } from "@hats-finance/shared";
import { useTranslation } from "react-i18next";
import { StyledPayoutCard } from "./styles";

type PayoutCardProps = {
  payout: IPayoutResponse;
};

export const PayoutCard = ({ payout }: PayoutCardProps) => {
  const { t } = useTranslation();

  return <StyledPayoutCard>PayoutCard</StyledPayoutCard>;
};
