import { useEffect } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  matchRoutes,
  useMatches,
} from "react-router-dom";
import Layouts from "./components/Layout/Layout";

const ProtectRoute = ({ isAuth, children }: { isAuth: boolean; children?: JSX.Element }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [navigate, isAuth]);

  return children ? (
    children
  ) : (
    <Layouts>
      <Outlet />
    </Layouts>
  );
};

export default ProtectRoute;
