import CheckIcon from "@mui/icons-material/CheckOutlined";
import CancelIcon from "@mui/icons-material/ClearOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import ArrowUpIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import HatsTokenIcon from "assets/icons/hats-logo-circle.svg";
import { CopyToClipboard, Pill, WithTooltip } from "components";
import { BigNumber } from "ethers";
import moment from "moment";
import { DropData } from "pages/Airdrops/types";
import { AirdropEligibility, getAirdropEligibility } from "pages/Airdrops/utils/getAirdropEligibility";
import { AirdropRedeemData, getAirdropRedeemedData } from "pages/Airdrops/utils/getAirdropRedeemedData";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { shortenIfAddress } from "utils/addresses.utils";
import { Amount } from "utils/amounts.utils";
import { LinearReleaseAirdropControls } from "./LinearReleaseAirdropControls/LinearReleaseAirdropControls";
import { StyledAidropCard, StyledEligibilityBreakdown } from "./styles";

type AirdropCardProps = {
  airdropData: DropData;
  addressToCheck: string;
  onOpenClaimModal: () => void;
  onOpenDelegateModal: () => void;
};

export const AirdropCard = ({ airdropData, addressToCheck, onOpenClaimModal, onOpenDelegateModal }: AirdropCardProps) => {
  const { t } = useTranslation();
  const [eligibilityData, setEligibilityData] = useState<AirdropEligibility | undefined>();
  const [redeemedData, setRedeemedData] = useState<AirdropRedeemData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showEligibilityCriteria, setShowEligibilityCriteria] = useState<boolean>(true);

  const updateEligibility = useCallback(async () => {
    setIsLoading((prev) => prev === undefined);
    const [eligibility, redeemded] = await Promise.all([
      getAirdropEligibility(addressToCheck, airdropData.descriptionData),
      getAirdropRedeemedData(addressToCheck, airdropData),
    ]);
    setEligibilityData(eligibility);
    setRedeemedData(redeemded);
    setIsLoading(false);
  }, [addressToCheck, airdropData]);

  useEffect(() => {
    updateEligibility();
  }, [addressToCheck, airdropData, updateEligibility]);

  const isLive = airdropData && airdropData?.isLive;

  const getStatusInfo = () => {
    if (isLive) {
      return {
        isExpired: false,
        text: eligibilityData?.eligible ? (redeemedData ? t("Airdrop.redeemed") : t("Airdrop.congrats")) : t("Airdrop.sorry"),
        description: eligibilityData?.eligible ? t("Airdrop.congratsContent") : t("Airdrop.sorryContent"),
        pills: (
          <>
            <Pill transparent text={t("Airdrop.live")} />
            {airdropData && airdropData.isLocked && (
              <Pill
                transparent
                text={t("Airdrop.linearReleaseUntil", { date: moment(airdropData.lockEndDate).format("MMM Do YY'") })}
              />
            )}
          </>
        ),
      };
    } else {
      return {
        isExpired: eligibilityData?.eligible && !redeemedData,
        text: eligibilityData?.eligible
          ? redeemedData
            ? t("Airdrop.redeemed")
            : `${t("Airdrop.expired")}!`
          : t("Airdrop.sorry"),
        description: eligibilityData?.eligible
          ? redeemedData
            ? t("Airdrop.congratsContent")
            : t("Airdrop.lostAirdropContent", { date: moment(airdropData.deadlineDate).format("MMM Do YY'") })
          : t("Airdrop.sorryContent"),
        pills: (
          <>
            {airdropData && airdropData.isLocked && (
              <Pill
                transparent
                text={t("Airdrop.linearReleaseUntil", { date: moment(airdropData.lockEndDate).format("MMM Do YY'") })}
              />
            )}
          </>
        ),
      };
    }
  };

  return (
    <StyledAidropCard>
      <div className="preview">
        <div className="section">
          <div className="info">
            <div className="header-container">
              <div className="title-container">
                <div className="name">
                  <p>{airdropData.descriptionData.name}</p>
                  <div className="address">
                    {shortenIfAddress(airdropData.address)}
                    <CopyToClipboard
                      valueToCopy={airdropData.address}
                      overlayText={t("copyAddress")}
                      simple
                      tooltipPlacement="right"
                    />
                  </div>
                </div>
                <div className="network">
                  {t("network")}:
                  <img className="chain" src={require(`assets/icons/chains/${airdropData.chainId}.png`)} alt="network" />
                  {appChains[airdropData.chainId].chain.name}
                </div>
              </div>
              <div className="pills">{getStatusInfo().pills}</div>
            </div>
            <p className="blurb mt-4">{airdropData.descriptionData.description}</p>
          </div>

          <div className="status-amount">
            {isLoading ? (
              <p>{`${t("Airdrop.loadingAirdropData")}...`}</p>
            ) : (
              <div>
                <h2 className={`${getStatusInfo().isExpired ? "red" : ""}`}>{getStatusInfo().text}</h2>
                <p>{getStatusInfo().description}</p>
              </div>
            )}
            {!isLoading && eligibilityData?.eligible && (
              <div className="amount">
                <img src={HatsTokenIcon} alt="$HAT token" width={40} height={40} className="mt-1" />
                <p>{new Amount(BigNumber.from(eligibilityData.total), 18, "$HAT").formatted()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Linearly released airdrop controls */}
        {!isLoading && redeemedData && airdropData.isLocked && redeemedData.tokenLock && (
          <LinearReleaseAirdropControls
            chainId={airdropData.chainId}
            tokenLockAddress={redeemedData.tokenLock.address}
            addressToCheck={addressToCheck}
          />
        )}
      </div>

      {!isLoading && eligibilityData?.eligible && (
        <StyledEligibilityBreakdown>
          <div className="title" onClick={() => setShowEligibilityCriteria((prev) => !prev)}>
            {showEligibilityCriteria ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {t("Airdrop.eligibilityCriteriaBreakdown")}
          </div>
          {showEligibilityCriteria && (
            <div className="eligibility-breakdown">
              <div className="breakdown">
                {Object.keys(eligibilityData)
                  .filter((k) => !["info", "total", "eligible"].includes(k))
                  .map((k) => {
                    const eligible = BigNumber.from(eligibilityData[k]).gt(0);
                    return (
                      <div className={`breakdown-item ${eligible ? "eligible" : ""}`} key={k}>
                        <WithTooltip text={t(`Airdrop.${k}_desc`)}>
                          <div className="left">
                            <span className="check mr-1">{eligible ? <CheckIcon /> : <CancelIcon />}</span>
                            <span className="name">{t(`Airdrop.${k}`)}</span>
                            <InfoIcon className="icon" fontSize="inherit" />
                          </div>
                        </WithTooltip>
                        <span className="amount">{new Amount(BigNumber.from(eligibilityData[k]), 18, "$HAT").formatted()}</span>
                      </div>
                    );
                  })}
              </div>
              <div className="total">
                <span>{t("total")}</span>
                <span>{new Amount(BigNumber.from(eligibilityData.total), 18, "$HAT").formatted()}</span>
              </div>
            </div>
          )}
        </StyledEligibilityBreakdown>
      )}
    </StyledAidropCard>
  );
};
