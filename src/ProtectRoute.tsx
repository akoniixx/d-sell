import { Navigate, Outlet } from 'react-router-dom';
import Layouts from './components/Layout/Layout';

const useAuth = () => {
  const user = localStorage.getItem('token');
  if (user) {
    return true;
  } else {
    return false;
  }
};

const ProtectRoute = () => {
  const auth = useAuth();
  return auth ? (
    <Layouts>
      <Outlet />
    </Layouts>
  ) : (
    <Navigate to='' />
  );
};

export default ProtectRoute;
