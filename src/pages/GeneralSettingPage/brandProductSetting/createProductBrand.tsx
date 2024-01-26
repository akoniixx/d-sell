import { Col, Divider, message, Row, Upload, Form, Modal, Radio, Space } from "antd";
import { useForm } from "antd/lib/form/Form";
import { RcFile } from "antd/lib/upload";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CardContainer } from "../../../components/Card/CardContainer";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import ImgCrop from "../../../components/ImgCrop/ImgCrop";
import { getBase64 } from "../../../utility/uploadHelper";
import { ImageWithDeleteButton, UploadIcon } from "../../../components/Image/Image";
import Text from "../../../components/Text/Text";
import { color } from "../../../resource";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import { getProductBrandById, patchProductBrand, postProductBrand } from "../../../datasource/ProductDatasource";

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

export const CreateProductBrand: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const navigate = useNavigate();
  const [form] = useForm();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEdit = pathSplit[3] !== "create";
  const id = pathSplit[3];
  const [imageIsErr,setImageIsErr] = useState<boolean>(false)
  const [errMessege,setErrMessege] = useState<string>('')
  const [isErr,setIserr] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>();
  const [file, setFile] = useState<any>();
  const [showModal, setModal] = useState(false);

   const getById = async () => {
    const data = await getProductBrandById(id).then((res) => res.responseData);
    if (data.productBrandLogo) {
      setFile({
        uid: "-1",
        name: "image.png",
        status: "done",
        url: data.productBrandLogo,
      });
      setImageUrl(data.productBrandLogo);
    }
    form.setFieldsValue({
      productBrandId: data.productBrandId,
      productBrandName: data.productBrandName,
      isActive: data.isActive,
      productBrandLogo: data.productBrandLogo,
    });
  }; 

  useEffect(() => {
    if (isEdit) {
      getById();
    } else {
      form.setFieldsValue({
        productBrandId: "",
        isActive: true,
      });
    }
  }, []);

  useEffect(() => {
    if (isErr) {
      form.validateFields(['productBrandName']);
    }
  }, [isErr, form]);

  const onsubmit = () => {
   if(!file){
    setImageIsErr(true)

   }else{
    setImageIsErr(false)
    setModal(true)
   }
  }

  const saveBrand = async () => {
    const payload = form.getFieldsValue(true);
    const data = new FormData();
    data.append("productBrandName", payload.productBrandName);
    data.append("isActive", payload.isActive);
    data.append("createBy", `${userProfile.firstname} ${userProfile.lastname}`);
    data.append("updateBy", `${userProfile.firstname} ${userProfile.lastname}`);
    data.append("company",userProfile.company)

    if (file && file?.uid !== "-1") {
      data.append("file", file!);
      data.append("productBrandLogo", payload.productBrandLogo);
    } else if (file && file?.uid === "-1") {
      data.append("productBrandLogo", payload.productBrandLogo);
    }
    if (payload.productBrandId) {
      data.append("productBrandId", payload.productBrandId);
      await patchProductBrand(data).then((res) => {
        if (res.success) {
          setModal(false);
          setTimeout(() => {
            navigate(-1);
          }, 200);
        }else{
          setIserr(true)
          setErrMessege(res.developerMessage)
          setModal(false);
        }
      });
    } else {
      await postProductBrand(data).then((res) => {
        if (res.success) {
          setModal(false);
          setTimeout(() => {
            navigate(-1);
          }, 200);
        }else{
          setIserr(true)
          setErrMessege(res.developerMessage)
          setModal(false);
        }
      });
    }
  };
  const getRules = () => {
  const rules = [
    {
      required: true,
      message: "กรุณาระบุชื่อแบรนด์สินค้า",
    },
    {
      max: 50,
      message: "*ชื่อข่าวสารต้องมีความยาวไม่เกิน 50 ตัวอักษร",
    },
    
    isErr ? {
      validator: async (_, value) => {
        if ( isErr) {
          throw new Error(errMessege);
        }
      }
    } : {}
  ];
  return rules;
}

  return (
    <CardContainer>
      <PageTitleNested
        title={isEdit ? "ข้อมูลแบรนด์สินค้า" : "เพิ่มแบรนด์สินค้า"}
        showBack
        onBack={() => navigate(`/generalSettings/productBrandSetting`)}
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการแบรนด์สินค้า", path: `/generalSettings/productBrandSetting` },
              {
                text: isEdit ? "ข้อมูลแบรนด์สินค้า" : "เพิ่มแบรนด์สินค้า",
                path: window.location.pathname,
              },
            ]}
          />
        }
      />
      <Divider />
      <Form form={form} layout='vertical' onFinish={() => onsubmit()}>
        <Row justify={"space-between"} gutter={16}>
          <Col span={24}>
            <Row>
              <Col span={3}>
                {!imageUrl ? (
                  <ImgCrop aspect={1 / 1} {...imgCropProps}>
                    <UploadVeritical
                      listType='picture-card'
                      maxCount={1}
                      beforeUpload={(file: any) => {
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
                    /*   onChange={(img: any) => {}} */
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
                <Text level={6}>รูปภาพแบรนด์สินค้า</Text>
                <br />
                <Text level={6} color='Text3'>
                  JPG, GIF or PNG. Size of
                  <br />
                  500*500px or 1:1
                </Text>
              </Col>
            </Row>
            
            {imageIsErr&&<Text level={6} color='error'>กรุณาอัพโหลดรูปภาพแบรนด์สินค้า</Text>}
          </Col>
        </Row>
        <br />
        <Col span={10}>
          <Form.Item
            name='productBrandName'
            label='ชื่อยี่ห้อ/แบรนด์สินค้า (Product Brand) '
            rules={
              getRules()
            }  
          >
            <Input placeholder='ระบุชื่อแบรนด์สินค้า' autoComplete='off' onChange={()=> setIserr(false)} />
          </Form.Item>
        </Col>
        {isEdit && (
          <Col span={10}>
            <Form.Item
              name='isActive'
              label='สถานะแบรนด์'
              rules={[
                {
                  required: true,
                  message: "*โปรดระบุสถานะ",
                },
              ]}
            >
              <Radio.Group style={{ width: "100%" }}>
                <Radio value={true}>เปิดใช้งาน</Radio>
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
              onClick={() => navigate(`/generalSettings/productBrandSetting`)}
            />
          </Col>
          <Col xl={15} sm={6}></Col>
          <Col xl={3} sm={6}>
            <Button typeButton='primary' title='บันทึก' htmlType='submit' />
          </Col>
        </Row>
      </Form>
      {showModal && (
        <Modal
          centered
          open={showModal}
          closable={false}
          onOk={saveBrand}
          onCancel={() => setModal(false)}
          destroyOnClose
          cancelText={"ยกเลิก"}
          okText={"ยืนยัน"}
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
