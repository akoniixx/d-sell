import { Col, Form, Row } from "antd";
import { FormInstance } from "antd/es/form/Form";
import moment from "moment";
import { Fragment } from "react";
import styled from "styled-components";
import Button from "../../../../components/Button/Button";
import DatePicker from "../../../../components/DatePicker/DatePicker";
import Input from "../../../../components/Input/Input";
import InputHyphen from "../../../../components/Input/InputHyphen";
import Select from "../../../../components/Select/Select";
import Switch from "../../../../components/Switch/Switch";
import Text from "../../../../components/Text/Text";
import color from "../../../../resource/color";

const BottomSection = styled.div`
  padding: 8px 24px 24px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;
const Footer = styled.div`
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
interface Props {
  form: FormInstance<any>;
  onClickBack: () => void;
}
function StepTwo({ form, onClickBack }: Props): JSX.Element {
  const isHaveDealer = form.getFieldValue("isHaveDealer");

  return (
    <Fragment>
      <BottomSection>
        <Text fontWeight={700}>รายละเอียดข้อมูลบุคคล (เจ้าของร้าน)</Text>
        <Row
          gutter={16}
          style={{
            marginTop: 16,
          }}
        >
          <Col span={4}>
            <Form.Item
              name='nametitle'
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
              name='idCard'
              label='เลขบัตรประชาชน*'
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกเลขบัตรประชาชน",
                },
                {
                  pattern: new RegExp(/^[0-9]{13}$/),
                  message: "กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง",
                },
              ]}
            >
              <InputHyphen />
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
              rules={
                [
                  // {
                  //   required: true,
                  //   message: "กรุณากรอกรหัสสมาชิก",
                  // },
                ]
              }
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='createDate'
              label='วันที่เริ่มเป็นสมาชิก*'
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกวันที่เริ่มเป็นสมาชิก",
                },
              ]}
            >
              <DatePicker
                enablePast
                disabled
                disabledDate={(current) => {
                  return current && current > moment().endOf("day");
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <div
          style={{
            backgroundColor: color.background2,
            padding: "16px 24px 0px",
            borderRadius: 8,
            display: "flex",
            margin: "16px 0px",
            flexDirection: "column",
          }}
        >
          <Text fontWeight={700}>
            เบอร์โทรศัพท์สำหรับเข้าสู่ระบบ Application Sellcoda (Shop App)
          </Text>
          <Row
            gutter={32}
            style={{
              marginTop: 16,
            }}
          >
            <Col span={12} style={{ position: "relative" }}>
              <Form.Item
                name='telephone'
                label='เบอร์โทรศัพท์ (หลัก)*'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกเบอร์โทรศัพท์",
                  },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง",
                  },
                ]}
              >
                <Input maxLength={10} disabled={isHaveDealer} />
              </Form.Item>
              <div
                style={{
                  top: 0,
                  right: 16,
                  position: "absolute",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Text fontFamily='Sarabun' level={6}>
                  เปิดใช้งาน :
                </Text>
                <Form.Item noStyle name='isActive'>
                  <Switch size='small' />
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <Form.Item
                label='เบอร์โทรศัพท์ (สำรอง)'
                name='secondtelephone'
                rules={[
                  // {
                  //   required: true,
                  //   message: "กรุณากรอกเบอร์โทรศัพท์",
                  // },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง",
                  },
                  {
                    validator: (_, value) => {
                      if (value !== form.getFieldValue("telephone")) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("เบอร์โทรศัพท์ซ้ำกัน"));
                    },
                  },
                ]}
              >
                <Input maxLength={10} disabled={isHaveDealer} />
              </Form.Item>
              <div
                style={{
                  top: 0,
                  right: 16,
                  position: "absolute",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Text fontFamily='Sarabun' level={6}>
                  เปิดใช้งาน :
                </Text>
                <Form.Item noStyle name='isPrimary'>
                  <Switch size='small' />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </div>
        <div
          style={{
            display: "flex",
            padding: "16px 0",
            flexDirection: "column",
          }}
        >
          <Text
            fontWeight={700}
            style={{
              marginBottom: 16,
            }}
          >
            รายละเอียดข้อมูลร้านค้า
          </Text>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                label='ชื่อร้านค้า*'
                name='customerName'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกชื่อร้านค้า",
                  },
                ]}
              >
                <Input disabled={isHaveDealer} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='หมายเลขนิติบุคคล*'
                name='taxId'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกหมายเลขนิติบุคคล",
                  },
                  {
                    pattern: /^[0-9]{13}$/,
                    message: "กรุณากรอกหมายเลขนิติบุคคลให้ถูกต้อง",
                  },
                ]}
              >
                <Input maxLength={13} disabled={isHaveDealer} />
              </Form.Item>
            </Col>
          </Row>
          <Text
            fontWeight={700}
            style={{
              marginBottom: 16,
            }}
          >
            ที่อยู่ร้านค้า
          </Text>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label='จังหวัด*'
                name='province'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกจังหวัด",
                  },
                ]}
              >
                <Input disabled={isHaveDealer} placeholder='กรอกจังหวัด' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='อำเภอ/เขต*'
                name='district'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกอำเภอ เขต",
                  },
                ]}
              >
                <Input disabled={isHaveDealer} placeholder='กรอกอำเภอ/เขต' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='ตำบล/แขวง*'
                name='subdistrict'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกตำบล/แขวง",
                  },
                ]}
              >
                <Input disabled={isHaveDealer} placeholder='กรอกตำบล/แขวง' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='รหัสไปรษณีย์*'
                name='postcode'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกรหัสไปษณีย์",
                  },
                  {
                    pattern: /^[0-9]{5}$/,
                    message: "กรุณากรอกรหัสไปษณีย์ให้ถูกต้อง",
                  },
                ]}
              >
                <Input disabled={isHaveDealer} placeholder='กรอกรหัสไปษณีย์' maxLength={5} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                label='ที่อยู่ (บ้านเลขที่ หมู่ ซอย ชั้น อาคาร )*'
                name='address'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกที่อยู่",
                  },
                ]}
              >
                <Input disabled={isHaveDealer} placeholder='ระบุที่อยู่' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='ตำแหน่ง Latitude*'
                name='lat'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกตำแหน่ง Latitude",
                  },
                ]}
              >
                <Input placeholder='ระบุตำแหน่ง Latitude' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='ตำแหน่ง Longitude*'
                name='lag'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกตำแหน่ง Longitude",
                  },
                ]}
              >
                <Input placeholder='ระบุตำแหน่ง Longitude' />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <Footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Button
            title='ย้อนกลับ'
            onClick={onClickBack}
            typeButton='primary-light'
            style={{
              width: 136,
              height: 40,
              display: "flex",
              justifyContent: "center",
            }}
          />
          <Button
            title='บันทึก'
            onClick={() => {
              form.submit();
            }}
            style={{
              width: 136,
              height: 40,
              display: "flex",
              justifyContent: "center",
            }}
          />
        </Footer>
      </BottomSection>
    </Fragment>
  );
}

export default StepTwo;
