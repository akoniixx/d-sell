import { useEffect } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useRoutes,
  matchRoutes,
  useParams,
} from "react-router-dom";
import { useRecoilValue } from "recoil";
import Layouts from "./components/Layout/Layout";
import { roleAtom } from "./store/RoleAtom";
import { checkPermission, redirectByRole } from "./utility/func/RedirectByPermission";

const ProtectRoute = ({ isAuth, children }: { isAuth: boolean; children?: JSX.Element }) => {
  const roleData = useRecoilValue(roleAtom);
  const params = useParams<Record<string, string>>();
  const location = useLocation();
  const getKeyLast = Object.keys(params)[Object.keys(params).length - 1];

  const currentPath =
    getKeyLast === "*"
      ? location.pathname
      : location.pathname.replace("/" + params[getKeyLast], "") + "/:" + getKeyLast;

  const navigate = useNavigate();

  if (!isAuth) {
    return <Navigate to='' replace />;
  }
  useEffect(() => {
    if (currentPath === "/") {
      navigate(`${redirectByRole(roleData?.menus)}`);
    }
  }, [roleData, currentPath]);
  useEffect(() => {
    if (roleData && !checkPermission(roleData?.menus, currentPath)) {
      navigate(`${redirectByRole(roleData?.menus)}`);
    }
  }, [currentPath, roleData]);
  return children ? (
    children
  ) : (
    <Layouts>
      <Outlet />
    </Layouts>
  );
};

export default ProtectRoute;
