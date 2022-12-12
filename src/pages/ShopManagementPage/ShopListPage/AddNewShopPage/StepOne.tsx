import React, { Fragment } from "react";
import Switch from "../../../../components/Switch/Switch";
import Text from "../../../../components/Text/Text";
import styled from "styled-components";
import CardSection from "../../../../components/Card/CardSection";
import Input from "../../../../components/Input/Input";
import Radio from "../../../../components/Radio/Radio";
import Select from "../../../../components/Select/Select";
import { Col, Form, FormInstance, Row } from "antd";
import color from "../../../../resource/color";
import Button from "../../../../components/Button/Button";
import { getCompanyImage, getCompanyName } from "../../../../utility/CompanyName";

const BottomSection = styled.div`
  padding: 8px 24px 24px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;
const Footer = styled(Row)`
  border-top: 1px solid ${color.background2};
  padding-top: 16px;

  margin-top: 40px;
`;

function StepOne({
  form,
  company,
}: {
  form: FormInstance<any>;
  company?: "ICPL" | "ICPI" | "ICPF" | "ICK";
}) {
  const typeShop = Form.useWatch("typeShop", form);
  const listSDMock = [
    {
      title: "ICP Fertilizer",
      type: "Dealer",
      idShop: "ICP001",
      zone: "C01",
    },
    {
      title: "ICP International",
      type: "Sub Dealer",
      idShop: "ICP002",
      zone: "C02",
    },
  ];

  const listRadio = [
    {
      label: "Dealer",
      value: "DL",
    },
    {
      label: "Sub Dealer",
      value: "SD",
    },
  ];
  const renderByCompany = () => {
    switch (company) {
      case "ICPL": {
        return (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='zone'
                label='เขต*'
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกเขต",
                  },
                ]}
              >
                <Select
                  data={[
                    {
                      label: "C01",
                      value: "C01",
                      key: "C01",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        );
      }
      case "ICPF": {
        return (
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name='productBrand'
                label='Product Brands*'
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือก Product Brands",
                  },
                ]}
              >
                <Select
                  data={[
                    {
                      label: "C01",
                      value: "C01",
                      key: "C01",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name='shopId'
                label='รหัสร้านค้า (ใน NAV)*'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกรหัสร้านค้า (ใน NAV)",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='zone'
                label='เขต*'
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกเขต",
                  },
                ]}
              >
                <Select
                  data={[]}
                  style={{
                    width: "45%",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        );
      }
      default: {
        return (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='shopId'
                label='รหัสร้านค้า (ใน NAV)*'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกรหัสร้านค้า (ใน NAV)",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='zone'
                label='เขต*'
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกเขต",
                  },
                ]}
              >
                <Select
                  data={[
                    {
                      label: "C01",
                      value: "C01",
                      key: "C01",
                    },
                  ]}
                  style={{
                    width: "45%",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        );
      }
    }
  };
  return (
    <Fragment>
      <BottomSection>
        <CardSection
          leftComponent={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                paddingLeft: 16,
              }}
            >
              <div
                style={{
                  height: 24,
                  width: 58,
                  position: "relative",
                  bottom: 4,
                }}
              >
                <img
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  src={getCompanyImage(company || "ICPL")}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <Text fontWeight={700}>{getCompanyName(company?.toString() || "")}</Text>
              </div>
            </div>
          }
          extra={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text fontFamily='Sarabun' level={6}>
                เปิดใช้งาน
              </Text>
              <Form.Item noStyle name='isActive'>
                <Switch />
              </Form.Item>
            </div>
          }
        >
          <div
            style={{
              padding: 16,
            }}
          >
            <Form.Item
              name='typeShop'
              label='ประเภทคู่ค้า*'
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกประเภทคู่ค้า",
                },
              ]}
            >
              <Radio items={company && company === "ICPL" ? listRadio.slice(1) : listRadio} />
            </Form.Item>
            {renderByCompany()}
          </div>
        </CardSection>
        {typeShop === "SD" && (
          <div
            style={{
              display: "flex",
              gap: 16,
              flexDirection: "column",
            }}
          >
            <Text fontWeight={700}>คู่ค้าบริษัทในเครือ ICP Group</Text>
            {listSDMock.map((item, idx) => {
              return (
                <Row key={idx}>
                  <Col span={2}>
                    <Text>Image Maybe</Text>
                  </Col>
                  <Col
                    span={22}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Text fontWeight={700}>{item.title}</Text>
                    <div style={{ display: "flex", gap: 16 }}>
                      <Text fontFamily='Sarabun'>
                        {`ประเภทคู่ค้า: `}
                        <Text color='primary' fontWeight={600}>
                          {item.type}
                        </Text>
                      </Text>
                      <Text fontFamily='Sarabun'>{`รหัสร้านค้า: ${item.idShop}`}</Text>
                      <Text fontFamily='Sarabun'>{`เขต: ${item.zone || "-"}`}</Text>
                    </div>
                  </Col>
                </Row>
              );
            })}
          </div>
        )}
      </BottomSection>
      <div
        style={{
          padding: "16px 24px 0px",
        }}
      >
        <Footer>
          <Col span={22}>
            <Text color='Text3' level={6} fontFamily='Sarabun'>
              โปรดตรวจสอบข้อมูลพนักงานก่อนบันทึก
            </Text>
          </Col>
          <Col span={2}>
            <Button
              title='ถัดไป'
              onClick={() => {
                form.submit();
              }}
            />
          </Col>
        </Footer>
      </div>
    </Fragment>
  );
}

export default StepOne;
