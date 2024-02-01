import { IEditedSessionResponse } from "@hats.finance/shared";
import { axiosClient } from "config/axiosClient";
import { getVaultDateStatus } from "hooks/subgraph/vaults/useVaults";
import { BASE_SERVICE_URL } from "settings";

/**
 * Get all the audit drafts available (only returns upcoming ones)
 */
export async function getUpcomingAuditDrafts() {
  try {
    const response = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/all/audit-drafts`);
    const editSessions = response.data as IEditedSessionResponse[];

    const editSessionsWithDateStatus = editSessions.map((editSession) => {
      const startTime = editSession.editedDescription["project-metadata"].starttime;
      const endTime = editSession.editedDescription["project-metadata"].endtime;

      return {
        ...editSession,
        dateStatus: getVaultDateStatus(startTime, endTime),
        chainId: +(editSession.editedDescription?.committee.chainId ?? 5),
      };
    });

    return editSessionsWithDateStatus.filter((editSession) => editSession.dateStatus === "upcoming");
  } catch (error) {
    return [];
  }
}
