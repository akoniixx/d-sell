import { Layout } from "antd";
import { Header, Content, Footer } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import React, { useState } from "react";
import { Navbar } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layouts from "./components/Layout/Layout";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import ErrorLoginPage from "./pages/ErrorPage/ErrorLoginPage";
import HomePage from "./pages/HomePage/HomePage";
import PageNotFound from "./pages/HttpError/PageNotFound";

const WebRoutes: React.FC<any> = () => {
  const [token, setToken] = useState('token');
  return (
    <BrowserRouter>
      {token ? (
        <Layouts>
          <Routes>
            <Route path="/" element={<HomePage />} />
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
