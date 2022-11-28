import React, { Fragment } from "react";
import Switch from "../../../../components/Switch/Switch";
import Text from "../../../../components/Text/Text";
import { defaultPropsForm } from "../../../../utility/DefaultProps";
import styled from "styled-components";
import CardSection from "../../../../components/Card/CardSection";
import Input from "../../../../components/Input/Input";
import Radio from "../../../../components/Radio/Radio";
import Select from "../../../../components/Select/Select";
import { Col, Form, Row } from "antd";
import color from "../../../../resource/color";
import Button from "../../../../components/Button/Button";

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
const onFinish = async (values: any) => {
  console.log("Success:", values);
};
function StepOne() {
  const [form] = Form.useForm();
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
  return (
    <Fragment>
      <BottomSection>
        <CardSection
          title='ICP Ladda'
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
              <Switch />
            </div>
          }
        >
          <div
            style={{
              padding: 16,
            }}
          >
            <Form
              {...defaultPropsForm}
              form={form}
              onFinish={onFinish}
              initialValues={{
                typeShop: "SD",
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
                <Radio
                  items={[
                    {
                      label: "Dealer",
                      value: "DL",
                    },
                    {
                      label: "Sub Dealer",
                      value: "SD",
                    },
                  ]}
                />
              </Form.Item>
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
                      data={[]}
                      style={{
                        width: "45%",
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
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
