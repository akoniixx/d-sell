import { Col, Form, Row } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import Swal from "sweetalert2";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import CheckboxGroup from "../../../components/CheckboxGroup/CheckboxGroup";
import Input from "../../../components/Input/Input";
import TextArea from "../../../components/Input/TextArea";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Text from "../../../components/Text/Text";
import { roleDatasource } from "../../../datasource/RoleDatasource";
import color from "../../../resource/color";
import { profileAtom } from "../../../store/ProfileAtom";
import { defaultPropsForm } from "../../../utility/DefaultProps";
import { websiteBackOffice } from "../../../utility/StaticPermission";

interface FormData {
  rolename: string;
  roledescription?: string;
  priceList: string[];
  orderManagement: string[];
  specialRequest: string[];
  promotionSetting: string[];
  discountCo: string[];
  saleManagement: string[];
  roleManagement: string[];
}
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
  const [loading, setLoading] = React.useState(false);
  const [visibleWarning, setVisibleWarning] = React.useState(false);
  const navigate = useNavigate();
  const profile = useRecoilValue(profileAtom);

  const onFinish = async (values: FormData) => {
    const { rolename, roledescription, ...rest } = values;
    const keyObj = Object.keys(rest);
    const menus = keyObj.map((item) => {
      return {
        menuName: item,
        permission: rest[item as keyof typeof rest],
      };
    });
    const payload = {
      rolename,
      roledescription,
      company: profile?.company,
      menus,
      updateBy: `${profile?.firstname} ${profile?.lastname}`,
    };
    setLoading(true);
    const res = await roleDatasource.createNewRole(payload);
    if (res && res.success) {
      Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ",
        text: "",
        width: 250,
        icon: "success",
        timer: 2000,

        customClass: {
          title: "custom-title",
        },
        showConfirmButton: false,
      }).then(() => {
        setLoading(false);
        navigate("/UserPage/RoleManagementPage");
      });
    } else {
      Swal.fire({
        title: res.userMessage || "บันทึกข้อมูลไม่สำเร็จ",
        text: "",
        width: 250,
        icon: "error",
        customClass: {
          title: "custom-title",
        },
        showConfirmButton: false,
      }).then(() => {
        setLoading(false);
      });
    }
  };
  const [visible, setVisible] = React.useState(false);
  const onClickSelectAllBo = () => {
    form.setFieldsValue({
      orderManagement: websiteBackOffice.orderManagement.map((el) => el.value),
      specialRequest: websiteBackOffice.specialRequest.map((el) => el.value),
      promotionSetting: websiteBackOffice.promotionSetting.map((el) => el.value),
      discountCo: websiteBackOffice.discountCo.map((el) => el.value),
      priceList: websiteBackOffice.priceListX10.map((el) => el.value),
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
      priceList: [],
      saleManagement: [],
      roleManagement: [],
    });
  };

  return (
    <CardContainer>
      <PageTitleNested
        title='เพิ่มบทบาท'
        onBack={() => {
          const formValue = form.getFieldsValue();
          const isDirty = Object.values(formValue).some((el: any) => !!el);
          if (isDirty) {
            setVisibleWarning(true);
          } else {
            navigate(-1);
          }
        }}
      />
      <Form
        {...defaultPropsForm}
        style={{
          marginTop: 32,
        }}
        initialValues={{
          orderManagement: [],
          priceList: [],
          promotionSetting: [],
          roleManagement: [],
          saleManagement: [],
          specialRequest: [],
        }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          label='ชื่อบทบาท'
          name='rolename'
          rules={[
            {
              required: true,
              message: "กรุณากรอกชื่อบทบาท",
            },
          ]}
        >
          <Input placeholder='ระบุชื่อบทบาท' />
        </Form.Item>
        <Form.Item
          label='อธิบายชื่อบทบาท'
          name='roledescription'
          style={{
            marginBottom: 0,
          }}
          className='ant-form-no-margin-bottom'
        >
          <TextArea placeholder='ระบุคำอธิบาย' maxLength={255} />
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
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
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
                    name='Discount (CO) / ( ส่วนลดดูแลราคา)'
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item noStyle name='priceList'>
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
        {/* <CardRole>
          <Row
            style={{
              justifyContent: "space-between",
              padding: 16,
              alignItems: "center",
              backgroundColor: color.background1,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
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
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
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
        </CardRole> */}
        <Bottom>
          <Col span={22}>
            <Text color='Text3' level={6} fontFamily='Sarabun'>
              โปรดยืนยันการบันทึกข้อมูลเพิ่มบทบาท
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
          loading={loading}
          visible={visible}
          onConfirm={() => {
            form.submit();
            setVisible(false);
          }}
          onCancel={() => {
            setVisible(false);
          }}
          title='ยืนยันการบันทึกข้อมูล'
          desc='โปรดยืนยันการบันทึกข้อมูลเพิ่มบทบาท'
        />
        <ConfirmModal
          visible={visibleWarning}
          onConfirm={() => {
            setVisibleWarning(false);
            navigate(-1);
          }}
          onCancel={() => {
            setVisibleWarning(false);
          }}
          title='คุณต้องการกลับสู่หน้าหลักใช่หรือไม่'
          desc='โปรดยืนยันการกลับสู่หน้าหลัก'
        />
      </Form>
    </CardContainer>
  );
}
