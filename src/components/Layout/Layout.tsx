import { Button } from "antd";
import Layout, { Content, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import React, { useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
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
    permission: ["manageOrder"],
    title: "จัดการคำสั่งซื้อ",
    subMenu: [],
  },
  {
    path: "/special-request",
    name: "specialRequest",
    permission: ["specialRequest"],
    title: "อนุมัติคำสั่งซื้อ",
    subMenu: [],
  },
  {
    path: "/PromotionPage/promotion",
    name: "promotion",
    title: "ตั้งค่าโปรโมชั่น",
    permission: ["promotionSetting"],
    subMenu: [],
  },
  {
    path: "/PromotionPage/promotionNoti",
    name: "promotionNoti",
    title: "แจ้งเตือนโปรโมชัน",
    permission: ["promotionSetting"],
    subMenu: [],
  },
  {
    path: "/freebies/freebies",
    name: "freebies",
    title: "รายการของแถม",
    subMenu: [],
    permission: ["freebieList"],
  },
  {
    path: "/discount",
    name: "discountList",
    title: "ส่วนลด (CO)",
    permission: ["discountCo"],
    subMenu: [
      {
        path: "/list",
        name: "discountList",
        title: "รายการส่วนลด",
        permission: "discountList",
      },
      {
        path: "/customerList",
        name: "customerList",
        title: "ส่วนลด CO รายร้าน",
        permission: "manageConditionStore",
      },
      {
        path: "/conditionCo",
        name: "conditionCo",
        title: "เงื่อนไข CO",
        permission: "manageCondition",
      },
    ],
  },
  {
    path: "/price/list",
    name: "price",
    title: "ราคาสินค้าเฉพาะร้าน",
    permission: ["priceSpecialExclusive"],
    subMenu: [],
  },
  {
    path: "/Productshop/list",
    name: "productshop",
    title: "สินค้าขายเฉพาะร้าน",
    permission: ["productshop"],
    subMenu: [],
  },
  {
    path: "/PriceListPage/DistributionPage",
    name: "priceList",
    title: "รายการสินค้า",
    permission: ["productList"],
    subMenu: [],
  },
  {
    path: "/ShopManagementPage",
    name: "shopManagement",
    title: "จัดการร้านค้า",
    permission: ["manageStore"],
    subMenu: [
      {
        path: "/ShopListPage",
        name: "shopList",
        title: "รายชื่อร้านค้า",
        permission: "storeList",
      },
      {
        path: "/ShopGroupPage",
        name: "shopGroup",
        title: "จัดกลุ่มร้านค้า",
        permission: "shopGroup",
      },
      {
        path: "/ApproveTelPage",
        name: "approveTel",
        title: "อนุมัติเบอร์โทรศัพท์",
        permission: "approvePhone",
      },
    ],
  },
  {
    path: "/news",
    name: "news",
    title: "ข่าวสาร",
    permission: ["news"],
    subMenu: [
      {
        path: "/list",
        name: "newsList",
        title: "รายการข่าวสาร",
        permission: "newsList",
      },
      {
        path: "/pin",
        name: "pinedNews",
        title: "ปักหมุดข่าวสาร",
        permission: "pinedNews",
      },
      {
        path: "/highlight",
        name: "highlightNews",
        title: "ข่าวสารไฮไลท์",
        permission: "highlightNews",
      },
    ],
  },
  {
    path: "/UserPage",
    name: "user",
    title: "จัดการผู้ใช้งาน",
    permission: ["manageUser"],
    subMenu: [
      {
        path: "/SaleManagementPage?status=all",
        name: "saleManagement",
        title: "รายชื่อผู้ใช้งาน",
        permission: "userList",
      },
      {
        path: "/RoleManagementPage",
        name: "roleManagement",
        title: "จัดการสิทธิ",
        permission: "manageRoles",
      },
    ],
  },
  {
     path: "/generalSettings",
    name: "generalSettings",
    title: "ตั้งค่า",
     permission: ["generalSettings"],
     subMenu: [
      {
        path: "/productBrandSetting",
        name: "productBrandSetting",
       title: "แบรนด์สินค้า",
         permission: "newsList",
       },
       {
         path: "/zoneSetting",
        name: "zoneSetting",
       title: "เขต",
        permission: "newsList",
      },
    ],
   },
  // {
  //   path: "/oneFinity",
  //   name: "oneFinity",
  //   title: "1 Finity",
  //   permission: ["oneFinity"],
  //   subMenu: [
  //     {
  //       path: "/brandSetting",
  //       name: "brandSetting",
  //       title: "แบรนด์สินค้า",
  //       permission: "brandSetting",
  //     },
  //     {
  //       path: "/shopSetting",
  //       name: "shopSetting",
  //       title: "จัดการร้านค้า",
  //       permission: "shopSetting",
  //     },
  //   ],
  // },
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
    <Layout style={{ minHeight: "100vh", flex: 1 }}>
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
            width: "fit-content",
            overflow: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Layouts;
