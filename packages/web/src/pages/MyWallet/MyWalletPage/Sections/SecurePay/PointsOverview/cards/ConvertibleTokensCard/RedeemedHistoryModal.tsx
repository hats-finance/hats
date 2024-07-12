import { BigNumber } from "ethers";
import millify from "millify";
import moment from "moment";
import { DropDataConvertible } from "pages/MyWallet/types";
import { useTranslation } from "react-i18next";
import { Amount } from "utils/amounts.utils";
import { StyledRedeemedHistoryModal } from "../../styles";

interface RedeemedHistoryModalProps {
  redeemedPointdrops: DropDataConvertible[];
  totalRedeemed: { points: number; tokens: BigNumber };
}

export const RedeemedHistoryModal = ({ redeemedPointdrops, totalRedeemed }: RedeemedHistoryModalProps) => {
  const { t } = useTranslation();

  return (
    <StyledRedeemedHistoryModal>
      <div className="logs">
        <div className="log head">
          <div>{t("date")}</div>
          <div>{t("points")}</div>
          <div>{t("MyWallet.tokensHat")}</div>
          <div>{t("MyWallet.pointValue")}</div>
        </div>

        {redeemedPointdrops.map((pointdrop) => {
          const tokens = new Amount(pointdrop.tokens, 18);
          const points = pointdrop.points;

          return (
            <div className="log">
              <div>{moment(pointdrop.startTimeDate).format("MMMM YY'")}</div>
              <div>{points}</div>
              <div>{tokens.formattedWithoutSymbol()}</div>
              <div>{millify(tokens.number / points)}</div>
            </div>
          );
        })}
      </div>
    </StyledRedeemedHistoryModal>
  );
};
