import { MenuProps, Menu, Breadcrumb } from "antd";
import Layout, { Content, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import React, { Children } from "react";
import {
  HomeOutlined
} from "@ant-design/icons";
import HomePage from "../../pages/HomePage/HomePage";
import { Link } from "react-router-dom";
import { AuthPage } from "../../pages/AuthPage/AuthPage";

const Layouts: React.FC<any> = ({ children }) => {
  return (
    <Layout style={{height:"100vh"}}>
      <Header></Header>
      <Layout>
        <Sider width={200} className="site-layout-background" >
          <Menu
            mode="inline"
            /* defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]} */
            style={{ height: "100%", borderRight: 0 }}
          >

            <Menu.Item >
            <HomeOutlined />
              <span>Home</span>
            </Menu.Item>
            <Menu.Item >
              <span>Order</span>
            </Menu.Item>

            <Menu.SubMenu title={<span>User</span>} key={"sub1"}>
              <Menu.Item >
                <span>Sale Management</span>
              </Menu.Item>
              <Menu.Item >
                <span>Role Management</span>
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
