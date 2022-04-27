import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EditableContent from "components/CommitteeTools/components/EditableContent/EditableContent";
import Select from "components/Shared/Select/Select";
import PgpKey from "components/VaultEditor/PgpKey";
import { VaultProvider } from "components/CommitteeTools/store";
import { setPath } from "components/VaultEditor/objectUtils";
import { RootState } from "reducers";
import { IVault } from "types/types";
import { createPendingApprovalClaim } from "actions/contractsActions";

import "./BountyPayout.scss";

export interface IClaimToSubmit {
  pid: string;
  beneficiary: string;
  severity: number;
}

export default function BountyPayout() {
  const { t } = useTranslation();
  const { descriptionHash } = useParams()
  const [ipfsDate, setIpfsDate] = useState<Date | undefined>(new Date());
  const [selectedVault, setSelectedVault] = useState<IVault>({} as IVault);
  const [claimToSubmit, setClaimToSubmit] = useState({
    pid: "",
    beneficiary: "",
    severity: 0
  } as IClaimToSubmit);
  const vaultsData = useSelector(
    (state: RootState) => state.dataReducer.vaults
  );

  useEffect(() => {
    if (vaultsData.length) {
      // Need to make the UI to select Vault - Reusable
      setSelectedVault(vaultsData[0]);
      // Will select the vault from this UI and set its id to claimToSubmit
      setClaimToSubmit((prev) => {
        let newObject = { ...prev };
        setPath(newObject, "pid", vaultsData[0].id);
        setPath(
          newObject,
          "severity",
          vaultsData[0].description?.severities[0]?.index
        );
        return newObject;
      });
    }
  }, [vaultsData]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setClaimToSubmit((prev) => {
      let newObject = { ...prev };
      setPath(newObject, e.target.name, e.target.value);
      return newObject;
    });
  };

  const clearClaimToSubmit = () => {
    setClaimToSubmit({
      pid: selectedVault?.id || "",
      beneficiary: "",
      severity: selectedVault?.description?.severities[0]?.index
    });
  };

  const createPayoutTransaction = () => {
    createPendingApprovalClaim(
      selectedVault.parentVault.master.address,
      claimToSubmit.pid,
      claimToSubmit.beneficiary,
      claimToSubmit.severity
    );
  };

  return (
    <div className="content bounty-payout">
      {/* Title and Description */}
      <div className="bounty-payout__title">{t("BountyPayout.create")}</div>
      <p className="bounty-payout__description">
        {t("BountyPayout.pgp-not-recognized")}
      </p>

      {/* Communication Channel */}
      <section className="bounty-payout__section">
        <label>{t("BountyPayout.signed-pgp")}</label>
        <div className="pgp-key">
          <VaultProvider>
            <PgpKey onSelected={() => {}}></PgpKey>
            <label>{t("BountyPayout.decrypted-message")}</label>
            <EditableContent
              name="communication-channel.pgp-pk"
              pastable
              onChange={() => {}}
            />
          </VaultProvider>
        </div>
      </section>

      {/* Payout Details */}
      <section className="bounty-payout__section">
        <div className="payout-details">
          <div className="payout-details__header">
            <p className="bounty-payout__section-title">
              {t("BountyPayout.payout-details")}
            </p>
          </div>
          <div className="payout-details__actions">
            {ipfsDate && (
              <div className="payout-details__last-saved-time">
                {`${t("BountyPayout.last-saved-time")} `}
                {ipfsDate.toLocaleString()}
                {`(${t("BountyPayout.local-time")})`}
              </div>
            )}
            {!ipfsDate && <div>&nbsp;</div>}
            <div className="payout-details__buttons">
              <button className="fill">{t("BountyPayout.revert")}</button>
              <button className="fill">{t("BountyPayout.new")}</button>
            </div>
          </div>
          <div className="payout-details__content">
            <div className="payout-details__address">
              <label>{t("BountyPayout.add-wallet-address")}</label>
              <EditableContent
                textInput
                pastable
                name="beneficiary"
                value={claimToSubmit.beneficiary}
                onChange={onChange}
                placeholder={t("BountyPayout.wallet-address")}
              />
            </div>
            <div className="payout-details__severity">
              <label>{t("BountyPayout.severity")}</label>
              <Select
                name="severity"
                value={claimToSubmit.severity}
                onChange={onChange}
                options={(selectedVault?.description?.severities || []).map(
                  (severity) => ({
                    label: severity.name,
                    value: severity.index
                  })
                )}
              />
            </div>
            <div className="payout-details__severity-desc">
              <label>{t("BountyPayout.severity-description")}</label>
              <p>{t("BountyPayout.severity-description-content")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payout */}
      <section className="bounty-payout__section">
        <div className="payout">
          <p className="bounty-payout__section-title">
            {t("BountyPayout.payout")}
          </p>
          <div className="payout__content">
            <label>{t("BountyPayout.payout")}</label>
            <div className="payout__severity">
              <p className="payout__severity-title">High severity</p>
              <p className="payout__severity-value">300,000 USDC</p>
            </div>
            <div className="payout__severity-desc">
              {t("BountyPayout.payout-severity-desc")}
            </div>
          </div>
        </div>
      </section>

      <div className="bounty-payout__actions">
        <button onClick={clearClaimToSubmit}>{t("BountyPayout.clear")}</button>
        <button
          disabled={
            !(
              claimToSubmit.pid &&
              claimToSubmit.beneficiary &&
              claimToSubmit.severity > -1
            )
          }
          className="fill"
          onClick={createPayoutTransaction}
        >
          {t("BountyPayout.create-payout-transaciton")}
        </button>
      </div>

      {/* Signees */}
      <section className="bounty-payout__section">
        <div className="signees">
          <p className="bounty-payout__section-title">
            {t("BountyPayout.signees")}
          </p>
          <div className="signees__content">
            <div className="signees__title">
              {t("BountyPayout.approved-signees")} 1/2
            </div>
            <div className="signees__signee">
              <div className="signees__signee-number">1</div>
              <div className="signees__signee-content">
                2345fhgf345678909087654kjghfdssdfg
              </div>
            </div>
            <div className="signees__title">
              {t("BountyPayout.pending-signees")} 1/2
            </div>
            <div className="signees__signee">
              <div className="signees__signee-number">1</div>
              <div className="signees__signee-content">
                2345fhgf345678909087654kjghfdssdfg
              </div>
            </div>
          </div>
          <div className="signees__desc">{t("BountyPayout.signees-desc")}</div>
        </div>
      </section>
    </div>
  );
}
