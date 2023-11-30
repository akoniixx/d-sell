import { Col, Form, Row } from "antd";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import RolesList from "../../../components/RolesList/RolesList";

interface FormData {
  rolename: string;
  roledescription?: string;
  priceList: string[];
  orderManagement: string[];
  specialRequest: string[];
  promotionSetting: string[];
  discountCo: string[];
  priceSpecialExclusive: any;
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
export default function EditRole(): JSX.Element {
  const [form] = Form.useForm();
  const profile = useRecoilValue(profileAtom);

  const [visibleWarning, setVisibleWarning] = React.useState(false);
  const navigate = useNavigate();
  const { roleId } = useParams();
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    const getInitialValue = async () => {
      try {
        const result = await roleDatasource.getRoleById(roleId || "", profile?.company);
        console.log(result);
        if (result) {
          const {
            menus,
          }: {
            menus: any;
          } = result;
          const newMenus: {
            menuName: string;
            permission: string[];
          }[] = typeof menus === "string" ? JSON.parse(menus) : menus;

          const discountCo = newMenus.find((item) => item.menuName === "discountCo");
          const news = newMenus.find((item) => item.menuName === "news");
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
            ...result,
            freebieList: freebieList?.permission,
            manageOrder: manageOrder?.permission,
            manageStore: manageStore?.permission,
            manageUser: manageUser?.permission,
            priceSpecialExclusive: priceSpecialExclusive?.permission,
            productList: productList?.permission,
            specialRequest: specialRequest?.permission,
            promotionSetting: promotionSetting?.permission,
            discountCo: discountCo?.permission,
            news: news?.permission,
            saleManagement: saleManagement?.permission,
            roleManagement: roleManagement?.permission,
          });
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (roleId) {
      getInitialValue();
    }
  }, []);

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
    console.log("onFinish", values, payload);
    try {
      setLoading(true);
      const res = await roleDatasource.updateRole(roleId || "", payload);

      if (res) {
        Swal.fire({
          title: "แก้ไขข้อมูลสำเร็จ",
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
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
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
      priceList: [],
      saleManagement: [],
      roleManagement: [],
    });
  };

  return (
    <CardContainer>
      <PageTitleNested
        title='แก้ไขบทบาท'
        cutParams
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
        initialValues={{}}
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
        <RolesList form={form} />

        <Bottom>
          <Col span={22}>
            <Text color='Text3' level={6} fontFamily='Sarabun'>
              โปรดยืนยันการบันทึกข้อมูลแก้ไขบทบาท
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
          desc='โปรดยืนยันการบันทึกข้อมูลแก้ไขบทบาท'
        />
      </Form>
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
    </CardContainer>
  );
}
