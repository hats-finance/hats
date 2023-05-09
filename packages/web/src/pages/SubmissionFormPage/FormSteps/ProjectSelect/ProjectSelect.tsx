import SearchIcon from "assets/icons/search.icon";
import { Loading, Vault } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { SubmissionFormContext } from "pages/SubmissionFormPage/store";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { IVault } from "types";
import { StyledProjectSelect } from "./styles";

export default function ProjectSelect() {
  const { t } = useTranslation();
  const { submissionData, setSubmissionData } = useContext(SubmissionFormContext);
  const [userInput, setUserInput] = useState("");
  const { vaults: vaultsData } = useVaults();

  const handleSelectedProject = (vault: IVault) => {
    setSubmissionData((prev) => ({
      ...prev!,
      project: {
        verified: true,
        projectName: vault.description?.["project-metadata"].name!,
        projectId: vault.id,
      },
      description: undefined,
      submission: undefined,
      terms: undefined,
    }));
  };

  const vaults = vaultsData?.map((vault: IVault, index: number) => {
    const projectName = vault.description?.["project-metadata"].name;
    if (projectName?.toLowerCase().includes(userInput.toLowerCase()) && !vault.liquidityPool && vault.registered) {
      return (
        <Vault
          key={index}
          vault={vault}
          expanded={false}
          onSelect={() => handleSelectedProject(vault)}
          selected={submissionData?.project?.projectId === vault.id}
        />
      );
    }
    return undefined;
  });

  return (
    <StyledProjectSelect>
      {!vaults ? (
        <Loading />
      ) : (
        <>
          <div className="search-wrapper">
            <SearchIcon />
            <input
              type="text"
              placeholder={t("Submissions.searchOrSelectProject")}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>

          {vaults.every((value: any) => value === undefined) ? (
            <div className="no-results">{t("Submissions.noProjectsFound")}</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <tbody>
                  <tr className="onlyDesktop">
                    <th></th>
                    <th>{t("projectName")}</th>
                    <th>{t("vaultTotal")}</th>
                  </tr>
                  {vaults}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </StyledProjectSelect>
  );
}
