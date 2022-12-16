import { CardContainer } from "../../../components/Card/CardContainer";
import React, { useEffect } from "react";

import Swal from "sweetalert2";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import { Col, Form, Row } from "antd";
import ProfileImage from "../../../components/ProfileImage/ProfileImage";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import { defaultPropsForm } from "../../../utility/DefaultProps";
import Select from "../../../components/Select/Select";
import { SelectDataRoles } from "../../../utility/StaticRoles";
import styled from "styled-components";
import color from "../../../resource/color";
import Text from "../../../components/Text/Text";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import { SaleListDatasource } from "../../../datasource/SaleListDatasource";
import { useNavigate } from "react-router-dom";
import { zoneDatasource } from "../../../datasource/ZoneDatasource";
import { useEffectOnce } from "react-use";
import { useRecoilValue } from "recoil";
import { profileAtom } from "../../../store/ProfileAtom";
import { roleDatasource } from "../../../datasource/RoleDatasource";

const Top = styled.div``;
const Bottom = styled(Row)`
  border-top: 1px solid ${color.background2};
  padding-top: 20px;
`;
export function AddNewSale() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [visibleWarning, setVisibleWarning] = React.useState(false);
  const profile = useRecoilValue(profileAtom);
  const [zone, setZone] = React.useState<{ label: string; value: string; key: string }[]>([]);
  const [roleList, setRoleList] = React.useState<{ label: string; value: string; key: string }[]>(
    [],
  );
  const getZoneByCompany = async () => {
    const res = await zoneDatasource.getAllZoneByCompany(profile?.company);
    const data = res.map((item: any) => {
      return {
        label: item.zoneName,
        value: item.zoneName,
        key: item.zoneId,
      };
    });
    setZone(data);
  };
  const getRoleList = async () => {
    const { data } = await roleDatasource.getAllRoles({
      page: 1,
      take: 100,
      company: profile?.company,
    });

    const newFormat = data.data.map((el: { rolename: string; roleId: string }) => {
      return {
        label: el.rolename,
        value: el.roleId,
        key: el.roleId,
      };
    });
    setRoleList(newFormat);
  };

  useEffectOnce(() => {
    getZoneByCompany();
    getRoleList();
  });
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await SaleListDatasource.createNewSaleStaff({
        ...values,
        company: profile?.company,
        status: "ACTIVE",
      });
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
          navigate("/UserPage/SaleManagementPage?status=all");
        });
      } else {
        Swal.fire({
          title: "บันทึกข้อมูลไม่สำเร็จ",
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
  return (
    <CardContainer>
      <Form
        {...defaultPropsForm}
        form={form}
        onFinish={onFinish}
        style={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Top>
          <PageTitleNested
            title='เพิ่มรายผู้ใช้งาน'
            onBack={() => {
              const isHaveValue = Object.values(form.getFieldsValue()).some((item) => item);
              if (isHaveValue) {
                setVisibleWarning(true);
              } else {
                navigate(-1);
              }
            }}
          />
          <Row>
            <Form.Item name='profileImage'>
              <ProfileImage />
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='firstname'
                label='ชื่อ*'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกชื่อ",
                  },
                ]}
              >
                <Input placeholder='ระบุชื่อ' />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                <Input placeholder='ระบุนามสกุล' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name='nickname' label='ชื่อเล่น'>
                <Input placeholder='ระบุชื่อเล่น' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='telephone'
                label='เบอร์โทรศัพท์*'
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกเบอร์โทรศัพท์",
                  },
                  {
                    pattern: /^[0-9]*$/,
                    message: "กรุณากรอกเบอร์โทรศัพท์เป็นตัวเลขเท่านั้น",
                  },
                  {
                    min: 10,
                    message: "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก",
                  },
                ]}
              >
                <Input placeholder='ระบุเบอร์โทรศัพท์' maxLength={10} />
              </Form.Item>
            </Col>
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
                <Input placeholder='ตัวอย่าง iconkaset.i@iconkaset.com' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='role'
                label='ตำแหน่ง*'
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกตำแหน่ง",
                  },
                ]}
              >
                <Select data={roleList} placeholder='เลือกตำแหน่ง' />
              </Form.Item>
            </Col>
            <Form.Item
              noStyle
              shouldUpdate={(prev, current) => {
                return prev.role !== current.role;
              }}
            >
              {({ getFieldValue }) => {
                return (
                  getFieldValue("role") === "SALE" && (
                    <Col span={12}>
                      <Form.Item label='เขต' name={"zone"}>
                        <Select data={zone} />
                      </Form.Item>
                    </Col>
                  )
                );
              }}
            </Form.Item>
          </Row>
        </Top>
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
      </Form>
      <ConfirmModal
        visible={visible}
        loading={loading}
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
