import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffectOnce } from "react-use";

function RedirectPathPage() {
  const pathEmptyList = ["/UserPage"];
  const navigate = useNavigate();
  useEffectOnce(() => {
    const currentPath = window.location.pathname;
    if (pathEmptyList.includes(currentPath)) {
      navigate("/OrderPage");
    }
  });

  return <Outlet />;
}

export default RedirectPathPage;
