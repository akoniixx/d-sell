import { Navigate, Outlet } from "react-router-dom";
import Layouts from "./components/Layout/Layout";

const ProtectRoute = ({ isAuth, children }: { isAuth: boolean; children?: JSX.Element }) => {
  if (!isAuth) {
    return <Navigate to='/' replace />;
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
