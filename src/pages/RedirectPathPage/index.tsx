import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { useRecoilValue } from "recoil";
import { roleAtom } from "../../store/RoleAtom";
import { redirectByRole } from "../../utility/func/RedirectByPermission";

function RedirectPathPage() {
  const pathEmptyList = ["/UserPage", "/ShopManagementPage", "PriceListPage"];
  const roleData = useRecoilValue(roleAtom);
  const navigate = useNavigate();
  useEffectOnce(() => {
    if (pathEmptyList.includes(location.pathname)) {
      navigate(`${redirectByRole(roleData?.menus)}`);
    }
  });

  return <Outlet />;
}

export default RedirectPathPage;
