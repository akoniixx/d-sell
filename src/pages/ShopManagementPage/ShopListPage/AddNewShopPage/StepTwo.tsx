import { Col, Form, Row } from "antd";
import { FormInstance } from "antd/es/form/Form";
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
                name='telMain'
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
                <Input maxLength={10} />
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
                <Form.Item noStyle name='isActiveMain'>
                  <Switch size='small' />
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <Form.Item
                label='เบอร์โทรศัพท์ (สำรอง)*'
                name='telSub'
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
                <Input maxLength={10} />
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
                <Form.Item noStyle name='isActiveSub'>
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
                name='shopName'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกชื่อร้านค้า",
                  },
                ]}
              >
                <Input />
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
                ]}
              >
                <Input />
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
                <Input placeholder='กรอกจังหวัด' />
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
                <Input placeholder='กรอกอำเภอ/เขต' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='ตำบล/แขวง*'
                name='subDistrict'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกตำบล/แขวง",
                  },
                ]}
              >
                <Input placeholder='กรอกตำบล/แขวง' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label='รหัสไปษณีย์*'
                name='postalCode'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกรหัสไปษณีย์",
                  },
                ]}
              >
                <Input placeholder='กรอกรหัสไปษณีย์' />
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
                <Input placeholder='ระบุที่อยู่' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='ตำแหน่ง Latitude*'
                name='latitude'
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
                name='longtitude'
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
