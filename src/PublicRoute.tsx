import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return true;
  } else {
    return false;
  }
};

const PublicRoute = (props: any) => {
  const auth = useAuth();

  return auth ? <Navigate to='/AuthPage' /> : <Outlet />;
};

export default PublicRoute;
