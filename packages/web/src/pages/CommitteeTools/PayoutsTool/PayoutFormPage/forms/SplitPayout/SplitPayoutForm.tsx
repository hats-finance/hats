import { ISplitPayoutData } from "@hats-finance/shared";
import GenerateIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import DownloadIcon from "@mui/icons-material/SaveAltOutlined";
import { Button, FormInput, FormJSONCSVFileInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import useConfirm from "hooks/useConfirm";
import { useContext, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SplitPayoutAllocation } from "../../../components";
import { PayoutFormContext } from "../../store";
import { StyledPayoutForm } from "../../styles";

type CSVBeneficiary = { beneficiary: string; severity: string; percentageToPay: number | string };

export const SplitPayoutForm = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { vault, isPayoutCreated, severitiesOptions } = useContext(PayoutFormContext);

  const methods = useEnhancedFormContext<ISplitPayoutData>();
  const { register, control, setValue, getValues } = methods;
  const {
    fields: beneficiaries,
    append: appendBeneficiary,
    remove: removeBeneficiary,
  } = useFieldArray({ control, name: `beneficiaries` });

  const [beneficiariesToImport, setBeneficiariesToImport] = useState<CSVBeneficiary[] | undefined>();
  const [csvFileInputKey, setCsvFileInputKey] = useState(1);

  const handleDownloadCsvTemplate = () => {
    if (!severitiesOptions) return;

    const csvString = [
      ["beneficiary", "severity", "percentageToPay"],
      ...severitiesOptions.map((severity, idx) => [
        `0x000000000000000000000000000000000000000${idx}`,
        severity.value.toLowerCase(),
        (100 / severitiesOptions.length).toFixed(2),
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
    const validFormat = beneficiariesOnFile?.every((item) => item.beneficiary && item.severity && item.percentageToPay);

    if (!isArray || !validFormat) return setBeneficiariesToImport([]);
    setBeneficiariesToImport(
      // Group and sum percentageToPay by beneficiary address
      beneficiariesOnFile.reduce((acc, item) => {
        const beneficiary = acc.find((e) => e.beneficiary === item.beneficiary);
        if (beneficiary) {
          beneficiary.percentageToPay = Number(beneficiary.percentageToPay) + Number(item.percentageToPay);
        } else {
          item.percentageToPay = Number(item.percentageToPay);
          acc.push(item);
        }
        return acc;
      }, [] as CSVBeneficiary[])
    );
  };

  const handleImportBeneficiaries = () => {
    if (!beneficiariesToImport || beneficiariesToImport.length === 0 || !severitiesOptions) return;

    // Remove empty beneficiaries
    const idxsToRemove = beneficiaries.reduce((acc, beneficiary, idx) => {
      if (!beneficiary.beneficiary) acc.push(idx);
      return acc;
    }, [] as number[]);
    for (const indexToRemove of idxsToRemove.reverse()) removeBeneficiary(indexToRemove);

    // Append new beneficiaries
    for (const beneficiaryToImport of beneficiariesToImport) {
      const severityFound = severitiesOptions.find((sev) =>
        sev.value.toLowerCase().includes(beneficiaryToImport.severity.toLowerCase())
      );

      appendBeneficiary({
        beneficiary: beneficiaryToImport.beneficiary,
        severity: severityFound ? severityFound.value.toLowerCase() : "",
        percentageOfPayout: Number(beneficiaryToImport.percentageToPay).toString() ?? "",
        nftUrl: "",
      });
    }

    setBeneficiariesToImport(undefined);
    setCsvFileInputKey((prev) => prev + 1);
  };

  const handleGenerateExplanationTemplate = async () => {
    const wantsToGenerate = await confirm({
      title: t("Payouts.generateExplanation"),
      titleIcon: <GenerateIcon className="mr-2" fontSize="large" />,
      description: t("Payouts.generateExplanationDescription"),
      cancelText: t("cancel"),
      confirmText: t("generate"),
    });
    if (!wantsToGenerate) return;

    const beneficiariesToUse = getValues("beneficiaries");

    let explanationString = "";
    for (const [idx, item] of beneficiariesToUse.entries()) {
      const severityFound = severitiesOptions?.find((sev) => sev.value.toLowerCase().includes(item.severity.toLowerCase()));
      const beneficiaryExplanation = `#${idx + 1} Beneficiary: ${item.beneficiary}
Severity: ${severityFound?.label}
Reasoning: Type your explanation here...\n\n`;

      explanationString = explanationString.concat(beneficiaryExplanation);
    }

    setValue("explanation", explanationString);
  };

  return (
    <StyledPayoutForm>
      {!isPayoutCreated && (
        <div className="form-container">
          <p className="subtitle">{t("Payouts.uploadCsv")}</p>
          <p className="mt-3">{t("Payouts.uploadCsvExplanation")}</p>

          <Button className="mt-2" onClick={handleDownloadCsvTemplate} styleType="invisible" disabled={!severitiesOptions}>
            <DownloadIcon className="mr-3" />
            {t("Payouts.downloadTemplateFile")}
          </Button>

          <div className="mt-5 mb-5">
            <FormJSONCSVFileInput
              key={csvFileInputKey}
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
      )}

      <div className="form-container mt-5">
        <p className="subtitle mb-5">{t("Payouts.payoutDetails")}</p>

        <FormInput
          {...register("title")}
          label={t("Payouts.payoutName")}
          placeholder={t("Payouts.payoutNamePlaceholder")}
          disabled={isPayoutCreated}
          colorable
          className="w-60"
        />

        <p className="mt-3 mb-2">
          {t("Payouts.percentageToPayExplanation", { maxBounty: `${Number(vault?.maxBounty) / 100 ?? 100}%` })}
        </p>

        <FormInput
          {...register("percentageToPay")}
          label={t("Payouts.percentageToPay")}
          placeholder={t("Payouts.percentageToPayPlaceholder")}
          helper={t("Payouts.percentageOfTheTotalVaultToPay")}
          disabled={isPayoutCreated}
          type="number"
          colorable
          className="w-40"
        />

        <p className="mt-5">{t("Payouts.editPayoutOfEachBeneficiary")}</p>

        <SplitPayoutAllocation />
      </div>

      <div className="form-container mt-5">
        <p className="subtitle">{t("Payouts.reasoning")}</p>
        <p className="mt-2">{t("Payouts.reasoningDescription")}</p>
        <p className="mt-2 mb-5 reasoningAlert">
          <span>{t("pleaseNote")}:</span> {t("thisInformationWillAppearOnChain")}
        </p>

        {!isPayoutCreated && (
          <Button styleType="invisible" className="mb-3" onClick={handleGenerateExplanationTemplate}>
            <GenerateIcon className="mr-3" />
            {t("Payouts.generateSplitExplanationTemplate")}
          </Button>
        )}

        <FormInput
          {...register("explanation")}
          label={t("Payouts.explanation")}
          placeholder={t("Payouts.explanationPlaceholder")}
          disabled={isPayoutCreated}
          type="textarea"
          rows={(getValues("beneficiaries")?.length ?? 1) * 4.5}
          colorable
        />
      </div>
    </StyledPayoutForm>
  );
};
