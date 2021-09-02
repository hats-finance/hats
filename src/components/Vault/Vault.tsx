import { useState, useEffect } from "react";
import "../../styles/Vault/Vault.scss";
import { IPoolWithdrawRequest, IVault, IVaultDescription } from "../../types/types";
import { useSelector } from "react-redux";
import millify from "millify";
import { fromWei, isProviderAndNetwork, parseJSONToObject } from "../../utils";
import ArrowIcon from "../../assets/icons/arrow.icon";
import { RootState } from "../../reducers";
import { Colors } from "../../constants/constants";
import moment from "moment";
import WithdrawCountdown from "../WithdrawCountdown";
import VaultExpanded from "./VaultExpanded";

interface IProps {
  data: IVault,
  setShowModal: (show: boolean) => any,
  setModalData: (data: any) => any
}

export default function Vault(props: IProps) {
  const [toggleRow, setToggleRow] = useState(false);
  const provider = useSelector((state: RootState) => state.web3Reducer.provider);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const { name, isGuest, bounty, id } = props.data;
  const tokenPrice = useSelector((state: RootState) => state.dataReducer.vaults.filter((vault: IVault) => vault.id === id)[0].parentVault.tokenPrice);
  const apy = useSelector((state: RootState) => state.dataReducer.vaults.filter((vault: IVault) => vault.id === id)[0].parentVault.apy);
  const { totalRewardAmount, honeyPotBalance, withdrawRequests, stakingTokenDecimals } = props.data.parentVault;
  const [vaultAPY, setVaultAPY] = useState("-");
  const [isWithdrawable, setIsWithdrawable] = useState(false);
  const [isPendingWithdraw, setIsPendingWithdraw] = useState(false);
  const withdrawRequest = withdrawRequests.filter((request: IPoolWithdrawRequest) => request.beneficiary === selectedAddress);
  const [honeyPotBalanceValue, setHoneyPotBalanceValue] = useState("");

  // TODO: This is a temp fix to the issue when the countdown gets to minus value once it reaches 0.
  const [timerChanged, setTimerChanged] = useState(false);

  useEffect(() => {
    if (selectedAddress) {
      setIsWithdrawable(moment().isBetween(moment.unix(Number(withdrawRequest[0]?.withdrawEnableTime)), moment.unix(Number(withdrawRequest[0]?.expiryTime))));
      setIsPendingWithdraw(moment().isBefore(moment.unix(Number(withdrawRequest[0]?.withdrawEnableTime))));
    }
  }, [selectedAddress, withdrawRequest])

  useEffect(() => {
    setVaultAPY(apy ? `${millify(apy, { precision: 3 })}%` : "-");
  }, [setVaultAPY, apy])

  // temporary fix to https://github.com/hats-finance/hats/issues/29
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (apy) {
  //       setVaultAPY(`${millify(apy, { precision: 3 })}%`);
  //     }
  //   }, 1000);
  // }, [setVaultAPY, apy])

  useEffect(() => {
    setHoneyPotBalanceValue(tokenPrice ? millify(Number(fromWei(honeyPotBalance, stakingTokenDecimals)) * tokenPrice) : "");
  }, [tokenPrice, honeyPotBalance, stakingTokenDecimals])

  const description: IVaultDescription = parseJSONToObject(props.data?.description as string);

  return (
    <>
      <tr className={isGuest ? "guest" : ""}>
        <td>
          <div className={toggleRow ? "arrow open" : "arrow"} onClick={() => setToggleRow(!toggleRow)}><ArrowIcon /></div>
        </td>
        <td>
          <div className="project-name-wrapper">
            {/* TODO: handle project-metadata and Project-metadata */}
            <img src={description?.["project-metadata"]?.icon ?? description?.["Project-metadata"]?.icon} alt="project logo" />
            <div className="name-source-wrapper">
              <div className="project-name">{name}</div>
              {isGuest && <a className="source-name" target="_blank" rel="noopener noreferrer" href={description?.source?.url}>By {description?.source?.name}</a>}
            </div>
          </div>
        </td>
        <td>{isGuest && `${bounty} bounty + `} {millify(Number(fromWei(honeyPotBalance, stakingTokenDecimals)), { precision: 3 })} {honeyPotBalanceValue && <span className="honeypot-balance-value">&#8776; {`$${honeyPotBalanceValue}`}</span>}</td>
        <td>{millify(Number(fromWei(totalRewardAmount, stakingTokenDecimals)))}</td>
        <td>{vaultAPY}</td>
        <td className="action-wrapper">
          <button
            className="action-btn deposit-withdraw"
            onClick={() => { props.setShowModal(true); props.setModalData(props.data); }}
            disabled={!isProviderAndNetwork(provider)}>
            DEPOSIT / WITHDRAW
          </button>
          {selectedAddress && isPendingWithdraw && !isWithdrawable &&
            <>
              <div className="countdown-wrapper">
                <WithdrawCountdown
                  endDate={withdrawRequest[0]?.withdrawEnableTime}
                  compactView
                  onEnd={() => {
                    setTimerChanged(!timerChanged);
                    setIsPendingWithdraw(false);
                    setIsWithdrawable(true);
                  }}
                  textColor={Colors.yellow} />
              </div>
              <span>WITHDRAWAL REQUEST PENDING</span>
            </>
          }
          {selectedAddress && isWithdrawable && !isPendingWithdraw &&
            <>
              <div className="countdown-wrapper">
                <WithdrawCountdown
                  endDate={withdrawRequest[0]?.expiryTime}
                  compactView
                  onEnd={() => {
                    setTimerChanged(!timerChanged);
                    setIsWithdrawable(false);
                  }}
                />
              </div>
              <span>WITHDRAWAL AVAILABLE</span>
            </>
          }
        </td>
      </tr>
      {toggleRow &&
        <VaultExpanded data={props.data} />}
    </>
  )
}
