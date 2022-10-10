import { Navigate, RouteObject } from 'react-router-dom';
import { RoutePaths } from './paths';
// Page Components
import { BasicLayout } from 'layout';
import CommitteeTools from 'components/CommitteeTools/CommitteTools';
import VaultEditor from 'components/VaultEditor/VaultEditor';
import AirdropMachine from 'components/AirdropMachine/AirdropMachine';
import { HoneypotsPage, GovPage, VulnerabilityListPage, VulnerabilityFormPage } from 'pages';

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
            element: <HoneypotsPage />,
          },
          {
            path: ':pid',
            element: <HoneypotsPage />,
          },
          {
            path: ':pid/deposit',
            element: <HoneypotsPage showDeposit={true} />,
          },
        ],
      },
      {
        path: `${RoutePaths.gov}`,
        element: <GovPage />,
      },
      {
        path: `${RoutePaths.vulnerability}`,
        children: [
          {
            path: '',
            element: <VulnerabilityFormPage />,
          },
          // {
          //   path: '',
          //   element: <VulnerabilityListPage />,
          // },
          // {
          //   path: 'new',
          //   element: <VulnerabilityListPage />,
          // },
          // {
          //   path: ':vid',
          //   element: <VulnerabilityForm />,
          // }
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
