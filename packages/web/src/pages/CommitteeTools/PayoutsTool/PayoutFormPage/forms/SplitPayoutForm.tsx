import DownloadIcon from "@mui/icons-material/SaveAltOutlined";
import { Button, FormJSONCSVFileInput } from "components";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { PayoutFormContext } from "../store";
import { StyledPayoutForm } from "../styles";

export const SplitPayoutForm = () => {
  const { t } = useTranslation();
  const { vault, payout, isPayoutCreated, severitiesOptions } = useContext(PayoutFormContext);

  return (
    <StyledPayoutForm>
      <div className="form-container">
        <p className="subtitle">{t("Payouts.uploadCsv")}</p>
        <p className="mt-3">{t("Payouts.uploadCsvExplanation")}</p>

        <Button className="mt-4" onClick={() => {}} styleType="invisible" noPadding>
          <DownloadIcon className="mr-3" />
          {t("Payouts.downloadTemplateFile")}
        </Button>

        <FormJSONCSVFileInput onChange={(e) => console.log(e)} />
      </div>
    </StyledPayoutForm>
  );
};
