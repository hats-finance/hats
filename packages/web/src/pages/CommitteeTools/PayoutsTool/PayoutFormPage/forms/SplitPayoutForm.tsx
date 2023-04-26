import DownloadIcon from "@mui/icons-material/SaveAltOutlined";
import { Button, FormJSONCSVFileInput } from "components";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { PayoutFormContext } from "../store";
import { StyledPayoutForm } from "../styles";

type CSVBeneficiary = { beneficiary: string; severity: string };

export const SplitPayoutForm = () => {
  const { t } = useTranslation();
  const { vault, payout, isPayoutCreated, severitiesOptions } = useContext(PayoutFormContext);

  const [beneficiariesToImport, setBeneficiariesToImport] = useState<CSVBeneficiary[] | undefined>();

  const handleDownloadCsvTemplate = () => {
    if (!severitiesOptions) return;

    const csvString = [
      ["beneficiary", "severity"],
      ...severitiesOptions.map((severity, idx) => [
        `0x000000000000000000000000000000000000000${idx}`,
        severity.value.toLowerCase(),
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "hats-beneficiaries-template.csv");
    a.click();
  };

  const handleChangeCsvFile = (csvString: string) => {
    const beneficiariesOnFile = JSON.parse(csvString) as CSVBeneficiary[] | undefined;

    const isArray = Array.isArray(beneficiariesOnFile) && beneficiariesOnFile.length > 0;
    const validFormat = beneficiariesOnFile?.every((item) => item.beneficiary && item.severity);

    if (!isArray || !validFormat) return setBeneficiariesToImport([]);
    setBeneficiariesToImport(
      // Remove duplicates by beneficiary address
      beneficiariesOnFile.filter((item, index, self) => index === self.findIndex((t) => t.beneficiary === item.beneficiary))
    );
  };

  const handleImportBeneficiaries = () => {
    if (!beneficiariesToImport || beneficiariesToImport.length === 0) return;

    console.log(beneficiariesToImport);
  };

  return (
    <StyledPayoutForm>
      <div className="form-container">
        <p className="subtitle">{t("Payouts.uploadCsv")}</p>
        <p className="mt-3">{t("Payouts.uploadCsvExplanation")}</p>

        <Button className="mt-2" onClick={handleDownloadCsvTemplate} styleType="invisible" disabled={!severitiesOptions}>
          <DownloadIcon className="mr-3" />
          {t("Payouts.downloadTemplateFile")}
        </Button>

        <div className="mt-5 mb-5">
          <FormJSONCSVFileInput
            small
            name="split-payout-csv"
            fileType="CSV"
            label={t("Payouts.selectCsvFile")}
            onChange={(e) => handleChangeCsvFile(e.target.value)}
          />
          {beneficiariesToImport && beneficiariesToImport.length > 0 && (
            <p
              className="mt-3"
              dangerouslySetInnerHTML={{
                __html: t("Payouts.fileContainsNumBeneficiaries", { numBeneficiaries: beneficiariesToImport.length }),
              }}
            />
          )}
          {beneficiariesToImport && beneficiariesToImport.length === 0 && (
            <p className="mt-2 error">{t("Payouts.csvDoesNotHaveAnyBeneficiary")}</p>
          )}
        </div>

        <div className="buttons no-line">
          <Button onClick={handleImportBeneficiaries} disabled={!beneficiariesToImport || beneficiariesToImport.length === 0}>
            {t("Payouts.importBeneficiaries")}
          </Button>
        </div>
      </div>
    </StyledPayoutForm>
  );
};
