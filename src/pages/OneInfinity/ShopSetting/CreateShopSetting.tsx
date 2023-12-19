import { ShopOutlined } from "@ant-design/icons";
import { Col, Divider, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import { CardContainer } from "../../../components/Card/CardContainer";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Permission from "../../../components/Permission/Permission";
import Text from "../../../components/Text/Text";
import { color } from "../../../resource";

const Header = styled(Col)`
  border-radius: 8px;
  background-color: ${color.background1};
  padding: 20px;
  //display: flex;
  //gap: 16px;
  align-items: center;
  width: "10%";
`;

export const CreateShopSetting: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEdit = pathSplit[3] !== "create";
  const id = pathSplit[3];
  return (
    <CardContainer>
      <PageTitleNested
        title={isEdit ? "รายการร้านค้า" : "เพิ่มร้านค้าจาก Navision"}
        showBack
        onBack={() => navigate(`/oneInfinity/shopSetting`)}
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการร้านค้า", path: `/oneInfinity/shopSetting` },
              {
                text: isEdit ? "รายการร้านค้า" : "เพิ่มร้านค้าจาก Navision",
                path: window.location.pathname,
              },
            ]}
          />
        }
      />
      <Divider />
      <Header>
        <Row gutter={16}>
          <Col span={2}>
            <ShopOutlined style={{ fontSize: "20px" }} />
          </Col>
          <Col span={10}>
            <Text fontSize={16} color='primary' fontWeight={600}>
              ร้านรวมใจการเกษตร
            </Text>
          </Col>
        </Row>
      </Header>
    </CardContainer>
  );
};
