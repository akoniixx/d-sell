import { Layout } from "antd";
import { Header, Content, Footer } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import React, { useState } from "react";
import { Navbar } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layouts from "./components/Layout/Layout";
import AdvancePromotionPage from "./pages/ApproveOrderPage/AdvancePromotionPage";
import SpecialPromotionPage from "./pages/ApproveOrderPage/SpecialPromotionPage";
import SpecialRequestPage from "./pages/ApproveOrderPage/SpecialRequestPage";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { AddDiscountCOPage } from "./pages/DiscountPage/AddDiscountCOPage";
import { DiscountCOPage } from "./pages/DiscountPage/DiscountCOPage";
import { DiscountListPage } from "./pages/DiscountPage/DiscountListPage";
import ErrorLoginPage from "./pages/ErrorPage/ErrorLoginPage";
import HomePage from "./pages/HomePage/HomePage";
import PageNotFound from "./pages/HttpError/PageNotFound";
import { OrderPage } from "./pages/OrderPage/OrderPage";
import { DistributionPage } from "./pages/PriceListPage/DistributionPage";
import ShopPage from "./pages/PriceListPage/ShopPage";
import { AddNewSale } from "./pages/UserPage/AddNewSale";
import { AddRoleManage } from "./pages/UserPage/AddRoleManage";
import RoleManagementPage from "./pages/UserPage/RoleManagementPage";
import SaleManagementPage from "./pages/UserPage/SaleManagementPage";

const WebRoutes: React.FC<any> = () => {
  const [token, setToken] = useState('token');
  return (
    <BrowserRouter>
      {token ? (
        <Layouts>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/OrderPage" element={<OrderPage/>} />
            <Route path="/SpecialRequestPage" element={<SpecialRequestPage/>} />
            <Route path="/SpecialPromotionPage" element={<SpecialPromotionPage/>} />
            <Route path="/DiscountListPage" element={<DiscountListPage/>} />
            <Route path="/DiscountCOPage" element={<DiscountCOPage/>} />
            <Route path="/DistributionPage" element={<DistributionPage/>} />
            <Route path="/AdvancePromotionPage" element={<AdvancePromotionPage/>} />
            <Route path="/ShopPage" element={<ShopPage/>} />
            <Route path="/SaleManagementPage" element={<SaleManagementPage/>} />
            <Route path="/RoleManagementPage" element={<RoleManagementPage/>} />
            <Route path="/AddNewSale" element={<AddNewSale/>} />
            <Route path="/AddDiscountCOPage" element={<AddDiscountCOPage/>} />
            <Route path="/AddRoleManage" element={<AddRoleManage/>} />
            <Route path="*" element={<PageNotFound />} />
           
          </Routes>
        </Layouts>
      ) : (
        <>
          <Routes>
            <Route index element={<AuthPage />} />
            <Route path="/ErrorLoginPage" element={<ErrorLoginPage />} />
          </Routes>
        </>
      )}

    </BrowserRouter>
  );
};

export default WebRoutes;
