import SearchIcon from "assets/icons/search.icon";
import { Loading, Vault } from "components";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { IVault } from "types";
import { SUBMISSION_INIT_DATA, SubmissionFormContext } from "../../store";
import { StyledSubmissionProject } from "./styles";

export function SubmissionProject() {
  const { t } = useTranslation();
  const { submissionData, setSubmissionData, allFormDisabled } = useContext(SubmissionFormContext);
  const [userInput, setUserInput] = useState("");
  const { activeVaults } = useVaults();

  const handleSelectedProject = (vault: IVault) => {
    setSubmissionData((prev) => ({
      ...prev!,
      project: {
        verified: true,
        projectName: vault.description?.["project-metadata"].name!,
        projectId: vault.id,
      },
      submissionsDescriptions: SUBMISSION_INIT_DATA.submissionsDescriptions,
      contact: undefined,
      submissionResult: undefined,
      terms: undefined,
    }));
  };

  const vaultsProjects = activeVaults?.map((vault: IVault, index: number) => {
    const projectName = vault.description?.["project-metadata"].name;
    const isPrivateAudit = vault.description?.["project-metadata"].isPrivateAudit;

    // Don't show the private audit, unless the project is already selected
    if (isPrivateAudit && submissionData?.project?.projectId !== vault.id) return undefined;

    if (
      projectName?.toLowerCase().includes(userInput.toLowerCase()) &&
      !vault.liquidityPool &&
      vault.registered &&
      !vault.destroyed
    ) {
      return (
        <Vault
          key={index}
          vault={vault}
          expanded={false}
          onSelect={!allFormDisabled ? () => handleSelectedProject(vault) : () => {}}
          selected={submissionData?.project?.projectId === vault.id}
        />
      );
    }
    return undefined;
  });

  return (
    <StyledSubmissionProject>
      {!vaultsProjects ? (
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

          {vaultsProjects.every((value: any) => value === undefined) ? (
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
                  {vaultsProjects}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </StyledSubmissionProject>
  );
}
