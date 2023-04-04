import { Loading } from "components";
import { useKeystore } from "components/Keystore";
import { DecryptTool } from "./DecryptTool/DecryptTool";
import { WelcomeCommittee } from "./WelcomeCommittee/WelcomeCommittee";

export const CommitteeToolsPage = () => {
  const { keystore, isKeystoreLoaded } = useKeystore();

  if (!isKeystoreLoaded) return <Loading fixed />;

  return <div className="content-wrapper">{keystore ? <DecryptTool /> : <WelcomeCommittee />}</div>;
};
