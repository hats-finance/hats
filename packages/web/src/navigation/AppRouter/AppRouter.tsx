import { useEffect } from "react";
import { RouteObject, useNavigate, useRoutes } from "react-router-dom";

interface LayoutsProps {
  routes: RouteObject[];
}

const AppRouter = ({ routes }: LayoutsProps): JSX.Element => {
  const location = document.location;
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/" && !location.hash.includes(location.pathname)) {
      location.href = `${location.origin}/#${location.pathname}${location.search}`;
    }
  }, [navigate, location]);

  const appRoutes = useRoutes(routes);

  return <>{appRoutes}</>;
};

export { AppRouter };
