import Decrypt from "./Decrypt/Decrypt";
import Welcome from "./Welcome/Welcome";
import { StyledCommitteeToolsPage } from "./styles";
import { useKeystore } from "components/Keystore";
import { Loading } from "components";

const CommitteeToolsPage = () => {
  const { keystore, isKeystoreLoaded } = useKeystore();

  if (!isKeystoreLoaded) return <Loading fixed />;

  return (
    <StyledCommitteeToolsPage className="content-wrapper">
      <div className="committee-tools-content">{keystore ? <Decrypt /> : <Welcome />}</div>
    </StyledCommitteeToolsPage>
  );
};

export { CommitteeToolsPage };
