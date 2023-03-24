import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdvancePromotionPage from "./pages/ApproveOrderPage/AdvancePromotionPage";
import SpecialPromotionPage from "./pages/ApproveOrderPage/SpecialPromotionPage";
import SpecialRequestPage from "./pages/ApproveOrderPage/SpecialRequestPage";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import ErrorLoginPage from "./pages/ErrorPage/ErrorLoginPage";
import PageNotFound from "./pages/HttpError/PageNotFound";
import { OrderPage } from "./pages/OrderPage/OrderPage";
import { DistributionPage } from "./pages/PriceListPage/DistributionPage";
import { DistributionPageDetail } from "./pages/PriceListPage/ProductDetailPage";
import { DistributionPageEdit } from "./pages/PriceListPage/ProductEditPage";
import { AddNewSale } from "./pages/UserPage/SaleManagementPage/SaleManagementPage";
import SaleManagementPage from "./pages/UserPage/SaleManagementPage";
import { EditUserSale } from "./pages/UserPage/SaleManagementPage/EditUserSale";
import ProtectRoute from "./ProtectRoute";
import RedirectPathPage from "./pages/RedirectPathPage";
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
import DetailShopPage from "./pages/ShopManagementPage/ShopListPage/DetailShopPage";
import EditShopPage from "./pages/ShopManagementPage/ShopListPage/EditShopPage";
import { FreebieListPage } from "./pages/promotionPage/freebieList";
import { PromotionListPage } from "./pages/promotionPage/promotionList";
import { PromotionCreatePage } from "./pages/promotionPage/createPromotion";
import DetailRole from "./pages/UserPage/RolesManagementPage/DetailRole";
import { DiscountCreatePage } from "./pages/DiscountPage/DiscountCO/CreateCO";
import { DiscountListPage } from "./pages/DiscountPage/DiscountCO/DiscountListPage";
import { CreditMemoDetail } from "./pages/DiscountPage/DiscountCO/CreditMemoDetail";
import HomePage from "./pages/HomePage/HomePage";
import { PriceListX10 } from "./pages/PriceListX10/PriceList";
import { PriceListCreatePage } from "./pages/PriceListX10/CreatePriceList";
import { CustomerDiscountListPage } from "./pages/DiscountPage/CustomerDiscount/CustomerList";
import { CustomerCreditMemoDetail } from "./pages/DiscountPage/CustomerDiscount/CustomerDetail";
import DetailApproveTelPage from "./pages/ShopManagementPage/ApproveTelPage/DetailApproveTelPage";
import { SpecialPriceDetail } from "./pages/PriceListX10/PriceListDetail";
import { OrderList } from "./pages/OrderManagement/orderList";
import { OrderDetail } from "./pages/OrderManagement/orderDetail";
import { SpecialRequestList } from "./pages/SpecialRequest/specialRequestList";
import { IndexConditionCOPage } from "./pages/DiscountPage/ConditionCO/IndexConditionCOPage";
import { CreateConditionCOPage } from "./pages/DiscountPage/ConditionCO/CreateConditionCOPage";

interface IRoute {
  path: string;
  element: JSX.Element;
  permission: {
    name: string;
    action: string;
  } | null;
  nestedRoutes: {
    path: string;
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
    path: "/home",
    element: <HomePage />,
    permission: null,
    nestedRoutes: [],
    index: false,
  },
  {
    path: "/order",
    element: <RedirectPathPage />,
    permission: null,
    nestedRoutes: [
      {
        path: "",
        element: <OrderList />,
        permission: null,
      },
      {
        path: ":id",
        element: <OrderDetail />,
        permission: null,
      },
    ],
    index: false,
  },
  {
    path: "/view-order",
    element: <RedirectPathPage />,
    permission: null,
    nestedRoutes: [
      {
        path: ":id",
        element: <OrderDetail />,
        permission: null,
      },
    ],
    index: false,
  },
  {
    path: "/special-request",
    element: <SpecialRequestList />,
    permission: null,
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
    path: "/discount/*",
    element: <RedirectPathPage />,
    permission: {
      name: "discountCo",
      action: "view",
    },
    nestedRoutes: [
      {
        path: "list",
        element: <DiscountListPage />,
        permission: null,
      },
      {
        path: "create",
        element: <DiscountCreatePage />,
        permission: null,
      },
      {
        path: "edit/:id",
        element: <DiscountCreatePage />,
        permission: null,
      },
      {
        path: "detail/:id",
        element: <CreditMemoDetail />,
        permission: null,
      },
      {
        path: "customerList",
        element: <CustomerDiscountListPage />,
        permission: null,
      },
      {
        path: "customerDetail/:id",
        element: <CustomerCreditMemoDetail />,
        permission: null,
      },
      {
        path: "conditionCo",
        element: <IndexConditionCOPage />,
        permission: null,
      },
      {
        path: "createConditionCo",
        element: <CreateConditionCOPage />,
        permission: null,
      },
    ],
  },
  {
    path: "/PriceListPage/*",
    element: <RedirectPathPage />,
    permission: null,
    nestedRoutes: [
      {
        path: "DistributionPage",
        element: <DistributionPage />,
        permission: null,
      },
      {
        path: "DistributionPage/:id",
        element: <DistributionPageDetail />,
        permission: null,
      },
      {
        path: "DistributionPage/edit/:i",
        element: <DistributionPageEdit />,
        permission: null,
      },
    ],
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
      },
      {
        path: "ShopListPage/AddNewShop",
        element: <AddNewShopPage />,
        permission: null,
      },
      {
        path: "ShopListPage/DetailPage/:shopId",
        element: <DetailShopPage />,
        permission: null,
      },
      {
        path: "ShopListPage/DetailPage/:shopId/EditShopPage",
        element: <EditShopPage />,
        permission: null,
      },

      {
        path: "ApproveTelPage/*",
        element: <ApproveTelPage />,
        permission: null,
      },
      {
        path: "ApproveTelPage/DetailApproveTelPage",
        element: <DetailApproveTelPage />,
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
        path: "RoleManagementPage/DetailRole/:roleId",
        element: <DetailRole />,
        permission: null,
      },
      {
        path: "RoleManagementPage/EditRole/:roleId",
        element: <EditRole />,
        permission: null,
      },
    ],
  },
  {
    path: "/PromotionPage/*",
    element: <RedirectPathPage />,
    permission: null,
    nestedRoutes: [
      {
        path: "promotion",
        element: <PromotionListPage />,
        permission: null,
      },
      {
        path: "promotion/create",
        element: <PromotionCreatePage />,
        permission: null,
      },
      {
        path: "promotion/edit/:id",
        element: <PromotionCreatePage />,
        permission: null,
      },
      {
        path: "freebies",
        element: <FreebieListPage />,
        permission: null,
      },
      {
        path: "freebies/:id",
        element: <DistributionPageDetail />,
        permission: null,
      },
      {
        path: "freebies/edit/:id",
        element: <DistributionPageEdit />,
        permission: null,
      },
    ],
  },
  {
    path: "/price/*",
    element: <RedirectPathPage />,
    permission: null,
    nestedRoutes: [
      {
        path: "list",
        element: <PriceListX10 />,
        permission: null,
      },
      {
        path: "create",
        element: <PriceListCreatePage />,
        permission: null,
      },
      {
        path: "edit/:id",
        element: <SpecialPriceDetail />,
        permission: null,
      },
      {
        path: "detail/:id",
        element: <SpecialPriceDetail />,
        permission: null,
      },
    ],
  },
];

const WebRoutes: React.FC<any> = () => {
  const [profileRecoil, setProfileRecoil] = useRecoilState(profileAtom);

  const setRole = useSetRecoilState(roleAtom);

  const [loading, setLoading] = useState<boolean>(true);
  const profile: any = localStorage.getItem("profile");

  useEffect(() => {
    const getRoleData = async (roleId: string) => {
      try {
        const roleData = await roleDatasource.getRoleById(roleId);
        setRole(roleData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    const getUserData = async () => {
      setLoading(true);

      setProfileRecoil(JSON.parse(profile) || null);
      if (JSON.parse(profile)) {
        getRoleData(JSON.parse(profile).roleId);
      }
    };

    if (profile) {
      getUserData();
    } else {
      setTimeout(() => {
        setLoading(false);
        setProfileRecoil(null);
        setRole(null);
      }, 2000);
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

  return (
    <BrowserRouter>
      <Routes>
        {profileRecoil === null ? (
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
            <Route path='*' element={<PageNotFound />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default WebRoutes;
