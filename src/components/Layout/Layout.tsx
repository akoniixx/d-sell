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
import jwtDecode from "jwt-decode";
import moment from "moment";

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
    path: "/order",
    name: "order",
    permission: null,
    title: "จัดการคำสั่งซื้อ",
    subMenu: [],
  },
  {
    path: "/special-request",
    name: "specialRequest",
    permission: null,
    title: "ยืนยันคำสั่งซื้อ",
    subMenu: [],
  },
  {
    path: "/PromotionPage",
    name: "promotion",
    title: "ตั้งค่าโปรโมชั่น",
    subMenu: [
      {
        path: "/promotion",
        name: "promotionList",
        title: "รายการโปรโมชัน",
        permission: null,
      },
      {
        path: "/freebies",
        name: "freebiesList",
        title: "รายการของแถม",
        permission: null,
      },
    ],
    permission: null,
  },
  {
    path: "/discount",
    name: "discountList",
    title: "ส่วนลด (CO)",
    permission: null,
    // permission: {
    //   name: "discountCo",
    //   action: "view",
    // },
    subMenu: [
      {
        path: "/list",
        name: "discountList",
        title: "รายการส่วนลด",
      },
      {
        path: "/customerList",
        name: "customerList",
        title: "ส่วนลด CO รายร้าน",
      },
      {
        path: "/conditionCo",
        name: "conditionCo",
        title: "เงื่อนไข CO",
      },
    ],
  },
  {
    path: "/price",
    name: "price",
    title: "ราคาสินค้า",
    permission: null,
    subMenu: [
      {
        path: "/list",
        name: "discountList",
        title: "ราคาสินค้าเฉพาะร้าน",
      },
    ],
  },
  {
    path: "/PriceListPage/DistributionPage",
    name: "priceList",
    title: "รายการสินค้า",
    permission: null,
    subMenu: [],
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
    title: "จัดการผู้ใช้งาน",
    permission: {
      name: ["roleManagement", "saleManagement"],
      action: "view",
    },
    subMenu: [
      {
        path: "/SaleManagementPage?status=all",
        name: "saleManagement",
        title: "รายชื่อผู้ใช้งาน",
        permission: {
          name: "saleManagement",
          action: "view",
        },
      },
      {
        path: "/RoleManagementPage",
        name: "roleManagement",
        title: "จัดการสิทธิ",
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
      const token = localStorage.getItem("token");
      const decoded: {
        exp: number;
      } = await jwtDecode(JSON.parse(token || "") || "");
      const isExpired = moment().isAfter(moment.unix(decoded.exp));
      localStorage.clear();
      sessionStorage.clear();
      const url = window.location.href;
      const arr = url.split("/");
      const resultUrlHost = arr[0] + "//" + arr[2];
      if (isExpired) {
        window.location.href =
          "https://login.microsoftonline.com/common/oauth2/v2.0/logout?redirect_uri=" +
          resultUrlHost;
      } else {
        window.location.href =
          "https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=" +
          resultUrlHost;
      }
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
        <Content
          style={{
            padding: 24,
            margin: 0,
            height: "100%",
            width: "100%",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Layouts;
