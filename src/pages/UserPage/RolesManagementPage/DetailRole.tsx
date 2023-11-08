import { Col, Form, Row, Spin } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { CardContainer } from "../../../components/Card/CardContainer";
import CheckboxGroup from "../../../components/CheckboxGroup/CheckboxGroup";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Text from "../../../components/Text/Text";
import { roleDatasource } from "../../../datasource/RoleDatasource";
import color from "../../../resource/color";
import { profileAtom } from "../../../store/ProfileAtom";
import { defaultPropsForm } from "../../../utility/DefaultProps";
import { websiteBackOffice } from "../../../utility/StaticPermission";
import RolesList from "../../../components/RolesList/RolesList";
const CardRole = styled.div`
  border: 1px solid ${color.background1};
  border-radius: 8px;
  margin-bottom: 24px;
`;
function DetailRole() {
  const { roleId } = useParams();
  const profile = useRecoilValue(profileAtom);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery("roleDetail", async () => {
    return await roleDatasource.getRoleById(roleId, profile?.company);
  });
  useEffect(() => {
    if (data) {
      const newMenus: {
        menuName: string;
        permission: string[];
      }[] = typeof data.menues === "string" ? JSON.parse(data.menus) : data.menus;

      const discountCo = newMenus.find((item) => item.menuName === "discountCo");
      const freebieList = newMenus.find((item) => item.menuName === "freebieList");
      const manageOrder = newMenus.find((item) => item.menuName === "manageOrder");
      const manageStore = newMenus.find((item) => item.menuName === "manageStore");
      const manageUser = newMenus.find((item) => item.menuName === "manageUser");
      const priceSpecialExclusive = newMenus.find(
        (item) => item.menuName === "priceSpecialExclusive",
      );
      const productList = newMenus.find((item) => item.menuName === "productList");
      const promotionSetting = newMenus.find((item) => item.menuName === "promotionSetting");
      const specialRequest = newMenus.find((item) => item.menuName === "specialRequest");
      const saleManagement = newMenus.find((item) => item.menuName === "saleManagement");
      const roleManagement = newMenus.find((item) => item.menuName === "roleManagement");
      form.setFieldsValue({
        ...data,
        freebieList: freebieList?.permission,
        manageOrder: manageOrder?.permission,
        manageStore: manageStore?.permission,
        manageUser: manageUser?.permission,
        priceSpecialExclusive: priceSpecialExclusive?.permission,
        productList: productList?.permission,
        specialRequest: specialRequest?.permission,
        promotionSetting: promotionSetting?.permission,

        discountCo: discountCo?.permission,
        saleManagement: saleManagement?.permission,
        roleManagement: roleManagement?.permission,
      });
    }
  }, [form, data]);

  if (isLoading && !data) {
    return (
      <CardContainer
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size='large' />
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      <PageTitleNested title={`รายละเอียดบทบาท ${data.rolename}`} cutParams />
      <div
        style={{
          marginTop: 16,
        }}
      >
        <Row
          gutter={16}
          style={{
            marginBottom: 8,
          }}
        >
          <Col span={3}>
            <Text fontFamily='Sarabun' color='Text3'>
              ชื่อบทบาท
            </Text>
          </Col>
          <Col span={21}>
            <Text fontFamily='Sarabun'>{data.rolename}</Text>
          </Col>
        </Row>
        <Row
          gutter={16}
          style={{
            marginBottom: 8,
          }}
        >
          <Col span={3}>
            <Text fontFamily='Sarabun' color='Text3'>
              จำนวนสมาชิก
            </Text>
          </Col>
          <Col span={21}>
            <Text fontFamily='Sarabun'>{`${data?.countmember || 0} คน`}</Text>
          </Col>
        </Row>
        <Row
          gutter={16}
          style={{
            marginBottom: 8,
          }}
        >
          <Col span={3}>
            <Text fontFamily='Sarabun' color='Text3'>
              คำอธิบายบทบาท
            </Text>
          </Col>
          <Col span={21}>
            <Text fontFamily='Sarabun'>{data.roledescription}</Text>
          </Col>
        </Row>
        <Row
          gutter={16}
          style={{
            marginBottom: 8,
          }}
        >
          <Col span={3}>
            <Text fontFamily='Sarabun' color='Text3'>
              บันทึกอัปเดท
            </Text>
          </Col>
          <Col span={21}>
            <Text fontFamily='Sarabun'>{`${dayjs(data.updateDate).format("DD/MM/BBBB")} ${
              data.updateBy
            }`}</Text>
          </Col>
        </Row>
      </div>
      <Form form={form} {...defaultPropsForm}>
        <Row style={{ padding: " 16px 0" }}>
          <Text fontWeight={700}>สิทธิการใช้งานแพลตฟอร์มต่างๆ ของ Sellcoda</Text>
        </Row>
        <CardRole>
          <RolesList form={form} disabled />
        </CardRole>
      </Form>
    </CardContainer>
  );
}

export default DetailRole;
