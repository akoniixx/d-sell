import { useEffect } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  matchRoutes,
  useMatches,
} from "react-router-dom";
import { useRecoilValue } from "recoil";
import Layouts from "./components/Layout/Layout";
import { roleAtom } from "./store/RoleAtom";
import { checkPermission, redirectByRole } from "./utility/func/RedirectByPermission";
import { protectRoutesData } from "./WebRoutes";

const ProtectRoute = ({ isAuth, children }: { isAuth: boolean; children?: JSX.Element }) => {
  const roleData = useRecoilValue(roleAtom);

  const useCurrentPath = () => {
    const location = useLocation();
    const newRoutes = protectRoutesData.reduce((acc: any, cur) => {
      if (cur.nestedRoutes.length > 0) {
        return [
          ...acc,
          ...cur.nestedRoutes.map((el) => {
            return {
              ...el,
              path: cur.path.replace("/*", "") + "/" + el.path.replace("/*", ""),
            };
          }),
        ];
      } else {
        return [...acc, cur];
      }
    }, []);
    const result: any = matchRoutes(newRoutes, location);

    return result?.[0]?.route?.path || "/";
  };
  const currentPath = useCurrentPath();

  const navigate = useNavigate();

  if (!isAuth) {
    return <Navigate to='' replace />;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (roleData && currentPath === "/") {
      navigate(`${redirectByRole(roleData?.menus)}`);
    }
    if (roleData && !checkPermission(roleData?.menus, currentPath)) {
      navigate(`${redirectByRole(roleData?.menus)}`);
    }
  }, [roleData, currentPath, navigate]);

  return children ? (
    children
  ) : (
    <Layouts>
      <Outlet />
    </Layouts>
  );
};

export default ProtectRoute;
