import { Button } from "antd";
import Layout, { Content, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import React, { useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import icon from "../../resource/icon";
import { useLocalStorage } from "../../hook/useLocalStorage";
import { getCompanyName } from "../../utility/CompanyName";
import styled, { css } from "styled-components";
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

export const pathLists = [
  {
    path: "/OrderPage",
    name: "order",
    permission: {
      name: "orderManagement",
      action: "view",
    },
    title: "Order Management",
    subMenu: [],
  },
  // {
  //   path: "/SalePage",
  //   name: "approveOrder",
  //   title: "Approve Order",
  //   permission: null,
  //   subMenu: [
  //     {
  //       path: "/SpecialRequestPage",
  //       name: "specialRequest",
  //       title: "Special Request",
  //       permission: {
  //         name: "specialRequest",
  //         action: "view",
  //       },
  //     },
  //     {
  //       path: "/SpecialPromotionPage",
  //       name: "specialPromotion",
  //       title: "Special Promotion",
  //       permission: {
  //         name: "specialRequest",
  //         action: "view",
  //       },
  //     },
  //     {
  //       path: "/AdvancePromotionPage",
  //       name: "advancePromotion",
  //       title: "Advance Promotion",
  //       permission: {
  //         name: "specialRequest",
  //         action: "view",
  //       },
  //     },
  //   ],
  // },
  {
    path: "/PromotionPage",
    name: "promotion",
    title: "Promotion Setting",
    subMenu: [],
    permission: {
      name: "specialPromotion",
      action: "view",
    },
  },
  {
    path: "/DiscountListPage",
    name: "discountList",
    title: "Discount (CO)",
    permission: {
      name: "discountCo",
      action: "view",
    },
    subMenu: [
      {
        path: "/DiscountCOPage",
        name: "discountCO",
        title: "Discount CO",
        permission: {
          name: "discountCo",
          action: "view",
        },
      },
    ],
  },
  {
    path: "/PriceListPage",
    name: "priceList",
    title: "Price List",
    permission: null,
    subMenu: [
      {
        path: "/DistributionPage",
        name: "distribution",
        permission: null,
        title: "Distribution (DIS)",
      },
      {
        path: "/ShopPage",
        name: "shop",
        title: "Shop",
        permission: null,
      },
    ],
  },
  {
    path: "/ShopManagementPage",
    name: "shopManagement",
    title: "จัดการร้านค้า",
    permission: null,
    subMenu: [
      {
        path: "/ShopListPage",
        name: "shopList",
        title: "รายชื่อร้านค้า",
        permission: null,
      },
      {
        path: "/ApproveTelPage",
        name: "approveTel",
        title: "อนุมัติเบอร์โทรศัพท์",
        permission: null,
      },
    ],
  },
  {
    path: "/UserPage",
    name: "user",
    title: "User",
    permission: {
      name: ["roleManagement", "saleManagement"],
      action: "view",
    },
    subMenu: [
      {
        path: "/SaleManagementPage?status=all",
        name: "saleManagement",
        title: "Sale Management",
        permission: {
          name: "saleManagement",
          action: "view",
        },
      },
      {
        path: "/RoleManagementPage",
        name: "roleManagement",
        title: "Role Management",
        permission: {
          name: "roleManagement",
          action: "view",
        },
      },
    ],
  },
];
const Layouts: React.FC<any> = ({ children }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const [persistedProfile] = useLocalStorage("profile", []);

  const logout = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      const url = window.location.href;
      const arr = url.split("/");
      const resultUrlHost = arr[0] + "//" + arr[2];

      window.location.href =
        "https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=" +
        resultUrlHost;
    } catch (e) {
      console.log(e);
    }
  };
  const toggleButton = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
          <Text color='Text3' level={5}>{`, ${getCompanyName(persistedProfile?.company)}`}</Text>
          <Button onClick={() => logout()} icon={<LogoutOutlined />} size='large' />
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
