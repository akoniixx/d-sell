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
      }[] = JSON.parse(data.menus);

      const priceList = newMenus.find((item) => item.menuName === "priceList");
      const orderManagement = newMenus.find((item) => item.menuName === "orderManagement");
      const specialRequest = newMenus.find((item) => item.menuName === "specialRequest");
      const promotionSetting = newMenus.find((item) => item.menuName === "promotionSetting");
      const discountCo = newMenus.find((item) => item.menuName === "discountCo");
      const saleManagement = newMenus.find((item) => item.menuName === "saleManagement");
      const roleManagement = newMenus.find((item) => item.menuName === "roleManagement");
      form.setFieldsValue({
        priceList: priceList?.permission,
        orderManagement: orderManagement?.permission,
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
          <Row
            style={{
              justifyContent: "space-between",
              padding: 16,
              alignItems: "center",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              backgroundColor: color.background1,
            }}
          >
            <Text fontWeight={700}>Website Backoffice</Text>
          </Row>
          <div
            style={{
              padding: 24,
            }}
          >
            <Row justify={"space-between"}>
              <Col span={8}>
                <Form.Item noStyle name='orderManagement'>
                  <CheckboxGroup
                    data={websiteBackOffice.orderManagement}
                    name='Order Management'
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item noStyle name='specialRequest'>
                  <CheckboxGroup
                    data={websiteBackOffice.specialRequest}
                    name='Special Request'
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item noStyle name='promotionSetting'>
                  <CheckboxGroup
                    data={websiteBackOffice.promotionSetting}
                    name='Promotion Setting'
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"space-between"}>
              <Col span={8}>
                <Form.Item noStyle name='discountCo'>
                  <CheckboxGroup
                    data={websiteBackOffice.discountCo}
                    name='Discount (CO) / (ส่วนลดดูแลราคา)'
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item noStyle name='priceList'>
                  <CheckboxGroup
                    data={websiteBackOffice.priceListX10}
                    name='Price List X+10'
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item noStyle name='saleManagement'>
                  <CheckboxGroup
                    data={websiteBackOffice.saleManagement}
                    name='Sale Management'
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"space-between"}>
              <Col span={8}>
                <Form.Item noStyle name='roleManagement'>
                  <CheckboxGroup
                    data={websiteBackOffice.roleManagement}
                    name='Role Management'
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </CardRole>
      </Form>
    </CardContainer>
  );
}

export default DetailRole;
