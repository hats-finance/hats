import { RouteObject, useRoutes } from 'react-router-dom';

interface LayoutsProps {
  routes: RouteObject[];
}

const AppRouter = ({ routes }: LayoutsProps): JSX.Element => {
  let appRoutes = useRoutes(routes);
  return <>{appRoutes}</>;
};

export { AppRouter };
