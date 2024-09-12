import { IVault } from "@hats.finance/shared";

export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getForkedRepoName = (vault: IVault) => {
  const vaultName = vault.description?.["project-metadata"].name;
  if (!vaultName) return "";

  const vaultSlug = vaultName.replace(/[^\w\s]| /gi, "-");
  const forkedRepoName = `${vaultSlug}-${vault.id}`;

  return forkedRepoName;
};
