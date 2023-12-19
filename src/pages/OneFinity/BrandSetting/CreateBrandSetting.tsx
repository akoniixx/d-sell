import { Col, Divider, message, Row, Upload, Form, Modal, Radio, Space } from "antd";
import { useForm } from "antd/lib/form/Form";
import { RcFile } from "antd/lib/upload";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import Button from "../../../components/Button/Button";
import { CardContainer } from "../../../components/Card/CardContainer";
import { ImageWithDeleteButton, UploadIcon } from "../../../components/Image/Image";
import ImgCrop from "../../../components/ImgCrop/ImgCrop";
import Input from "../../../components/Input/Input";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import Text from "../../../components/Text/Text";
import { color } from "../../../resource";
import { getBase64 } from "../../../utility/uploadHelper";
import { getBrandById } from "../../../datasource/OneFinity/BrandSettingDatasource";

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

export const CreateBrandSetting: React.FC = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEdit = pathSplit[3] !== "create";
  console.log(isEdit);
  const id = pathSplit[3];

  const [imageUrl, setImageUrl] = useState<string>();
  const [file, setFile] = useState<any>();
  const [uploading, setUploading] = useState(false);
  const [showModal, setModal] = useState(false);

  const getById = async () => {
    const data = await getBrandById(id).then((res) => res.responseData);
    setImageUrl(data.productBrandLogo);
    form.setFieldsValue({
      productBrandName: data.productBrandName,
      isActive: data.isActive,
    });
  };

  useEffect(() => {
    isEdit && getById();
  }, []);

  return (
    <CardContainer>
      <PageTitleNested
        title={isEdit ? "ข้อมูลแบรนด์สินค้า" : "เพิ่มแบรนด์สินค้า"}
        showBack
        onBack={() => navigate(`/oneFinity/brandSetting`)}
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการแบรนด์สินค้า", path: `/oneFinity/brandSetting` },
              {
                text: isEdit ? "ข้อมูลแบรนด์สินค้า" : "เพิ่มแบรนด์สินค้า",
                path: window.location.pathname,
              },
            ]}
          />
        }
      />
      <Divider />
      <Form form={form} layout='vertical' onFinish={() => setModal(true)}>
        <Row justify={"space-between"} gutter={16}>
          <Col span={24}>
            <Row>
              <Col span={3}>
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
                      console.log("customRequest", file);
                    }}
                    onChange={({ file }: any) => {
                      return "success";
                    }}
                    onRemove={() => {
                      setFile(undefined);
                    }}
                    showUploadList={false}
                    //disabled={!!file1 || !!imageUrl1}
                  >
                    {!imageUrl ? (
                      <UploadArea
                        style={{
                          width: "136px",
                          height: "136px",
                        }}
                      >
                        {UploadIcon}
                      </UploadArea>
                    ) : (
                      <ImageWithDeleteButton
                        width='136px'
                        height='136px'
                        src={imageUrl}
                        handleDelete={() => {
                          setFile(undefined);
                          setImageUrl(undefined);
                        }}
                      />
                    )}
                  </UploadVeritical>
                </ImgCrop>
              </Col>
              <Col span={21}>
                <Text level={6}>รูปภาพแบรนด์สินค้า</Text>
                <br />
                <Text level={6} color='Text3'>
                  JPG, GIF or PNG. Size of
                  <br />
                  500*500px or 1:1
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        <Col span={10}>
          <Form.Item
            name='productBrandName'
            label='ชื่อยี่ห้อ/แบรนด์สินค้า (Product Brand) '
            rules={[
              {
                required: true,
                message: "*โปรดระบุชื่อยี่ห้อ/แบรนด์สินค้า",
              },
              {
                max: 50,
                message: "*ชื่อข่าวสารต้องมีความยาวไม่เกิน 50 ตัวอักษร",
              },
            ]}
          >
            <Input placeholder='ระบุชื่อแบรนด์สินค้า' />
          </Form.Item>
        </Col>
        {isEdit && (
          <Col span={10}>
            <Form.Item
              name='isActive'
              label='สถานะสินค้า'
              rules={[
                {
                  required: true,
                  message: "*โปรดระบุสถานะ",
                },
              ]}
            >
              <Radio.Group style={{ width: "100%" }}>
                <Radio value={true}>ใช้งาน</Radio>
                <Radio value={false}>ปิดการใช้งาน</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        )}
        <Divider />
        <Row justify='space-between' gutter={12}>
          <Col xl={3} sm={6}>
            <Button
              typeButton='primary-light'
              title='ยกเลิก'
              htmlType='submit'
              loading={uploading}
              onClick={() => navigate(`/oneFinity/brandSetting`)}
            />
          </Col>
          <Col xl={15} sm={6}></Col>
          <Col xl={3} sm={6}>
            <Button typeButton='primary' title='บันทึก' htmlType='submit' loading={uploading} />
          </Col>
        </Row>
      </Form>
      {showModal && (
        <Modal
          open={showModal}
          closable={false}
          //onOk={onSave}
          onCancel={() => setModal(false)}
          destroyOnClose
          okText={"ยืนยัน"}
          okButtonProps={{ loading: uploading }}
          cancelButtonProps={{ style: { color: color.primary, borderColor: color.primary } }}
        >
          <Text level={2}>{isEdit ? "ยืนยันบันทึกแบรนด์สินค้า" : "ยืนยันเพิ่มแบรนด์สินค้า"}</Text>
          <br />
          {isEdit ? (
            <>
              <Text level={5} color='Text3'>
                โปรดตรวจสอบรายละเอียดแบรนด์สินค้าอีกครั้งก่อนกดยืนยัน
              </Text>
              <br />
              <Text level={5} color='Text3'>
                เพราะอาจส่งผลต่อการแสดงผลข้อมูลในระบบ
              </Text>
            </>
          ) : (
            <Text level={5} color='Text3'>
              โปรดตรวจสอบรายละเอียดก่อนกดยืนยัน
            </Text>
          )}
        </Modal>
      )}
    </CardContainer>
  );
};
