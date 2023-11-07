import { createNewCoveredContract } from "@hats-finance/shared";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/CheckOutlined";
import GenerateIcon from "@mui/icons-material/DynamicFeedOutlined";
import ErrorIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import { Alert, Button } from "components";
import { useEnhancedFormContext } from "hooks/form/useEnhancedFormContext";
import useConfirm from "hooks/useConfirm";
import { useCallback, useContext, useMemo, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IEditedVaultDescription } from "types";
import { getContractsInfoFromRepos } from "utils/contractsCovered.utils";
import { VaultEditorFormContext } from "../../../store";
import ContractCoveredForm from "./ContractCoveredForm/ContractCoveredForm";

export function ContractsCoveredList() {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const { allFormDisabled } = useContext(VaultEditorFormContext);

  const [generatingContracts, setGeneratingContracts] = useState(false);

  const {
    control,
    formState: { errors },
  } = useEnhancedFormContext<IEditedVaultDescription>();
  const { fields: contracts, append, remove } = useFieldArray({ control, name: "contracts-covered" });

  const reposInfo = useWatch({ control, name: "scope.reposInformation", defaultValue: [] });
  const severitiesOptions = useWatch({ control, name: "severitiesOptions" });
  const severitiesFormIds = useMemo(
    () => (severitiesOptions ? severitiesOptions.map((sev) => sev.value) : []),
    [severitiesOptions]
  );

  const validRepos = reposInfo.length > 0 && !errors.scope?.reposInformation;

  const handleGenerateContractsBaseOnRepos = useCallback(async () => {
    if (!validRepos) return;

    const wantsToGenerateContracts = await confirm({
      title: t("wantsToGenerateContractsBasedOnRepo"),
      description: t("wantsToGenerateContractsBasedOnRepoExplanation"),
      cancelText: t("no"),
      confirmText: t("generateContractsCovered"),
    });
    if (!wantsToGenerateContracts) return;

    setGeneratingContracts(true);
    const { contracts: contractsToCreate } = await getContractsInfoFromRepos(reposInfo);
    append(
      contractsToCreate.map((contract) => ({
        name: "",
        severities: severitiesFormIds,
        link: "",
        address: contract.path,
        linesOfCode: contract.lines,
        deploymentInfo: [],
      }))
    );
    setGeneratingContracts(false);

    await confirm({
      title: contractsToCreate.length > 0 ? t("contractsGenerated") : t("noContractsGenerated"),
      description:
        contractsToCreate.length > 0
          ? t("contractsGeneratedExplanation", { generated: contractsToCreate.length })
          : t("noContractsGeneratedExplanation"),
      titleIcon:
        contractsToCreate.length > 0 ? (
          <CheckIcon className="mr-4" color="success" />
        ) : (
          <ErrorIcon className="mr-4" color="error" />
        ),
      cancelText: t("close"),
      confirmText: t("gotIt"),
    });
    // console.log(a);
  }, [severitiesFormIds, reposInfo, validRepos, append, t, confirm]);

  return (
    <>
      <div className="helper-text" dangerouslySetInnerHTML={{ __html: t("vaultEditorContractsCoveredExplanation") }} />

      {validRepos && (
        <Button className="mb-5" onClick={handleGenerateContractsBaseOnRepos} disabled={generatingContracts}>
          {generatingContracts ? `${t("generatingContractsCovered")}...` : t("generateContractsBasedOnRepo")}
          <GenerateIcon className="ml-3" />
        </Button>
      )}

      {contracts.map((contract, index) => (
        <ContractCoveredForm key={contract.id} index={index} remove={remove} contractsCount={contracts.length} />
      ))}

      {contracts.length === 0 && (
        <Alert type="info" className="mb-4">
          {t("youHaveNotSelectedAnyContracts")}
        </Alert>
      )}

      {!allFormDisabled && (
        <Button className="mt-4" styleType="invisible" onClick={() => append(createNewCoveredContract(severitiesFormIds))}>
          <AddIcon className="mr-1" />
          <span>{t("addContractAsset")}</span>
        </Button>
      )}

      {contracts.length > 0 && (
        <p className="helper-text mt-3">
          {t("totalAmountOfContracts")}: <strong>{contracts.length}</strong>
        </p>
      )}
    </>
  );
}
