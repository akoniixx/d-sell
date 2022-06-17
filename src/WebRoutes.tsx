import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { profileAtom } from "./store/ProfileAtom";
import Layouts from "./components/Layout/Layout";
import AdvancePromotionPage from "./pages/ApproveOrderPage/AdvancePromotionPage";
import SpecialPromotionPage from "./pages/ApproveOrderPage/SpecialPromotionPage";
import SpecialRequestPage from "./pages/ApproveOrderPage/SpecialRequestPage";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { AddDiscountCOPage } from "./pages/DiscountPage/AddDiscountCOPage";
import { DiscountCOPage } from "./pages/DiscountPage/DiscountCOPage";
import { DiscountListPage } from "./pages/DiscountPage/DiscountListPage";
import ErrorLoginPage from "./pages/ErrorPage/ErrorLoginPage";
import PageNotFound from "./pages/HttpError/PageNotFound";
import { OrderPage } from "./pages/OrderPage/OrderPage";
import ShopPage from "./pages/PriceListPage/ShopPage";
import { AddNewSale } from "./pages/UserPage/AddNewSale";
import { AddRoleManage } from "./pages/UserPage/AddRoleManage";
import RoleManagementPage from "./pages/UserPage/RoleManagementPage";
import SaleManagementPage from "./pages/UserPage/SaleManagementPage";
import ProtectRoute from "./ProtectRoute";
import PublicRoute from "./PublicRoute";
import { EditDistributionPage } from "./pages/PriceListPage/EditDistributionPage";
import { DistributionPage } from "./pages/PriceListPage/DistributionPage";

const WebRoutes: React.FC<any> = () => {
  const token = useRecoilValue(profileAtom);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectRoute />}>
        <Route path="*" element={<Navigate to="/OrderPage"  />} />
          <Route path="/OrderPage" element={<OrderPage />} />
          <Route path="/SpecialRequestPage" element={<SpecialRequestPage />} />
          <Route
            path="/SpecialPromotionPage"
            element={<SpecialPromotionPage />}
          />
          <Route path="/DiscountListPage" element={<DiscountListPage />} />
          <Route path="/EditDistributionPage" element={<EditDistributionPage />} />
          <Route path="/DiscountCOPage" element={<DiscountCOPage />} />
          <Route path="/DistributionPage" element={<DistributionPage />} />
          <Route
            path="/AdvancePromotionPage"
            element={<AdvancePromotionPage />}
          />
          <Route path="/ShopPage" element={<ShopPage />} />
          <Route path="/SaleManagementPage" element={<SaleManagementPage />} />
          <Route path="/RoleManagementPage" element={<RoleManagementPage />} />
          <Route path="/AddNewSale" element={<AddNewSale />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route element={<PublicRoute />}>
          <Route index element={<AuthPage />} />
          <Route path="/ErrorLoginPage" element={<ErrorLoginPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default WebRoutes;
