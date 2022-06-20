import { MenuProps, Menu, Breadcrumb, Row, Col, Button, Space } from "antd";
import Layout, { Content, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import React, { Children, useState } from "react";
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
import HomePage from "../../pages/HomePage/HomePage";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import { Link, useNavigate } from "react-router-dom";
import { AuthPage } from "../../pages/AuthPage/AuthPage";
import icon from "../../resource/icon";
import { useRecoilValue } from "recoil";
import { msal } from "../../store/Msal";
import { profileAtom } from "../../store/ProfileAtom";
import { useLocalStorage } from "../../hook/useLocalStorage";
import { getCompanyName } from "../../utility/CompanyName";

const Layouts: React.FC<any> = ({ children }) => {
  const style: React.CSSProperties = {
    marginRight: "10px",
    fontFamily: "Sukhumvit set"
  };
  const [size, setSize] = useState<SizeType>("large");
  const profile = useRecoilValue<any>(profileAtom);
  const [persistedProfile, setPersistedProfile] = useLocalStorage(
    "profile",
    []
  );
  let navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    var url = window.location.href;
    var arr = url.split("/");
    var resultUrlHost = arr[0] + "//" + arr[2];
    window.location.href =
      "https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=" +
      resultUrlHost;
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        className="brand"
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "0.1px",
          borderBottomColor: "#E0E0E0",
          borderBottomStyle: "solid",
          fontFamily: "Sukhumvit set"
        }}
      >
        <Row>
          <Col span={18}>
            <Link to="/">
              <img src={icon.logoHeader} width={140} />
            </Link>
          </Col>
          <Space>
            <Col>
              <span style={style}>
                {/*  <b> {profile.firstname + ' ' + profile.firstname + ' ' + '(' + profile.firstname + ')' } </b> */}
                <b> {persistedProfile.firstname + ' ' + persistedProfile.lastname + ' ' + '(' + getCompanyName(persistedProfile.companyId) + ')' } </b> 
              </span>
            </Col>
            <Col span={2}>
              <Button
                onClick={() => logout()}
                icon={<LogoutOutlined />}
                size={size}
              />
            </Col>
          </Space>
        </Row>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultOpenKeys={["order"]}
            style={{ height: "100%", borderRight: 0, paddingTop: 30 , fontFamily: "Sukhumvit set", fontSize: "16px"}}
          >
            <Menu.Item key={"order"} icon={<ShoppingCartOutlined />}>
              <Link to="/OrderPage">
                <span>Order</span>
              </Link>
            </Menu.Item>
            <Menu.SubMenu
              icon={<ContainerOutlined />}
              title={<span>Approve Order</span>}
              key={"sub1"}
            >
              <Menu.Item style={{}}>
                <Link to="/SpecialRequestPage">
                  <span>Special Request</span>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/SpecialPromotionPage">
                  <span>Special Promotion</span>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/AdvancePromotionPage">
                  <span>Advance Promotion</span>
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
              icon={<GiftOutlined />}
              title={<span>Promotion</span>}
              key={"sub2"}
            ></Menu.SubMenu>
            <Menu.SubMenu
              icon={<TagOutlined />}
              title={<span>Discount (CO)</span>}
              key={"sub3"}
            >
              <Menu.Item>
                <Link to="/DiscountListPage">
                  <span>Discount Lists</span>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/DiscountCOPage">
                  <span>Discount CO</span>
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
              icon={<FundOutlined />}
              title={<span>Price List</span>}
              key={"sub4"}
            >
              <Menu.Item>
                <Link to="/DistributionPage">
                  <span>Distribution (DIS)</span>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/ShopPage">
                  <span>Shop</span>
                </Link>
              </Menu.Item>
            </Menu.SubMenu>

            <Menu.SubMenu
              icon={<UserOutlined />}
              title={<span>User</span>}
              key={"sub5"}
            >
              <Menu.Item>
                <Link to="/SaleManagementPage">
                  <span>Sale Management</span>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/RoleManagementPage">
                  <span>Role Management</span>
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Content
            className="site-layout-background"
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
