import React from "react";
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

const WebRoutes: React.FC<any> = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectRoute />}>
          {/* <Route path='*' element={<Navigate to='/OrderPage' />} /> */}
          <Route path='/OrderPage' element={<OrderPage />} />
          <Route path='/SpecialRequestPage' element={<SpecialRequestPage />} />
          <Route path='/SpecialPromotionPage' element={<SpecialPromotionPage />} />
          <Route path='/DiscountListPage' element={<DiscountListPage />} />
          <Route path='/DiscountCOPage' element={<DiscountCOPage />} />
          <Route path='/DistributionPage' element={<DistributionPage />} />
          <Route path='/AdvancePromotionPage' element={<AdvancePromotionPage />} />
          <Route path='/ShopPage' element={<ShopPage />} />
          <Route path='/ShopManagementPage/*' element={<RedirectPathPage />}>
            <Route index path='ShopListPage/*' element={<ShopListPage />} />
            <Route path='ShopListPage/AddNewShop' element={<AddNewShopPage />} />
            <Route path='ApproveTelPage' element={<ApproveTelPage />} />
          </Route>
          <Route path='/UserPage/*' element={<RedirectPathPage />}>
            <Route index path='SaleManagementPage/*' element={<SaleManagementPage />} />
            <Route path='SaleManagementPage/AddSale' element={<AddNewSale />} />
            <Route path='SaleManagementPage/EditSale/:userStaffId' element={<EditUserSale />} />
            <Route path='RoleManagementPage/*' element={<RolesManagementPage />} />
            <Route path='RoleManagementPage/AddNewRole' element={<AddNewRole />} />
          </Route>
          <Route path='*' element={<PageNotFound />} />
        </Route>

        <Route element={<PublicRoute />}>
          <Route index element={<AuthPage />} />
          <Route path='/ErrorLoginPage' element={<ErrorLoginPage />} />
          <Route path='*' element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default WebRoutes;
