import { Navigate, RouteObject } from 'react-router-dom';
import { RoutePaths } from './paths';
// Page Components
import Honeypots from 'components/Honeypots';
import Gov from 'components/Gov';
import VulnerabilityForm from 'components/Vulnerability/VulnerabilityForm';
import CommitteeTools from 'components/CommitteeTools/CommitteTools';
import VaultEditor from 'components/VaultEditor/VaultEditor';
import AirdropMachine from 'components/AirdropMachine/AirdropMachine';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={RoutePaths.vaults} replace={true} />,
  },
  {
    path: `${RoutePaths.vaults}`,
    element: <Honeypots />,
  },
  {
    path: `${RoutePaths.vaults}/:pid`,
    element: <Honeypots />,
  },
  {
    path: `${RoutePaths.vaults}/:pid/deposit`,
    element: <Honeypots showDeposit={true} />,
  },
  {
    path: `${RoutePaths.gov}`,
    element: <Gov />,
  },
  {
    path: `${RoutePaths.vulnerability}`,
    element: <VulnerabilityForm />,
  },
  {
    path: `${RoutePaths.committee_tools}`,
    element: <CommitteeTools />,
  },
  {
    path: `${RoutePaths.vault_editor}`,
    element: <VaultEditor />,
  },
  {
    path: `${RoutePaths.vault_editor}/:ipfsHash`,
    element: <VaultEditor />,
  },
  {
    path: `${RoutePaths.airdrop_machine}`,
    element: <AirdropMachine />,
  },
  {
    path: '*',
    element: <Navigate to={RoutePaths.vaults} />,
  },
];

export { routes };
