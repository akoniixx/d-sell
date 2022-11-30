import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdvancePromotionPage from "./pages/ApproveOrderPage/AdvancePromotionPage";
import SpecialPromotionPage from "./pages/ApproveOrderPage/SpecialPromotionPage";
import SpecialRequestPage from "./pages/ApproveOrderPage/SpecialRequestPage";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { DiscountCOPage } from "./pages/DiscountPage/DiscountCOPage";
import { DiscountListPage } from "./pages/DiscountPage/DiscountListPage";
import ErrorLoginPage from "./pages/ErrorPage/ErrorLoginPage";
import PageNotFound from "./pages/HttpError/PageNotFound";
import { OrderPage } from "./pages/OrderPage/OrderPage";
import { DistributionPage } from "./pages/PriceListPage/DistributionPage";
import ShopPage from "./pages/PriceListPage/ShopPage";
import { AddNewSale } from "./pages/UserPage/SaleMangementPage/AddNewSale";
import ProtectRoute from "./ProtectRoute";
import PublicRoute from "./PublicRoute";
import SaleManagementPage from "./pages/UserPage/SaleMangementPage";
import RedirectPathPage from "./pages/RedirectPathPage";
import { EditUserSale } from "./pages/UserPage/SaleMangementPage/EditUserSale";
import RolesManagementPage from "./pages/UserPage/RolesManagementPage";
import AddNewRole from "./pages/UserPage/RolesManagementPage/AddNewRole";
import ShopListPage from "./pages/ShopManagementPage/ShopListPage";
import ApproveTelPage from "./pages/ShopManagementPage/ApproveTelPage";
import AddNewShopPage from "./pages/ShopManagementPage/ShopListPage/AddNewShopPage";
import { Spin } from "antd";
import { profileAtom } from "./store/ProfileAtom";
import { useRecoilState } from "recoil";

const WebRoutes: React.FC<any> = () => {
  const [profileRecoil, setProfileRecoil] = useRecoilState(profileAtom);

  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const profile: any = await localStorage.getItem("profile");
      setProfileRecoil(profile || null);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    };
    if (!profileRecoil) {
      getProfile();
    }
  }, []);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size='large' />
      </div>
    );
  }
  const protectRoutesData = [
    {
      path: "/OrderPage",
      element: <OrderPage />,
      permission: null,
      nestedRoutes: [],
    },
    {
      path: "/SpecialRequestPage",
      element: <SpecialRequestPage />,
      permission: null,
      nestedRoutes: [],
    },
    {
      path: "/SpecialPromotionPage",
      element: <SpecialPromotionPage />,
      permission: null,
      nestedRoutes: [],
    },
    {
      path: "/DiscountListPage",
      element: <DiscountListPage />,
      permission: null,
      nestedRoutes: [],
    },
    {
      path: "/DiscountCOPage",
      element: <DiscountCOPage />,
      permission: null,
      nestedRoutes: [],
    },
    {
      path: "/DistributionPage",
      element: <DistributionPage />,
      permission: null,
      nestedRoutes: [],
    },
    {
      path: "/AdvancePromotionPage",
      element: <AdvancePromotionPage />,
      permission: null,
      nestedRoutes: [],
    },
    {
      path: "/ShopPage",
      element: <ShopPage />,
      permission: null,
      nestedRoutes: [],
    },
    {
      path: "/ShopManagementPage/*",
      element: <RedirectPathPage />,
      permission: null,
      nestedRoutes: [
        {
          path: "ShopListPage/*",
          element: <ShopListPage />,
        },
        {
          path: "ShopListPage/AddNewShop",
          element: <AddNewShopPage />,
        },
        {
          path: "ApproveTelPage",
          element: <ApproveTelPage />,
        },
      ],
    },
    {
      path: "/UserPage/*",
      element: <RedirectPathPage />,
      permission: null,
      nestedRoutes: [
        {
          path: "SaleManagementPage/*",
          element: <SaleManagementPage />,
        },
        {
          path: "SaleManagementPage/AddSale",
          element: <AddNewSale />,
        },
        {
          path: "SaleManagementPage/EditSale/:userStaffId",
          element: <EditUserSale />,
        },
        {
          path: "RolesManagementPage/*",
          element: <RolesManagementPage />,
        },
        {
          path: "RolesManagementPage/AddNewRole",
          element: <AddNewRole />,
        },
      ],
    },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {!profileRecoil ? (
          <>
            <Route index element={<AuthPage />} />
            <Route path='/ErrorLoginPage' element={<ErrorLoginPage />} />
          </>
        ) : (
          <Route element={<ProtectRoute isAuth={!!profileRecoil} />}>
            {protectRoutesData.map((route, index) => {
              if (route.nestedRoutes.length < 1) {
                return <Route key={index} path={route.path} element={route.element} />;
              } else {
                return (
                  <Route key={index} path={route.path} element={route.element}>
                    {route.nestedRoutes.map((nestedRoute, idx) => {
                      return (
                        <Route key={idx} path={nestedRoute.path} element={nestedRoute.element} />
                      );
                    })}
                  </Route>
                );
              }
            })}
          </Route>
        )}

        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default WebRoutes;
