import { MenuProps, Menu, Breadcrumb, Row, Col, Button, Space } from "antd";
import Layout, { Content, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import React, { Children, useEffect, useState } from "react";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
  TagOutlined,
  UserOutlined,
  FundOutlined,
  ContainerOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import { Link, useNavigate } from "react-router-dom";
import icon from "../../resource/icon";
import { useRecoilValue } from "recoil";
import { profileAtom } from "../../store/ProfileAtom";
import { useLocalStorage } from "../../hook/useLocalStorage";
import { getCompanyName } from "../../utility/CompanyName";
import styled, { css } from "styled-components";
import MenuItem from "antd/lib/menu/MenuItem";
import MenuSider from "../MenuSider/MenuSider";
import Text from "../Text/Text";

const ImageStyled = styled.img<{ isOpen: boolean }>`
  ${(props) =>
    props.isOpen
      ? css`
          transition: all 0.5s ease;
          transform: rotate(180deg);
        `
      : css`
          transition: all 0.5s ease;
          transform: rotate(0deg);
        `}
`;

const Layouts: React.FC<any> = ({ children }) => {
  const [size, setSize] = useState<SizeType>("large");
  const profile = useRecoilValue<any>(profileAtom);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const [persistedProfile] = useLocalStorage("profile", []);

  const pathLists = [
    {
      path: "/OrderPage",
      name: "order",
      title: "Order Management",
      subMenu: [],
    },
    {
      path: "/SalePage",
      name: "approveOrder",
      title: "Approve Order",
      subMenu: [
        {
          path: "/SpecialRequestPage",
          name: "specialRequest",
          title: "Special Request",
        },
        {
          path: "/SpecialPromotionPage",
          name: "specialPromotion",
          title: "Special Promotion",
        },
        {
          path: "/AdvancePromotionPage",
          name: "advancePromotion",
          title: "Advance Promotion",
        },
      ],
    },
    {
      path: "/PromotionPage",
      name: "promotion",
      title: "Promotion Setting",
      subMenu: [],
    },
    {
      path: "/DiscountListPage",
      name: "discountList",
      title: "Discount (CO)",
      subMenu: [
        {
          path: "/DiscountCOPage",
          name: "discountCO",
          title: "Discount CO",
        },
      ],
    },
    {
      path: "/PriceListPage",
      name: "priceList",
      title: "Price List",
      subMenu: [
        {
          path: "/DistributionPage",
          name: "distribution",
          title: "Distribution (DIS)",
        },
        {
          path: "/ShopPage",
          name: "shop",
          title: "Shop",
        },
      ],
    },
    {
      path: "/UserPage",
      name: "user",
      title: "User",
      subMenu: [
        {
          path: "/SaleManagementPage?status=all",
          name: "saleManagement",
          title: "Sale Management",
        },
        {
          path: "/RoleManagementPage",
          name: "roleManagement",
          title: "Role Management",
        },
      ],
    },
  ];

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    const url = window.location.href;
    const arr = url.split("/");
    const resultUrlHost = arr[0] + "//" + arr[2];
    window.location.href =
      "https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=" +
      resultUrlHost;
  };
  const toggleButton = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "0.1px",
          borderBottomColor: "#E0E0E0",
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          borderBottomStyle: "solid",
          boxShadow: "-1px 2px 30px 0px rgba(0,0,0,0.8)",
        }}
      >
        <Link to='/'>
          <img src={icon.logoHeader} width={140} />
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text level={5}>
            {persistedProfile?.firstname} {persistedProfile?.lastname}
          </Text>
          <Text color='Text3' level={5}>{`, ${getCompanyName(
            persistedProfile?.companyId || "icpl",
          )}`}</Text>
          <Button onClick={() => logout()} icon={<LogoutOutlined />} size={size} />
        </div>
      </Header>
      <Layout>
        <Sider width={220} className='site-layout-background' collapsed={!isOpenSidebar}>
          <div
            style={{
              cursor: "pointer",
              width: "fit-content",
              position: "absolute",
              right: -16,
              top: 8,
              backgroundColor: "#FFFFFF",
              padding: 4,
              borderRadius: "50%",
              border: "1px solid #E5EAEE",
            }}
            onClick={() => toggleButton()}
          >
            <ImageStyled
              src={icon.backIcon}
              style={{
                width: 30,
                height: 30,
              }}
              isOpen={isOpenSidebar}
            />
          </div>
          <MenuSider lists={pathLists} isOpenSidebar={isOpenSidebar} />
        </Sider>
        <Layout>
          <Content
            className='site-layout-background'
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Layouts;
