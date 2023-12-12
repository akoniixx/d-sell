import React, { useEffect } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  matchRoutes,
  useMatches,
} from "react-router-dom";
import Layouts from "./components/Layout/Layout";
const regexPatterns = [/SyncCustomer$/];
const checkPath = (path: string, caseList: RegExp[]) => {
  return caseList.some((pattern) => pattern.test(path));
};

const ProtectRoute = ({ isAuth, children }: { isAuth: boolean; children?: JSX.Element }) => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const isMatch = checkPath(location, regexPatterns);
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [navigate, isAuth]);
  if (isMatch) {
    return <Outlet />;
  }

  return children ? (
    children
  ) : (
    <Layouts>
      <Outlet />
    </Layouts>
  );
};

export default ProtectRoute;
