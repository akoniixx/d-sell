import { Col, Divider, Form, message, Radio, Row, Space, Upload, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import { CardContainer } from "../../../components/Card/CardContainer";
import { ImageWithDeleteButton, UploadIcon } from "../../../components/Image/Image";
import ImgCrop from "../../../components/ImgCrop/ImgCrop";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import StepAntd from "../../../components/StepAntd/StepAntd";
import color from "../../../resource/color";
import Text from "../../../components/Text/Text";
import { getBase64 } from "../../../utility/uploadHelper";
import { RcFile } from "antd/lib/upload";
import Input from "../../../components/Input/Input";
import Selects from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { getMasterAddress, getProvince } from "../../../datasource/AddressDatasource";
import _ from "lodash";

const UploadVeritical = styled(Upload)`
  .ant-upload,
  .ant-upload-list-picture-card-container,
  .ant-upload-picture-card-wrapper,
  .ant-upload-list-picture-card .ant-upload-list-item {
    height: 136px;
    width: 136px;
  }
`;
const UploadArea = styled.div`
  background: ${color.background1};
  border: 1px dashed;
  border-radius: 6px;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

const imgCropProps = {
  modalTitle: "ปรับขนาดรูปภาพ",
  modalOk: "ยืนยัน",
  modalCancel: "ยกเลิก",
};

export const AntSelectCustom = styled(Select)`
  .ant-select-selector {
    height: 40px !important;
    display: flex;
    align-items: center;
    font-family: Sarabun !important;
  }
  .ant-select-selection-placeholder {
    font-family: Sarabun !important;
  }

  .ant-select-selection-item {
    border-radius: 4px;
    font-family: Sarabun !important;
    font-weight: 600 !important;
    display: flex;
    align-items: center;
  }
`;

export const CreateCorporateShop: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const [form1] = useForm();
  const [form2] = useForm();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEditing = pathSplit[3] !== "create";

  const [current, setCurrent] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>();
  const [file, setFile] = useState<any>();
  const [center, setCenter] = useState<any>({ lat: 13.736717, lng: 100.523186 });

  const [masterAddr, setMasterAddr] = useState<any>([]);
  const [provinceList, setProvinceList] = useState<any>([]);
  const [districtList, setDistrictList] = useState<any>([]);
  const [subdistrictList, setSubdistrictList] = useState<any>([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDg4BI3Opn-Bo2Pnr40Z7PKlC6MOv8T598",
    googleMapsClientId: "427194649680-frihsda5p9jjp6no28ijvoa66vrmq64f.apps.googleusercontent.com",
  });

  const containerStyle = {
    width: "100%",
    height: "350px",
  };

  const onLoad = React.useCallback(
    function callback(map: any) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
    },
    [center],
  );

  const staticData = [
    {
      label: "คุณ",
      value: "คุณ",
      key: "1",
    },
    {
      label: "นาย",
      value: "นาย",
      key: "2",
    },
    {
      label: "นางสาว",
      value: "นางสาว",
      key: "3",
    },
    {
      label: "นาง",
      value: "นาง",
      key: "4",
    },
  ];

  const getMasterProvince = async () => {
    const province = await getProvince().then((res) => {
      return res.responseData;
    });
    setProvinceList(province || []);
  };
  const onChangeDistrict = async () => {
    const payload = form2.getFieldsValue(true);
    const groupsSubdistrict = _.groupBy(
      masterAddr.filter((y: any) => payload.districtId.endsWith(y.districtName)) || [],
      "subdistrictName",
    );
    const objSubdistrict = _.map(groupsSubdistrict, (items, disName) => {
      return {
        masterAddressId: items.find((item: any) => item.subdistrictName === disName)
          .masterAddressId,
        subdistrictId: items.find((item: any) => item.subdistrictName === disName).subdistrictId,
        subdistrictName: disName,
        postCode: items.find((item: any) => item.subdistrictName === disName).postcode,
      };
    });
    form2.setFieldsValue({ subdistrictId: "", postcode: "" });
    setSubdistrictList(objSubdistrict);
  };
  const onChangeSubdistrict = async () => {
    const payload = form2.getFieldsValue(true);
    const getSubdistrict = masterAddr.find((x: any) =>
      payload.subdistrictId.endsWith(x.subdistrictName),
    );
    form2.setFieldsValue({
      masterAddressId: getSubdistrict.masterAddressId,
      postcode: getSubdistrict ? getSubdistrict.postcode || "" : "",
    });
  };

  useEffect(() => {
    getMasterProvince();
  }, []);

  const onChangeProvince = async () => {
    const payload = form2.getFieldsValue(true);
    const getAddr = await getMasterAddress(payload.provinceId).then((res) => {
      return res.responseData;
    });
    setMasterAddr(getAddr);
    const groupsDistrict = _.groupBy(getAddr || [], "districtName");
    const objDistrict = _.map(groupsDistrict, (items, disName) => {
      return {
        districtId: items.find((item: any) => item.districtName === disName).districtId,
        districtName: disName,
      };
    });
    form2.setFieldsValue({ districtId: "", subdistrictId: "", postcode: "" });
    setDistrictList(objDistrict);
  };

  const PageTitle = () => {
    return (
      <PageTitleNested
        title={isEditing ? "แก้ไขร้านค้า" : "เพิ่มร้านค้า"}
        showBack
        extra={
          <StepAntd
            current={current}
            items={[
              {
                title: "ประเภทสมาชิก",
              },
              {
                title: "ข้อมูลบุคคล/ร้านค้า",
              },
            ]}
          />
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายชื่อร้านค้า", path: "/ShopManagementPage/CorporateShop" },
              {
                text: isEditing ? "แก้ไขร้านค้า" : "เพิ่มร้านค้า",
                path: window.location.pathname,
              },
            ]}
          />
        }
      />
    );
  };
  const renderStep = () => {
    switch (current) {
      case 0: {
        return <StepOne />;
      }
      case 1: {
        return <StepTwo />;
      }
    }
  };
  const StepOne = () => {
    return (
      <Form form={form1} layout='vertical'>
        <Row justify={"space-between"} gutter={16}>
          <Col span={24}>
            <Row>
              <Col span={3}>
                {!imageUrl ? (
                  <ImgCrop aspect={1 / 1} {...imgCropProps}>
                    <UploadVeritical
                      listType='picture-card'
                      maxCount={1}
                      beforeUpload={(file) => {
                        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
                        if (!isJpgOrPng) {
                          message.error("You can only upload JPG/PNG file!");
                          return true;
                        }
                        setFile(file);
                        getBase64(file as RcFile, (url) => {
                          setImageUrl(url);
                        });
                        return false;
                      }}
                      customRequest={({ file }) => {
                        setFile(file);
                      }}
                      onChange={({ file }: any) => {
                        setFile(file);
                        return "success";
                      }}
                      onRemove={() => {
                        setFile(undefined);
                      }}
                      showUploadList={false}
                    >
                      <UploadArea
                        style={{
                          width: "136px",
                          height: "136px",
                        }}
                      >
                        {UploadIcon}
                      </UploadArea>
                    </UploadVeritical>
                  </ImgCrop>
                ) : (
                  <div style={{ width: "138px", height: "138px", overflow: "hidden" }}>
                    <ImageWithDeleteButton
                      width='136px'
                      height='136px'
                      src={imageUrl}
                      handleDelete={() => {
                        setFile(undefined);
                        setImageUrl(undefined);
                      }}
                    />
                  </div>
                )}
              </Col>
              <Col span={21}>
                <Text level={6}>รูปภาพโลโก้ร้านค้า</Text>
                <br />
                <Text level={6} color='Text3'>
                  รูปแบบไฟล์ภาพ
                  <br />
                  JPG / PNG
                  <br />
                  ขนาดภาพ
                  <br />
                  500*500px or 1:1
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={10}>
            <Form.Item
              name='type'
              label='ประเภทคู่ค้า'
              rules={[
                {
                  required: true,
                  message: "*โปรดระบุประเภท",
                },
              ]}
            >
              <Radio.Group style={{ width: "100%" }}>
                <Space direction='vertical'>
                  <Radio value='Dealer'>Dealer</Radio>
                  <Radio value='Sub-Dealer'>Sub-Dealer</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <br />
        <Row justify={"space-between"} gutter={16}>
          <Col span={12}>
            <Form.Item name='shopNo' label='รหัสร้านค้า'>
              <Input placeholder='ระบุรหัสร้านค้า' autoComplete='off' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='zone' label='เขต'>
              <Selects placeholder='เลือกเขต' data={[]} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"space-between"} gutter={16}>
          <Col span={12}>
            <Form.Item name='brand' label='แบรนด์สินค้า (Product Brands)'>
              <Selects placeholder='เลือก Product Brands' data={[]} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };
  const sectionUserShop = (
    <>
      <Row gutter={16}>
        <Col>
          <Text fontSize={16} fontWeight={600}>
            รายละเอียดข้อมูลบุคคล (เจ้าของร้าน)
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
            name='title'
            label='คำนำหน้าชื่อ'
            rules={[
              {
                required: true,
                message: "กรุณาเลือกคำนำหน้าชื่อ",
              },
            ]}
          >
            <Selects data={staticData} />
          </Form.Item>
        </Col>
        <Col span={6}>
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
            <Input autoComplete='off' />
          </Form.Item>
        </Col>
        <Col span={6}>
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
            <Input autoComplete='off' />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name='idCard' label='หมายเลขบัตรประชาชน'>
            <Input autoComplete='off' />
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
            name='telephoneFirst'
            label='เบอร์โทรศัพท์'
            rules={[
              {
                required: true,
                message: "กรุณากรอกเบอร์โทร",
              },
              {
                pattern: /^[0-9.]*$/,
                message: "กรุณากรอกตัวเลขเท่านั้น",
              },
            ]}
          >
            <Input autoComplete='off' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='email' label='อีเมล์'>
            <Input autoComplete='off' />
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
          <Form.Item name='startDate' label='วันที่เริ่มเป็นสมาชิก'>
            <Input autoComplete='off' />
          </Form.Item>
        </Col>
      </Row>
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
      <Row
        gutter={16}
        style={{
          marginTop: 16,
        }}
      >
        <Col span={12}>
          <Form.Item
            name='shopName'
            label='ชื่อร้านค้า'
            rules={[
              {
                required: true,
                message: "กรุณากรอกชื่อร้านค้า",
              },
            ]}
          >
            <Input autoComplete='off' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='taxNo'
            label='หมายเลขนิติบุคคล'
            rules={[
              {
                required: true,
                message: "กรุณากรอกหมายเลขนิติบุคคล",
              },
              {
                pattern: /^[0-9]*$/,
                message: "กรุณากรอกตัวเลขเท่านั้น",
              },
            ]}
          >
            <Input autoComplete='off' />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name='termPayment'
            label='รูปแบบการชำระ'
            rules={[
              {
                required: true,
                message: "*โปรดระบุรูปแบบการชำระ",
              },
            ]}
          >
            <Radio.Group style={{ width: "100%" }}>
              <Space direction='vertical'>
                <Radio value='COD'>เงินสด</Radio>
                <Radio value='N'>เครดิต</Radio>
              </Space>
            </Radio.Group>
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
            name='provinceId'
            label='จังหวัด'
            rules={[
              {
                required: true,
                message: "กรุณาเลือกจังหวัด",
              },
            ]}
          >
            <AntSelectCustom
              showSearch
              allowClear
              options={
                provinceList?.map((x: any) => ({
                  key: x.provinceName,
                  value: x.provinceId,
                  label: x.provinceName,
                })) || []
              }
              onChange={onChangeProvince}
              optionFilterProp='children'
              filterOption={(input: any, option: any) => {
                return (option?.key ?? "").includes(input);
              }}
              filterSort={(optionA: any, optionB: any) => {
                return (optionA?.key ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.key ?? "").toLowerCase());
              }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name='districtId'
            label='อำเภอ/เขต'
            rules={[
              {
                required: true,
                message: "กรุณาเลือกอำเภอ/เขต",
              },
            ]}
          >
            <AntSelectCustom
              allowClear
              showSearch
              options={
                districtList?.map((x: any) => ({
                  key: x.districtName,
                  value: x.districtName,
                  label: x.districtName,
                })) || []
              }
              onChange={onChangeDistrict}
              optionFilterProp='children'
              filterOption={(input: any, option: any) => {
                return (option?.key ?? "").includes(input);
              }}
              filterSort={(optionA: any, optionB: any) => {
                return (optionA?.key ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.key ?? "").toLowerCase());
              }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name='subdistrictId'
            label='ตำบล/แขวง'
            rules={[
              {
                required: true,
                message: "กรุณาเลือกตำบล/แขวง",
              },
            ]}
          >
            <AntSelectCustom
              allowClear
              showSearch
              options={
                subdistrictList?.map((x: any) => ({
                  key: x.subdistrictName,
                  value: x.subdistrictName,
                  label: x.subdistrictName,
                })) || []
              }
              onChange={onChangeSubdistrict}
              optionFilterProp='children'
              filterOption={(input: any, option: any) => {
                return (option?.key ?? "").includes(input);
              }}
              filterSort={(optionA: any, optionB: any) => {
                return (optionA?.key ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.key ?? "").toLowerCase());
              }}
            />
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
            <Input autoComplete='off' />
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
            name='addressDesc'
            label='ที่อยู่ (บ้านเลขที่ หมู่ ซอย ชั้น อาคาร)'
            rules={[
              {
                required: true,
                message: "กรุณากรอกที่อยู่",
              },
            ]}
          >
            <Input autoComplete='off' />
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
              {
                pattern: /^[0-9.]*$/,
                message: "กรุณากรอกตัวเลขและจุด (.)เท่านั้น",
              },
            ]}
          >
            <Input autoComplete='off' />
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
              {
                pattern: /^[0-9.]*$/,
                message: "กรุณากรอกตัวเลขและจุด (.)เท่านั้น",
              },
            ]}
          >
            <Input autoComplete='off' />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
  const StepTwo = () => {
    return (
      <Form form={form2} layout='vertical'>
        {sectionUserShop}
        <br />
        {sectionShop}
        {isLoaded ? (
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onLoad={onLoad}>
            <MarkerF position={center} />
          </GoogleMap>
        ) : (
          <></>
        )}
        <br />
      </Form>
    );
  };

  const footer = () => {
    return (
      <Row justify='space-between' gutter={12}>
        <Col xl={3} sm={6}>
          {current > 0 && (
            <Button
              typeButton='primary-light'
              title='ย้อนกลับ'
              onClick={() => setCurrent(current - 1)}
            />
          )}
        </Col>
        <Col xl={15} sm={6}></Col>
        <Col xl={3} sm={6}>
          <Button
            typeButton='primary'
            title={current === 1 ? "บันทึก" : "ถัดไป"}
            onClick={() => {
              nextStep();
            }}
          />
        </Col>
      </Row>
    );
  };

  const nextStep = () => {
    if (current === 0) {
      setCurrent(current + 1);
    } else {
      console.log(1);
    }
  };

  return (
    <CardContainer>
      <PageTitle />
      <Divider />
      {renderStep()}
      <br />
      {footer()}
    </CardContainer>
  );
};
