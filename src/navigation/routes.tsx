import { Navigate, RouteObject } from 'react-router-dom';
import { RoutePaths } from './paths';
// Page Components
import { BasicLayout } from 'layout';
import Honeypots from 'components/Honeypots';
import Gov from 'components/Gov';
import VulnerabilityForm from 'components/Vulnerability/VulnerabilityForm';
import VulnerabilityList from 'components/Vulnerability/VulnerabilityList/VulnerabilityList';
import CommitteeTools from 'components/CommitteeTools/CommitteTools';
import VaultEditor from 'components/VaultEditor/VaultEditor';
import AirdropMachine from 'components/AirdropMachine/AirdropMachine';

const routes: RouteObject[] = [
  {
    element: <BasicLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to={RoutePaths.vaults} replace={true} />,
      },
      {
        path: `${RoutePaths.vaults}`,
        children: [
          {
            path: '',
            element: <Honeypots />,
          },
          {
            path: ':pid',
            element: <Honeypots />,
          },
          {
            path: ':pid/deposit',
            element: <Honeypots showDeposit={true} />,
          },
        ],
      },
      {
        path: `${RoutePaths.gov}`,
        element: <Gov />,
      },
      {
        path: `${RoutePaths.vulnerability}`,
        children: [
          {
            path: '',
            element: <VulnerabilityList />,
          },
          {
            path: 'new',
            element: <VulnerabilityList />,
          },
          {
            path: ':vid',
            element: <VulnerabilityForm />,
          }
        ]
      },
      {
        path: `${RoutePaths.committee_tools}`,
        element: <CommitteeTools />,
      },
      {
        path: `${RoutePaths.vault_editor}`,
        children: [
          {
            path: '',
            element: <VaultEditor />,
          },
          {
            path: ':ipfsHash',
            element: <VaultEditor />,
          },
        ],
      },
      {
        path: `${RoutePaths.airdrop_machine}`,
        element: <AirdropMachine />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={RoutePaths.vaults} />,
  },
];

export { routes };
