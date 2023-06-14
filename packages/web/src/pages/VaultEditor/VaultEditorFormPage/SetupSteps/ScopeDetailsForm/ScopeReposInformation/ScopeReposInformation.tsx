import { IEditedVaultDescription } from "@hats-finance/shared";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Alert, Button, FormInput } from "components";
import { useEnhancedFormContext } from "hooks/form";
import { useOnChange } from "hooks/usePrevious";
import { useContext, useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { VaultEditorFormContext } from "../../../store";
import { StyledScopeReposInformation } from "./styles";

export const ScopeReposInformation = () => {
  const { t } = useTranslation();
  const { allFormDisabled } = useContext(VaultEditorFormContext);

  const { register, control, setValue } = useEnhancedFormContext<IEditedVaultDescription>();
  const { fields, append: appendRepo, remove: removeRepo } = useFieldArray({ control, name: `scope.reposInformation` });
  const watchFieldArray = useWatch({ control, name: `scope.reposInformation`, defaultValue: [] });
  const repos = useMemo(
    () =>
      fields.map((field, index) => {
        return {
          ...field,
          ...watchFieldArray[index],
        };
      }),
    [watchFieldArray, fields]
  );

  const vaultType = useWatch({ control, name: "project-metadata.type" });

  // Only one repo can be the main repo
  useOnChange(repos, (newRepos, prevRepos) => {
    if (!newRepos || !prevRepos) return;
    if (prevRepos?.length === 0 || newRepos?.length === 0) return;

    // If the length of the repos is the same, check if the main repo has changed
    if (prevRepos?.length === newRepos?.length) {
      const prevMainRepo = prevRepos.find((repo) => repo.isMain);
      if (!prevMainRepo) return;

      const newMainRepo = newRepos.find((repo) => repo.isMain && repo.id !== prevMainRepo?.id);
      const isMainInNewRepos = newRepos.some((repo) => repo.isMain);

      if (!newMainRepo && isMainInNewRepos) return;
      if (!newMainRepo && !isMainInNewRepos) {
        const prevMainRepoIndex = newRepos.findIndex((repo) => repo.id === prevMainRepo.id);
        setValue(`scope.reposInformation.${prevMainRepoIndex}.isMain`, true);
        return;
      }

      const prevMainRepoIndex = newRepos.findIndex((repo) => repo.id === prevMainRepo.id);
      setValue(`scope.reposInformation.${prevMainRepoIndex}.isMain`, false);
    } else {
      // If the length of the repos is different, check if the main repo has been removed
      const isMainInNew = newRepos.some((repo) => repo.isMain);
      if (isMainInNew) return;

      setValue(`scope.reposInformation.${0}.isMain`, true);
    }
  });

  return (
    <StyledScopeReposInformation>
      <div
        className="helper-text"
        dangerouslySetInnerHTML={{
          __html: t(vaultType === "audit" ? "vaultRepoInformationExplanationAudit" : "vaultRepoInformationExplanation"),
        }}
      />

      <div className="repos-information">
        {repos.map((repo, index) => (
          <div className="repo" key={repo.id}>
            {vaultType === "audit" && (
              <div className="toggle">
                <FormInput
                  {...register(`scope.reposInformation.${index}.isMain`)}
                  label={t("mainRepo")}
                  type="toggle"
                  colorable
                  noMargin
                  disabled={allFormDisabled}
                />
              </div>
            )}
            <div className="flex">
              <FormInput
                {...register(`scope.reposInformation.${index}.url`)}
                label={t("VaultEditor.vault-details.repoUrl")}
                colorable
                helper="ie. https://github.com/hats-finance/hats-contracts"
                disabled={allFormDisabled}
                placeholder={t("VaultEditor.vault-details.repoUrl-placeholder")}
              />
              {vaultType === "audit" && (
                <FormInput
                  {...register(`scope.reposInformation.${index}.commitHash`)}
                  label={t("VaultEditor.vault-details.commitHash")}
                  colorable
                  helper="ie. 9770535cb9.....b63c081cbc"
                  disabled={allFormDisabled}
                  placeholder={t("VaultEditor.vault-details.commitHash-placeholder")}
                />
              )}
              {!allFormDisabled && (
                <Button styleType="invisible" textColor="secondary" onClick={() => removeRepo(index)}>
                  <DeleteIcon className="mr-2" />
                  <span>{t("remove")}</span>
                </Button>
              )}
            </div>
          </div>
        ))}

        {repos.length === 0 && <Alert type="info">{t("youHaveNotSelectedRepos")}</Alert>}

        {!allFormDisabled && (
          <div className="buttons">
            <Button
              styleType="invisible"
              onClick={() => appendRepo({ commitHash: "", url: "", isMain: !repos.some((r) => r.isMain) })}
            >
              <AddIcon className="mr-2" />
              <span>{t("newRepo")}</span>
            </Button>
          </div>
        )}
      </div>
    </StyledScopeReposInformation>
  );
};
