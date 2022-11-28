import { Col, Form, Row } from "antd";
import React, { Fragment } from "react";
import styled from "styled-components";
import DatePicker from "../../../../components/DatePicker/DatePicker";
import Input from "../../../../components/Input/Input";
import InputHyphen from "../../../../components/Input/InputHyphen";
import Select from "../../../../components/Select/Select";
import Text from "../../../../components/Text/Text";
import color from "../../../../resource/color";
import { defaultPropsForm } from "../../../../utility/DefaultProps";

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
const staticData = [
  {
    label: "นางสาว",
    value: "นางสาว",
    key: "1",
  },
  {
    label: "นาง",
    value: "นาง",
    key: "2",
  },
  {
    label: "นาย",
    value: "นาย",
    key: "3",
  },
];
function StepTwo(): JSX.Element {
  const [form] = Form.useForm();
  return (
    <Fragment>
      <BottomSection>
        <Form {...defaultPropsForm} form={form}>
          <Text fontWeight={700}>รายละเอียดข้อมูลบุคคล (เจ้าของร้าน)</Text>
          <Row
            gutter={16}
            style={{
              marginTop: 16,
            }}
          >
            <Col span={4}>
              <Form.Item
                name='prefixName'
                label='คำนำหน้าชื่อ*'
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกคำนำหน้าชื่อ",
                  },
                ]}
              >
                <Select data={staticData} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name='firstname'
                label='ชื่อจริง*'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกชื่อจริง",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name='lastname'
                label='นามสกุล*'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกนามสกุล",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name='personalId'
                label='เลขบัตรประชาชน*'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกเลขบัตรประชาชน",
                  },
                  {
                    pattern: /^[0-9]{1}-[0-9]{5}-[0-9]{4}-[0-9]{3}$/,
                    message: "กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง",
                  },
                ]}
              >
                <InputHyphen maxLength={16} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='email'
                label='อีเมล*'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกอีเมล",
                  },
                  {
                    type: "email",
                    message: "กรุณากรอกอีเมลให้ถูกต้อง",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='memberId'
                label='รหัสสมาชิก*'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกรหัสสมาชิก",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='memberStartDate'
                label='วันที่เริ่มเป็นสมาชิก*'
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกวันที่เริ่มเป็นสมาชิก",
                  },
                ]}
              >
                <DatePicker enablePast />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </BottomSection>
    </Fragment>
  );
}

export default StepTwo;
