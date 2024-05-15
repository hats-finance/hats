import { AirdropConfig } from "@hats.finance/shared";
import HatsTokenIcon from "assets/icons/hats-logo-circle.svg";
import { NextArrowIcon } from "assets/icons/next-arrow";
import { Button, HatSpinner, Pill } from "components";
import { BigNumber } from "ethers";
import moment from "moment";
import { AirdropElegibility, getAirdropElegibility } from "pages/Airdrops/utils/getAirdropElegibility";
import { AirdropRedeemData, getAirdropRedeemedData } from "pages/Airdrops/utils/getAirdropRedeemedData";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { shortenIfAddress } from "utils/addresses.utils";
import { Amount } from "utils/amounts.utils";
import { StyledAidropCard, StyledElegibilityBreakdown } from "./styles";

type AirdropCardProps = {
  airdrop: AirdropConfig;
  addressToCheck: string;
  idx: number;
  onOpenClaimModal: () => void;
  onOpenDelegateModal: () => void;
  showFilter: "live" | "past" | "all";
};

export const AirdropCard = ({
  airdrop,
  addressToCheck,
  onOpenClaimModal,
  onOpenDelegateModal,
  idx,
  showFilter = "live",
}: AirdropCardProps) => {
  const { t } = useTranslation();
  const [elegibilityData, setElegibilityData] = useState<AirdropElegibility | undefined>();
  const [redeemedData, setRedeemedData] = useState<AirdropRedeemData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateElegibility = useCallback(async () => {
    setIsLoading(true);
    const airdropData = { address: airdrop.address, chainId: airdrop.chain.id };
    const [elegibility, redeemded] = await Promise.all([
      getAirdropElegibility(addressToCheck, airdropData),
      getAirdropRedeemedData(addressToCheck, airdropData),
    ]);
    setElegibilityData(elegibility);
    setRedeemedData(redeemded);
    setIsLoading(false);
  }, [addressToCheck, airdrop]);

  useEffect(() => {
    updateElegibility();
  }, [addressToCheck, airdrop, updateElegibility]);

  if (isLoading) {
    if (idx === 0)
      return (
        <div className="mb-4">
          <HatSpinner text={`${t("Airdrop.loadingAirdrops")}...`} />
        </div>
      );
    return null;
  }

  if (showFilter === "live" && elegibilityData && !elegibilityData?.info?.isLive) return null;
  if (showFilter === "past" && elegibilityData && elegibilityData?.info?.isLive) return null;

  const isLive = elegibilityData && elegibilityData?.info?.isLive;

  const getStatusInfo = () => {
    if (!elegibilityData) return { pills: undefined };

    if (isLive) {
      return {
        text: elegibilityData?.eligible ? (redeemedData ? t("Airdrop.redeemed") : t("Airdrop.congrats")) : t("Airdrop.sorry"),
        description: elegibilityData?.eligible ? t("Airdrop.congratsContent") : t("Airdrop.sorryContent"),
        pills: (
          <>
            {elegibilityData && elegibilityData.info.isLocked && <Pill text={t("Airdrop.linearRelease")} />}
            <Pill text={t("Airdrop.live")} />
          </>
        ),
      };
    } else {
      return {
        text: elegibilityData?.eligible ? (redeemedData ? t("Airdrop.redeemed") : t("Airdrop.lostAirdrop")) : t("Airdrop.sorry"),
        description: elegibilityData?.eligible
          ? redeemedData
            ? t("Airdrop.congratsContent")
            : t("Airdrop.lostAirdropContent")
          : t("Airdrop.sorryContent"),
        pills: (
          <Pill
            dotColor="red"
            textColor="var(--error-red)"
            text={`${t("Airdrop.past")} - ${moment(elegibilityData.info.deadlineDate).fromNow()}`}
          />
        ),
      };
    }
  };

  return (
    <StyledAidropCard>
      <div className="preview">
        <div className="info">
          <p className="name">
            Airdrop #{idx + 1} {shortenIfAddress(airdrop.address)} {getStatusInfo().pills}
          </p>

          {isLoading ? (
            <p>{`${t("Airdrop.loadingAirdropData")}...`}</p>
          ) : (
            <>
              <h2 className="mt-3">{getStatusInfo().text}</h2>
              <p>{getStatusInfo().description}</p>
            </>
          )}
        </div>
        {!isLoading && elegibilityData?.eligible && (
          <div className="amount">
            <img src={HatsTokenIcon} alt="$HAT token" width={40} height={40} className="mt-1" />
            <p>{new Amount(BigNumber.from(elegibilityData.total), 18, "$HAT").formatted()}</p>
          </div>
        )}
      </div>

      {!isLoading && elegibilityData?.eligible && (
        <StyledElegibilityBreakdown>
          <div className="title">{t("Airdrop.elegibilityCriteriaBreakdown")}</div>
          <div className="elegibility-breakdown">
            <div className="breakdown">
              {Object.keys(elegibilityData)
                .filter((k) => !["info", "total", "eligible"].includes(k))
                .map((k) => {
                  const eligible = BigNumber.from(elegibilityData[k]).gt(0);
                  return (
                    <div className={`breakdown-item ${eligible ? "eligible" : ""}`} key={k}>
                      <div className="left">
                        <span className="check">{eligible ? "✓" : "✗"}</span>
                        <span className="name">{t(`Airdrop.${k}`)}</span>
                      </div>
                      <span className="amount">{new Amount(BigNumber.from(elegibilityData[k]), 18, "$HAT").formatted()}</span>
                    </div>
                  );
                })}
            </div>
            <div className="total">
              <span>{t("total")}</span>
              <span>{new Amount(BigNumber.from(elegibilityData.total), 18, "$HAT").formatted()}</span>
            </div>
          </div>
        </StyledElegibilityBreakdown>
      )}

      {!isLoading && (
        <div className="buttons">
          {isLive && elegibilityData?.eligible && (
            <Button styleType={redeemedData ? "outlined" : "filled"} onClick={onOpenClaimModal}>
              {redeemedData ? (
                t("Airdrop.redeemed")
              ) : (
                <>
                  {t("Airdrop.startClaim")} <NextArrowIcon className="ml-1 " />
                </>
              )}
            </Button>
          )}

          {/* {redeemedData && (
            <Button onClick={onOpenDelegateModal}>
              {redeemedData?.delegator ? t("Airdrop.redelegate") : t("Airdrop.delegate")}
            </Button>
          )} */}
        </div>
      )}

      {/* <h4>{airdrop.address}</h4>
      <p>{airdrop.chain.name}</p>
      {isLoading ? (
        <>Loading...</>
      ) : (
        <>
          {elegibilityData ? (
            <p>Elegible [{new Amount(BigNumber.from(elegibilityData.total), 18, "$HAT").formatted()}]</p>
          ) : (
            <p>Not elegible</p>
          )}
          {redeemedData && <p>Redeemed. Votes: {new Amount(redeemedData.currentVotes, 18).formatted()}</p>}
          {redeemedData?.tokenLock && <p>Token Lock: {redeemedData.tokenLock.address}</p>}
          {redeemedData?.delegator && (
            <p>
              Delegator: {redeemedData.delegator.delegatee} [{new Amount(redeemedData.delegator.votes, 18).formatted()} votes]
            </p>
          )}

          {elegibilityData && (
            <Button size="small" styleType={redeemedData ? "outlined" : "filled"} onClick={onOpenClaimModal}>
              {redeemedData ? "Claimed" : "Claim airdrop"}
            </Button>
          )}

          {redeemedData && (
            <Button size="small" onClick={onOpenDelegateModal}>
              {redeemedData?.delegator ? "Re-delegate" : "Delegate"}
            </Button>
          )}
        </>
      )} */}
    </StyledAidropCard>
  );
};
