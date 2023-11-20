import { useSubmissions } from "hooks/subgraph/submissions/useSubmissions";
import { useMemo } from "react";

/**
 * Returns all the findings (submissions) executed on the dApp
 */
export const useFindingsFromAddresses = (addresses: string[] = []) => {
  const { allSubmissionsOnEnv } = useSubmissions();
  const addressesToUse = useMemo(() => addresses.map((a) => a.toLowerCase()), [addresses]);

  const validFindings = useMemo(() => {
    if (!allSubmissionsOnEnv) return [];
    const findings = allSubmissionsOnEnv.filter((finding) => finding.submissionData);

    const findingsByAddresses = findings.filter((finding) => {
      if (!finding.submissionData) return false;
      return addressesToUse.includes(finding.submitter.toLowerCase());
    });

    return findingsByAddresses;
  }, [allSubmissionsOnEnv, addressesToUse]);

  validFindings.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  return validFindings;
};
