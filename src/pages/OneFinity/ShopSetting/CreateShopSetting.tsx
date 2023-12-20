import { DisconnectOutlined, ShopOutlined, UploadOutlined } from "@ant-design/icons";
import { Col, Divider, Row, Form, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import { CardContainer } from "../../../components/Card/CardContainer";
import Input from "../../../components/Input/Input";
import InputHyphen from "../../../components/Input/InputHyphen";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Permission from "../../../components/Permission/Permission";
import Select from "../../../components/Select/Select";
import Text from "../../../components/Text/Text";
import { color } from "../../../resource";
import { GoogleMap, MarkerF, useJsApiLoader, useLoadScript } from "@react-google-maps/api";
import Buttons from "../../../components/Button/Button";

const Header = styled(Col)`
  border-radius: 8px;
  background-color: ${color.background1};
  padding: 20px;
  align-items: center;
`;

export const CreateShopSetting: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEdit = pathSplit[3] !== "create";
  const id = pathSplit[3];
  const [map, setMap] = React.useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDg4BI3Opn-Bo2Pnr40Z7PKlC6MOv8T598",
    googleMapsClientId: "427194649680-frihsda5p9jjp6no28ijvoa66vrmq64f.apps.googleusercontent.com",
  });

  const containerStyle = {
    width: "100%",
    height: "350px",
  };

  const center = {
    lat: 13.736717,
    lng: 100.523186,
  };

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

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
    {
      label: "คุณ",
      value: "คุณ",
      key: "4",
    },
  ];

  const header = (
    <Header style={{ width: "50%" }}>
      <Row gutter={16}>
        <Col span={2}>
          <ShopOutlined style={{ fontSize: "20px" }} />
        </Col>
        <Col span={10}>
          <Text fontSize={16} color='primary' fontWeight={600}>
            ร้านรวมใจการเกษตร
          </Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Text fontSize={16} fontWeight={500}>
            หมายเลขนิติบุคคล :
          </Text>
        </Col>
        <Col span={12}>
          <Text fontSize={16}>9987700004321</Text>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Text fontSize={16} fontWeight={500}>
            จังหวัด :
          </Text>
        </Col>
        <Col span={12}>
          <Text fontSize={16}>ชัยนาท</Text>
        </Col>
      </Row>
    </Header>
  );

  const sectionUserShop = (
    <>
      <Row gutter={16}>
        <Col>
          <Text fontSize={16} fontWeight={600}>
            รายละเอียดข้อมูลบุคคล (เจ้าของร้าน)
          </Text>
        </Col>
      </Row>
      <Form form={form} layout='vertical'>
        <Row
          gutter={16}
          style={{
            marginTop: 16,
          }}
        >
          <Col span={4}>
            <Form.Item
              name='nametitle'
              label='คำนำหน้าชื่อ'
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
              label='ชื่อจริง'
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
              label='นามสกุล'
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
              label='เลขบัตรประชาชน'
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
        <Row
          gutter={16}
          style={{
            marginTop: 16,
          }}
        >
          <Col span={12}>
            <Form.Item
              name='email'
              label='อีเมล์'
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกคำนำหน้าชื่อ",
                },
              ]}
            >
              <Input />
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
                label='เบอร์โทรศัพท์ (หลัก)'
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
                <Input maxLength={10} autoComplete='off' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='เบอร์โทรศัพท์ (สำรอง)'
                name='secondtelephone'
                // rules={[
                //   {
                //     pattern: /^[0-9]{10}$/,
                //     message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง",
                //   },
                //   {
                //     validator: (_, value) => {
                //       if (value !== form.getFieldValue("telephone")) {
                //         return Promise.resolve();
                //       }
                //       return Promise.reject(new Error("เบอร์โทรศัพท์ซ้ำกัน"));
                //     },
                //   },
                // ]}
              >
                <Input maxLength={10} autoComplete='off' />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </>
  );

  const sectionShop = (
    <>
      <Row gutter={16}>
        <Col>
          <Text fontSize={16} fontWeight={600}>
            รายละเอียดข้อมูลร้านค้า
          </Text>
        </Col>
      </Row>
      <Form form={form} layout='vertical'>
        <Row
          gutter={16}
          style={{
            marginTop: 16,
          }}
        >
          <Col span={12}>
            <Form.Item
              name='shopname'
              label='ชื่อร้านค้า'
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
              name='tax'
              label='หมายเลขนิติบุคคล'
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
        <Row gutter={16}>
          <Col>
            <Text fontSize={16} fontWeight={600}>
              ที่อยู่ร้านค้า
            </Text>
          </Col>
        </Row>
        <Row
          gutter={16}
          style={{
            marginTop: 16,
          }}
        >
          <Col span={6}>
            <Form.Item
              name='province'
              label='จังหวัด'
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกจังหวัด",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name='district'
              label='อำเภอ/เขต'
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกอำเภอ/เขต",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name='subdistract'
              label='ตำบล/แขวง'
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกคำนำหน้าชื่อ",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name='postcode'
              label='รหัสไปรษณีย์'
              rules={[
                {
                  required: true,
                  message: "กรุณาเลือกรหัสไปรษณีย์",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={16}
          style={{
            marginTop: 16,
          }}
        >
          <Col span={12}>
            <Form.Item
              name='address'
              label='ที่อยู่ (บ้านเลขที่ หมู่ ซอย ชั้น อาคาร ) '
              rules={[
                {
                  required: true,
                  message: "กรุณากรอกที่อยู่",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={16}
          style={{
            marginTop: 16,
          }}
        >
          <Col span={12}>
            <Form.Item
              name='latitude'
              label='ตำแหน่ง Latitude'
              rules={[
                {
                  required: true,
                  message: "กรุณากรอก Latitude",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='longitude'
              label='ตำแหน่ง Longitude'
              rules={[
                {
                  required: true,
                  message: "กรุณากรอก Longitude",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );

  const attachments = (
    <>
      <Row gutter={8}>
        <Col>
          <Text fontSize={16} fontWeight={600}>
            อัพโหลดสัญญาเข้าร่วมโครงการ
          </Text>
        </Col>
        <Col>
          <Text fontSize={16}>(ไฟล์ภาพและไฟล์ pdf)</Text>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col style={{ color: color.primary }}>
          <DisconnectOutlined style={{ fontSize: "15px" }} />{" "}
          <Text color='primary'>ดาวน์โหลดเอกสารสัญญา</Text>
        </Col>
      </Row>
      <Row>
        <Button type='primary' icon={<UploadOutlined />}>
          อัพโหลดไฟล์
        </Button>
      </Row>
    </>
  );

  return (
    <CardContainer>
      <PageTitleNested
        title={isEdit ? "รายการร้านค้า" : "เพิ่มร้านค้าจาก Sellcoda"}
        showBack
        onBack={() => navigate(`/oneFinity/shopSetting`)}
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการร้านค้า", path: `/oneFinity/shopSetting` },
              {
                text: isEdit ? "รายการร้านค้า" : "เพิ่มร้านค้าจาก Sellcoda",
                path: window.location.pathname,
              },
            ]}
          />
        }
      />
      <Divider />
      {header}
      <Divider />
      {sectionUserShop}
      {sectionShop}
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={onLoad}
          // onUnmount={onUnmount}
        >
          <MarkerF position={center} />
        </GoogleMap>
      ) : (
        <></>
      )}
      <br />
      {attachments}
      <Divider />
      <Row justify='space-between' gutter={12}>
        <Col xl={3} sm={6}>
          <Buttons typeButton='primary-light' title='ยกเลิก' />
        </Col>
        <Col xl={18} sm={12}></Col>
        <Col xl={3} sm={6}>
          <Buttons typeButton='primary' title='บันทึก' />
        </Col>
      </Row>
    </CardContainer>
  );
};
