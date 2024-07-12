import InfoIcon from "assets/icons/info.icon";
import { FormSelectInput, WithTooltip } from "components";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePointValue } from "./usePointValue";

export const PointValueCard = () => {
  const { t } = useTranslation();

  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const pointValues = usePointValue();
  const dateOptions = useMemo(
    () =>
      Object.keys(pointValues).map((date) => ({
        value: date,
        label: moment(date, "YYYY-MM").format("MMMM YY'"),
      })),
    [pointValues]
  );

  useEffect(() => setSelectedMonth(dateOptions[0]?.value ?? ""), [dateOptions]);

  return (
    <div className="overview-card">
      <div className="pointvalue-month-selector">
        <FormSelectInput
          smallPadding
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e as string)}
          options={dateOptions}
          noSelectedMark
          placeholder="Loading..."
        />
      </div>

      <WithTooltip text={"TODO: Define text"} placement="bottom">
        <div>
          <p className="main-content">{pointValues[selectedMonth]} HAT</p>
          <div className="flex mt-4">
            <p>{t("MyWallet.pointValue")}</p>
            <InfoIcon width={16} height={16} />
          </div>
        </div>
      </WithTooltip>
    </div>
  );
};
