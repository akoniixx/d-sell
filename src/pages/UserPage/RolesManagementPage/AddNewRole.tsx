import { Col, Form, Row } from "antd";
import React from "react";
import styled from "styled-components";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import CheckboxGroup from "../../../components/CheckboxGroup/CheckboxGroup";
import Input from "../../../components/Input/Input";
import TextArea from "../../../components/Input/TextArea";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Text from "../../../components/Text/Text";
import color from "../../../resource/color";
import { defaultPropsForm } from "../../../utility/DefaultProps";
import { websiteBackOffice, saleCodaSale, saleCodaShop } from "../../../utility/StaticPermission";

const CardRole = styled.div`
  border: 1px solid ${color.background1};
  border-radius: 8px;
  margin-bottom: 24px;
`;
const Bottom = styled(Row)`
  border-top: 1px solid ${color.background2};
  padding-top: 16px;
  margin-top: 40px;
`;
export default function AddNewRole(): JSX.Element {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log(values);
  };
  const [visible, setVisible] = React.useState(false);
  const onClickSelectAllBo = () => {
    form.setFieldsValue({
      orderManagement: websiteBackOffice.orderManagement.map((el) => el.value),
      specialRequest: websiteBackOffice.specialRequest.map((el) => el.value),
      promotionSetting: websiteBackOffice.promotionSetting.map((el) => el.value),
      discountCo: websiteBackOffice.discountCo.map((el) => el.value),
      priceListX10: websiteBackOffice.priceListX10.map((el) => el.value),
      saleManagement: websiteBackOffice.saleManagement.map((el) => el.value),
      roleManagement: websiteBackOffice.roleManagement.map((el) => el.value),
    });
  };
  const onClearAllBo = () => {
    form.setFieldsValue({
      orderManagement: [],
      specialRequest: [],
      promotionSetting: [],
      discountCo: [],
      priceListX10: [],
      saleManagement: [],
      roleManagement: [],
    });
  };
  const onClickSelectAllSale = () => {
    form.setFieldsValue({
      createOrder: saleCodaSale.createOrder.map((el) => el.value),
      history: saleCodaSale.history.map((el) => el.value),
      feature: saleCodaSale.feature.map((el) => el.value),
      notification: saleCodaSale.notification.map((el) => el.value),
      profile: saleCodaSale.profile.map((el) => el.value),
    });
  };
  const onClearAllSale = () => {
    form.setFieldsValue({
      createOrder: [],
      history: [],
      feature: [],
      notification: [],
      profile: [],
    });
  };
  const onClickSelectAllShop = () => {
    form.setFieldsValue({
      order: saleCodaShop.order.map((el) => el.value),
    });
  };
  const onClearAllShop = () => {
    form.setFieldsValue({
      order: [],
    });
  };
  return (
    <CardContainer>
      <PageTitleNested title='เพิ่มชื่อตำแหน่ง' />
      <Form
        {...defaultPropsForm}
        style={{
          marginTop: 32,
        }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label='ชื่อตำแหน่ง' name='name'>
          <Input placeholder='ระบุชื่อตำแหน่ง' />
        </Form.Item>
        <Form.Item
          label='อธิบายชื่อตำแหน่ง'
          name='description'
          style={{
            marginBottom: 0,
          }}
          className='ant-form-no-margin-bottom'
        >
          <TextArea placeholder='ระบุคำอธิบาย' />
        </Form.Item>
        <Row style={{ padding: " 16px 0" }}>
          <Text fontWeight={700}>ตั้งค่าสิทธิการใช้งานแพลตฟอร์มต่างๆ ของ Sellcoda</Text>
        </Row>
        <CardRole>
          <Row
            style={{
              justifyContent: "space-between",
              padding: 16,
              alignItems: "center",
              backgroundColor: color.background1,
            }}
          >
            <Text fontWeight={700}>Website Backoffice</Text>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
              }}
            >
              <Button
                title='เลือกทั้งหมด'
                style={{
                  width: 96,
                  padding: "2px 4px",
                }}
                onClick={onClickSelectAllBo}
                height={32}
              />
              <Button
                title='ล้าง'
                onClick={onClearAllBo}
                typeButton='primary-light'
                style={{
                  width: 96,
                  padding: "4px 8px",
                }}
                height={32}
              />
            </div>
          </Row>
          <div
            style={{
              padding: 24,
            }}
          >
            <Row justify={"space-between"}>
              <Col span={8}>
                <Form.Item noStyle name='orderManagement'>
                  <CheckboxGroup data={websiteBackOffice.orderManagement} name='Order Management' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item noStyle name='specialRequest'>
                  <CheckboxGroup data={websiteBackOffice.specialRequest} name='Special Request' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item noStyle name='promotionSetting'>
                  <CheckboxGroup
                    data={websiteBackOffice.promotionSetting}
                    name='Promotion Setting'
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
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item noStyle name='priceListX10'>
                  <CheckboxGroup data={websiteBackOffice.priceListX10} name='Price List X+10' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item noStyle name='saleManagement'>
                  <CheckboxGroup data={websiteBackOffice.saleManagement} name='Sale Management' />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"space-between"}>
              <Col span={8}>
                <Form.Item noStyle name='roleManagement'>
                  <CheckboxGroup data={websiteBackOffice.roleManagement} name='Role Management' />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </CardRole>
        <CardRole>
          <Row
            style={{
              justifyContent: "space-between",
              padding: 16,
              alignItems: "center",
              backgroundColor: color.background1,
            }}
          >
            <Text fontWeight={700}>SaleCoda - Sale</Text>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
              }}
            >
              <Button
                title='เลือกทั้งหมด'
                onClick={onClickSelectAllSale}
                style={{
                  width: 96,
                  padding: "2px 4px",
                }}
                height={32}
              />
              <Button
                title='ล้าง'
                onClick={onClearAllSale}
                typeButton='primary-light'
                style={{
                  width: 96,
                  padding: "4px 8px",
                }}
                height={32}
              />
            </div>
          </Row>
          <div
            style={{
              padding: 24,
            }}
          >
            <Row justify={"space-between"}>
              <Col span={8}>
                <Form.Item noStyle name='createOrder'>
                  <CheckboxGroup data={saleCodaSale.createOrder} name='Create Order' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item noStyle name='history'>
                  <CheckboxGroup data={saleCodaSale.history} name='History' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item noStyle name='feature'>
                  <CheckboxGroup data={saleCodaSale.feature} name='Feature' />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"space-between"}>
              <Col span={8}>
                <Form.Item noStyle name='notification'>
                  <CheckboxGroup data={saleCodaSale.notification} name='Notification' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item noStyle name='profile'>
                  <CheckboxGroup data={saleCodaSale.profile} name='Profile' />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </CardRole>
        <CardRole>
          <Row
            style={{
              justifyContent: "space-between",
              padding: 16,
              alignItems: "center",
              backgroundColor: color.background1,
            }}
          >
            <Text fontWeight={700}>SaleCoda - Shop</Text>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
              }}
            >
              <Button
                title='เลือกทั้งหมด'
                style={{
                  width: 96,
                  padding: "2px 4px",
                }}
                onClick={onClickSelectAllShop}
                height={32}
              />
              <Button
                onClick={onClearAllShop}
                title='ล้าง'
                typeButton='primary-light'
                style={{
                  width: 96,
                  padding: "4px 8px",
                }}
                height={32}
              />
            </div>
          </Row>
          <div
            style={{
              padding: 24,
            }}
          >
            <Row justify={"space-between"}>
              <Col span={8}>
                <Form.Item noStyle name='order'>
                  <CheckboxGroup data={saleCodaShop.order} name='Order' />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </CardRole>
        <Bottom>
          <Col span={22}>
            <Text color='Text3' level={6} fontFamily='Sarabun'>
              โปรดตรวจสอบข้อมูลพนักงานก่อนบันทึก
            </Text>
          </Col>
          <Col span={2}>
            <Button
              title='บันทึก'
              onClick={() => {
                setVisible(true);
              }}
            />
          </Col>
        </Bottom>
        <ConfirmModal
          visible={visible}
          onConfirm={() => {
            form.submit();
            setVisible(false);
          }}
          onCancel={() => {
            setVisible(false);
          }}
          title='ยืนยันการบันทึกข้อมูล'
          desc='โปรดยืนยันการบันทึกข้อมูลเพิ่มตำแหน่งชื่อ'
        />
      </Form>
    </CardContainer>
  );
}
