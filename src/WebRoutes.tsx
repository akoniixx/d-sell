import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

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
import { AddNewSale } from "./pages/UserPage/SaleMangementPage/AddNewSale";
import ProtectRoute from "./ProtectRoute";
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
import { useRecoilState, useSetRecoilState } from "recoil";
import EditRole from "./pages/UserPage/RolesManagementPage/EditRole";
import { roleAtom } from "./store/RoleAtom";
import { roleDatasource } from "./datasource/RoleDatasource";
import ShopPage from "./pages/PriceListPage/ShopPage";
import DetailShopPage from "./pages/ShopManagementPage/ShopListPage/DetailShopPage";
import EditShopPage from "./pages/ShopManagementPage/ShopListPage/EditShopPage";

interface IRoute {
  path: string;
  element: JSX.Element;
  permission: {
    name: string;
    action: string;
  } | null;
  name?: string;
  nestedRoutes: {
    path: string;
    name?: string;
    element: JSX.Element;
    permission: {
      name: string;
      action: string;
    } | null;
  }[];
  index?: boolean;
}
export const protectRoutesData: IRoute[] = [
  {
    path: "/OrderPage",
    element: <OrderPage />,
    permission: {
      name: "orderManagement",
      action: "view",
    },
    nestedRoutes: [],
    index: false,
  },
  {
    path: "/SpecialRequestPage",
    element: <SpecialRequestPage />,
    permission: {
      name: "specialRequest",
      action: "view",
    },
    nestedRoutes: [],
    index: false,
  },
  {
    path: "/SpecialPromotionPage",
    element: <SpecialPromotionPage />,
    permission: {
      name: "specialPromotion",
      action: "view",
    },
    nestedRoutes: [],
    index: false,
  },
  {
    path: "/DiscountListPage",
    element: <DiscountListPage />,
    permission: {
      name: "discountList",
      action: "view",
    },

    nestedRoutes: [],
    index: false,
  },
  {
    path: "/DiscountCOPage",
    element: <DiscountCOPage />,
    permission: {
      name: "discountCo",
      action: "view",
    },
    nestedRoutes: [],
    index: false,
  },
  {
    path: "/PriceListPage",
    element: <RedirectPathPage />,
    permission: null,
    nestedRoutes: [
      {
        path: "DistributionPage/*",
        element: <DistributionPage />,
        permission: null,
      },
      {
        path: "ShopPage/*",
        element: <ShopPage />,
        permission: null,
      },
    ],
    index: false,
  },
  {
    path: "/AdvancePromotionPage",
    element: <AdvancePromotionPage />,
    permission: {
      name: "advancePromotion",
      action: "view",
    },
    nestedRoutes: [],
    index: false,
  },

  {
    path: "/ShopManagementPage/*",
    element: <RedirectPathPage />,
    permission: null,
    nestedRoutes: [
      {
        path: "ShopListPage/*",
        element: <ShopListPage />,
        permission: null,
        name: "shopList",
      },
      {
        path: "ShopListPage/AddNewShop",
        element: <AddNewShopPage />,
        permission: null,
        name: "addNewShop",
      },

      {
        path: "ShopListPage/DetailPage/:shopId/*",
        element: <DetailShopPage />,
        permission: null,
        name: "detailShop",
      },
      {
        path: "ShopListPage/DetailPage/:shopId/EditShopPage",
        element: <EditShopPage />,
        permission: null,
        name: "editShop",
      },

      {
        path: "ApproveTelPage",
        element: <ApproveTelPage />,
        permission: null,
      },
    ],
  },
  {
    path: "/UserPage/*",
    element: <RedirectPathPage />,
    permission: {
      name: "nestedUser",
      action: "view",
    },
    nestedRoutes: [
      {
        path: "SaleManagementPage/*",
        element: <SaleManagementPage />,
        permission: {
          name: "saleManagement",
          action: "view",
        },
      },
      {
        path: "SaleManagementPage/AddSale",
        element: <AddNewSale />,
        permission: {
          name: "saleManagement",
          action: "create",
        },
      },
      {
        path: "SaleManagementPage/EditSale/:userStaffId",
        element: <EditUserSale />,
        permission: {
          name: "saleManagement",
          action: "edit",
        },
      },
      {
        path: "RoleManagementPage/*",
        element: <RolesManagementPage />,
        permission: {
          name: "roleManagement",
          action: "view",
        },
      },
      {
        path: "RoleManagementPage/AddNewRole",
        element: <AddNewRole />,
        permission: {
          name: "roleManagement",
          action: "create",
        },
      },
      {
        path: "RoleManagementPage/EditRole/:roleId",
        element: <EditRole />,
        permission: {
          name: "roleManagement",
          action: "edit",
        },
      },
    ],
  },
];
const WebRoutes: React.FC<any> = () => {
  const [profileRecoil, setProfileRecoil] = useRecoilState(profileAtom);
  const token = localStorage.getItem("token");
  const profile: any = localStorage.getItem("profile");
  const parsedToken = token ? JSON.parse(token) : null;
  const parsedProfile = profile ? JSON.parse(profile) : null;
  const [loading, setLoading] = useState<boolean>(true);

  const setRole = useSetRecoilState(roleAtom);

  useEffect(() => {
    const getRoleData = async (roleId: string) => {
      try {
        const roleData = await roleDatasource.getRoleById(roleId);
        setRole(roleData);
      } catch (error: any) {
        if (error.response.status === 401) {
          sessionStorage.clear();
          localStorage.clear();
          const url = window.location.href;
          const arr = url.split("/");
          const resultUrlHost = arr[0] + "//" + arr[2];

          window.location.href =
            "https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=" +
            resultUrlHost;
        }

        throw error;
      } finally {
        setLoading(false);
      }
    };
    const getUserData = async () => {
      try {
        setProfileRecoil(parsedProfile || null);

        if (parsedProfile) {
          await getRoleData(parsedProfile.roleId);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (parsedToken && profileRecoil === null) {
      getUserData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setProfileRecoil, setRole, profileRecoil]);

  useEffect(() => {
    if (!parsedProfile) {
      setLoading(false);
    }
  }, [parsedProfile]);

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
  const router = createBrowserRouter(
    createRoutesFromElements(
      profileRecoil === null ? (
        <>
          <Route index element={<AuthPage />} />
          <Route path='/' element={<AuthPage />} />
          <Route path='/ErrorLoginPage' element={<ErrorLoginPage />} />
          <Route path='*' element={<PageNotFound />} />
        </>
      ) : (
        <Route element={<ProtectRoute isAuth={!!profileRecoil} />}>
          {protectRoutesData.map((route, index) => {
            if (route.nestedRoutes.length < 1) {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                  handle={{
                    crumb: () => {
                      return route;
                    },
                  }}
                />
              );
            } else {
              return (
                <Route key={index} path={route.path} element={route.element}>
                  {route.nestedRoutes.map((nestedRoute, idx) => {
                    return (
                      <Route
                        key={idx}
                        path={nestedRoute.path}
                        element={nestedRoute.element}
                        handle={{
                          crumb: () => {
                            return nestedRoute;
                          },
                        }}
                      />
                    );
                  })}
                </Route>
              );
            }
          })}
          <Route path='*' element={<PageNotFound />} />
        </Route>
      ),
    ),
  );
  return <RouterProvider router={router} />;
};

export default WebRoutes;
