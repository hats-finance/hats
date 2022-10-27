import { useContext } from "react";
import { KeystoreContext, UnlockKeystoreModal } from "components/Keystore";
import Decrypt from "./Decrypt/Decrypt";
import Welcome from "./Welcome/Welcome";
import { StyledCommitteeToolsPage } from "./styles";

const CommitteeToolsPage = () => {
  const keystoreContext = useContext(KeystoreContext);

  return (
    <StyledCommitteeToolsPage className="content-wrapper">
      <div className="committee-tools-content">
        <UnlockKeystoreModal isShowing={keystoreContext.isCreated && keystoreContext.isLocked} />
        {keystoreContext.isCreated ? <Decrypt /> : <Welcome />}
      </div>
    </StyledCommitteeToolsPage>
  );
};

export { CommitteeToolsPage };
