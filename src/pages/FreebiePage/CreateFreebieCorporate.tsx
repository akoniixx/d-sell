import { CameraOutlined } from "@ant-design/icons";
import { Col, Row, Form, Upload, UploadFile, Radio, Divider, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import Button from "../../components/Button/Button";
import { CardContainer } from "../../components/Card/CardContainer";
import Input from "../../components/Input/Input";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import color from "../../resource/color";
import Text from "../../components/Text/Text";
import { createFreebieCorporate, updateFreebieCorporate } from "../../datasource/FreebieDatasource";
import { getProductFreebiePromotionDetail } from "../../datasource/PromotionDatasource";

const ProdImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  color: grey;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CreateFreebieCorporate: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const company = JSON.parse(localStorage.getItem("company")!);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEdit = pathSplit[3] !== "create";
  const id = parseInt(pathSplit[3]);

  const [file, setFile] = useState<any>();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>();
  const [isRemoved, setRemoved] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCancel, setShowCancel] = useState<boolean>(false);

  const getFreebieById = async () => {
    await getProductFreebiePromotionDetail(id).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    isEdit && getFreebieById();
    form.setFieldValue("productFreebiesStatus", "ACTIVE");
  }, []);

  const PageTitle = () => {
    return (
      <PageTitleNested
        title={!isEdit ? "เพิ่มของแถม" : "แก้ไขของแถม"}
        showBack
        onBack={() => navigate(`/freebies/freebies`)}
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการของแถม", path: `/freebies/freebies` },
              { text: !isEdit ? "เพิ่มของแถม" : "แก้ไขของแถม", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };

  const createFreebie = async () => {
    const payload = form.getFieldsValue(true);
    console.log("p", payload);
    form
      .validateFields()
      .then(async (f) => {
        const data = new FormData();
        data.append("productName", payload.productName);
        data.append("productFreebiesStatus", payload.productFreebiesStatus || "ACTIVE");
        data.append("company", company.companyCode);
        data.append("productFreebiesCodeNAV", payload.productFreebiesCodeNAV);
        data.append("productGroup", payload.productGroup);
        data.append("baseUnitOfMeaEn", payload.baseUnitOfMeaEn);
        data.append("baseUnitOfMeaTh", payload.baseUnitOfMeaTh);
        data.append("description", payload.description);
        data.append("updateBy", `${userProfile.firstname} ${userProfile.lastname}`);

        if (!isRemoved && payload.productImage) {
          data.append("productFreebiesImage", payload.productImage);
        }
        if (file && file.uid !== "-1") {
          data.append("file", file!);
        }
        if (payload.productFreebiesId) {
          console.log(2);
          data.append("productFreebiesId", payload.productId);
          await updateFreebieCorporate(data).then((res) => {
            if (res.success) {
              navigate("/freebies/freebies");
            }
          });
        } else {
          console.log(1);
          await createFreebieCorporate(data).then((res) => {
            console.log("res", res);
            if (res.success) {
              navigate("/freebies/freebies");
            }
          });
        }
        setShowModal(!showModal);
      })
      .catch((e) => {
        console.log("e", e);
        return false;
      });
  };

  return (
    <>
      <CardContainer>
        <PageTitle />
        <br />
        <Form form={form} layout='vertical'>
          <Row style={{ padding: "16px 0px" }}>
            <Form.Item valuePropName='file' name={"productFreebiesImage"}>
              <Upload
                listType='picture-card'
                maxCount={1}
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ file, fileList: newFileList }: any) => {
                  setFile(file);
                  setFileList(newFileList);
                  return "success";
                }}
                onRemove={() => {
                  setFile(undefined);
                  setFileList([]);
                  setRemoved(true);
                }}
              >
                {!fileList?.length && (
                  <ProdImage>
                    <CameraOutlined />
                  </ProdImage>
                )}
              </Upload>
              <span style={{ color: color.error }}>
                รูปภาพประกอบสินค้า JPG, PNG. Size of 800*800px 1:1
              </span>
            </Form.Item>
          </Row>
          <Row justify={"space-between"} gutter={8}>
            <Col span={12}>
              <Form.Item
                name='productName'
                label='ชื่อของแถม'
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุชื่อของแถม",
                  },
                ]}
              >
                <Input placeholder='ระบุชื่อของแถม' autoComplete='off' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='productFreebiesCodeNAV' label='รหัสของแถม'>
                <Input placeholder='ระบุรหัสของแถม' autoComplete='off' />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"space-between"} gutter={8}>
            <Col span={12}>
              <Form.Item name='productGroup' label='ชื่อหมวด'>
                <Input placeholder='ระบุชื่อหมวด' autoComplete='off' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='baseUnitOfMeaEn' label='ขนาด'>
                <Input placeholder='ระบุขนาด' autoComplete='off' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='baseUnitOfMeaTh' label='หน่วยสินค้า'>
                <Input placeholder='ระบุหน่อย' autoComplete='off' />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label='คุณสมบัติ' name='description'>
                <TextArea rows={4} placeholder='ระบุคุณสมบัติ' autoComplete='off' />
              </Form.Item>
            </Col>
          </Row>
          {isEdit && (
            <Form.Item label={"สถานะสินค้า"} name='productFreebiesStatus'>
              <Radio.Group>
                <Radio value={"ACTIVE"}>ใช้งาน</Radio>
                <Radio value={"INACTIVE"}>ปิดการใช้งาน</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          <Divider />
          <Row justify='space-between' gutter={16}>
            <Col span={21}>
              <Button
                typeButton='primary-light'
                htmlType='submit'
                size='large'
                style={{ width: 136 }}
                onClick={() => setShowCancel(!showCancel)}
                title='ยกเลิก'
              />
            </Col>
            <Col span={3}>
              <Button
                typeButton='primary'
                htmlType='submit'
                size='large'
                style={{ width: 136 }}
                loading={uploading}
                onClick={() => setShowModal(!showModal)}
                title='บันทึก'
              />
            </Col>
          </Row>
        </Form>
      </CardContainer>
      {showModal && (
        <Modal
          centered
          open={showModal}
          closable={false}
          onOk={createFreebie}
          onCancel={() => setShowModal(false)}
          destroyOnClose
          okText={"ยืนยัน"}
          cancelButtonProps={{ style: { color: color.primary, borderColor: color.primary } }}
        >
          {isEdit ? (
            <>
              <Text level={2}>ยืนยันการบันทึกสินค้า</Text>
              <br />
              <Text level={5} color='Text3'>
                โปรดตรวจสอบรายละเอียดของแถมอีกครั้งก่อนกดยืนยัน
              </Text>
              <br />
              <Text level={5} color='Text3'>
                เพราะอาจส่งผลต่อการแสดงผลข้อมูลในระบบ
              </Text>
            </>
          ) : (
            <>
              {" "}
              <Text level={2}>ยืนยันการบันทึกสินค้า</Text>
              <br />
              <Text level={5} color='Text3'>
                โปรดตรวจสอบรายละเอียดก่อนกดยืนยัน
              </Text>
            </>
          )}
        </Modal>
      )}
      {showCancel && (
        <Modal
          centered
          open={showCancel}
          closable={false}
          onOk={() => navigate(`/freebies/freebies`)}
          onCancel={() => setShowCancel(false)}
          destroyOnClose
          okText={"ยืนยัน"}
          cancelButtonProps={{ style: { color: color.primary, borderColor: color.primary } }}
        >
          <Text level={2}>ยกเลิกการแก้ไขของแถม</Text>
          <br />
          <Text level={5} color='Text3'>
            โปรดตรวจสอบรายละเอียดก่อนกดยืนยัน
          </Text>
        </Modal>
      )}
    </>
  );
};
