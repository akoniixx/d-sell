import { CardContainer } from "../../../components/Card/CardContainer";
import React, { useCallback, useEffect } from "react";

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
import { useNavigate, useParams } from "react-router-dom";
import { SaleListDatasource } from "../../../datasource/SaleListDatasource";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import { useRecoilValue } from "recoil";
import { profileAtom } from "../../../store/ProfileAtom";
import { zoneDatasource } from "../../../datasource/ZoneDatasource";

const Top = styled.div``;
const Bottom = styled(Row)`
  border-top: 1px solid ${color.background2};
  padding-top: 20px;
`;

export function EditUserSale() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const profile = useRecoilValue(profileAtom);
  const { userStaffId } = useParams();
  const [zone, setZone] = React.useState<{ label: string; value: string; key: string }[]>([]);
  const getZoneByCompany = useCallback(async () => {
    const res = await zoneDatasource.getAllZoneByCompany(profile?.company);
    const data = res.map((item: any) => {
      return {
        label: item.zoneName,
        value: item.zoneName,
        key: item.zoneId,
      };
    });
    setZone(data);
  }, [profile?.company]);

  const getInitialValue = useCallback(async () => {
    try {
      const result = await SaleListDatasource.getSaleStaffById(userStaffId);
      form.setFieldsValue({
        ...result,
      });
    } catch (error) {
      console.log(error);
    }
  }, [form, userStaffId]);
  useEffect(() => {
    getZoneByCompany();
    if (userStaffId) {
      getInitialValue();
    }
  }, [getInitialValue, userStaffId, getZoneByCompany]);

  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await SaleListDatasource.updateUserStaff(userStaffId || "", {
        ...values,
        updateBy: `${profile?.firstname} ${profile?.lastname}`,
      });

      if (res) {
        Swal.fire({
          title: "บันทึกข้อมูลสำเร็จ",
          text: "",
          width: 250,
          icon: "success",
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
          <PageTitleNested title='แก้ไขรายชื่อพนักงาน' cutParams />
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
                <Select data={SelectDataRoles} placeholder='เลือกตำแหน่ง' />
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
    </CardContainer>
  );
}
