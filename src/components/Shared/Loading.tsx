import "../../styles/Shared/Loading.scss";
import LoadingIcon from "../../assets/icons/loading.svg";

interface IProps {
  fixed?: boolean;
  top?: string; // can be any valid css top value
  right?: string // can be any valid css right value
}

export default function Loading(props: IProps) {
  const styles = {
    "top": props.top ?? "50%",
    "right": props.right ?? "50%"
  }
  return (
    <div className={props.fixed ? "loading-wrapper fixed" : "loading-wrapper"} style={styles}>
      <img width='40px' src={LoadingIcon} alt='loader' />
    </div>
  )
}
