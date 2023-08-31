import {
  Button,
  Col,
  Form,
  FormInstance,
  message,
  Row,
  Upload,
  Select as AntdSelect,
  Tooltip,
  Modal,
  Pagination,
} from "antd";
import React, { useEffect, useState, memo, useMemo } from "react";
import { FlexCol, FlexRow, ScrollContainer } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import styled from "styled-components";
import color from "../../../resource/color";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import DatePicker, { TimePicker } from "../../../components/DatePicker/DatePicker";
import TextArea from "../../../components/Input/TextArea";
import dayjs, { Dayjs } from "dayjs";
import { PromotionType, PROMOTION_TYPE_NAME } from "../../../definitions/promotion";
import { checkPromotionCode, getPromotion } from "../../../datasource/PromotionDatasource";
import ImgCrop from "../../../components/ImgCrop/ImgCrop";
import { RcFile } from "antd/lib/upload";
import icon from "../../../resource/icon";
import { normFile } from "../../../utility/uploadHelper";
import { useRecoilValue } from "recoil";
import promotionState from "../../../store/promotion";
import { Document, Page, pdfjs } from "react-pdf";
import PageSpin from "../../../components/Spin/pageSpin";
import axios from "axios";
import { ImageWithDeleteButton } from "../../../components/Image/Image";

const StyledDoc = styled(Document)`
  .react-pdf__Page__textContent.textLayer,
  .react-pdf__Page__annotations.annotationLayer {
    visibility: hidden;
    width: 0 !important;
    height: 0 !important;
  }
`;

const UploadHorizontal = styled(Upload)`
  .ant-upload,
  .ant-upload-list-picture-card-container,
  .ant-upload-picture-card-wrapper,
  .ant-upload-list-picture-card .ant-upload-list-item {
    height: 120px;
    width: 160px;
  }
`;

const UploadVeritical = styled(Upload)`
  .ant-upload,
  .ant-upload-list-picture-card-container,
  .ant-upload-picture-card-wrapper,
  .ant-upload-list-picture-card .ant-upload-list-item {
    height: 160px;
    width: 120px;
  }
`;

const UploadArea = styled.div`
  background: ${color.background1};
  border: 1px dashed ${color.Text3};
  border-radius: 6px;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

const MemoArea = styled.div`
  width: 100%;
  background: ${color.background1};
  border: 1px solid ${color.background2};
  border-radius: 8px;

  display: flex;
  align-items: center;
  padding: 16px;
`;

const MemoAreaItem = styled.div`
  padding: 0px 8px;
  display: flex;
  align-items: center;
`;

const UploadIcon = (
  <>
    <svg width='65' height='65' viewBox='0 0 65 65' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle opacity='0.36' cx='32.3335' cy='32.0176' r='32' fill='#E5EAEE' />
      <path
        d='M41.6667 29.3512C41.313 29.3512 40.9739 29.4917 40.7239 29.7418C40.4738 29.9918 40.3333 30.3309 40.3333 30.6846V35.1912L38.36 33.2179C37.6632 32.5266 36.7215 32.1387 35.74 32.1387C34.7585 32.1387 33.8168 32.5266 33.12 33.2179L32.1867 34.1646L28.88 30.8446C28.1832 30.1533 27.2415 29.7654 26.26 29.7654C25.2785 29.7654 24.3368 30.1533 23.64 30.8446L21.6667 32.8312V25.3512C21.6667 24.9976 21.8071 24.6585 22.0572 24.4084C22.3072 24.1584 22.6464 24.0179 23 24.0179H33.6667C34.0203 24.0179 34.3594 23.8774 34.6095 23.6274C34.8595 23.3773 35 23.0382 35 22.6846C35 22.3309 34.8595 21.9918 34.6095 21.7418C34.3594 21.4917 34.0203 21.3512 33.6667 21.3512H23C21.9391 21.3512 20.9217 21.7727 20.1716 22.5228C19.4214 23.273 19 24.2904 19 25.3512V41.6446C19.0035 42.6266 19.3952 43.5673 20.0895 44.2617C20.7839 44.9561 21.7247 45.3477 22.7067 45.3512H39.2933C39.6546 45.3484 40.0137 45.2945 40.36 45.1912V45.1912C41.1299 44.9753 41.8077 44.5127 42.2894 43.8744C42.7711 43.2362 43.0301 42.4575 43.0267 41.6579V30.6846C43.0267 30.5072 42.9914 30.3316 42.9227 30.1681C42.854 30.0046 42.7534 29.8564 42.6268 29.7322C42.5001 29.608 42.35 29.5104 42.1851 29.445C42.0202 29.3796 41.844 29.3477 41.6667 29.3512ZM23 42.6846C22.6464 42.6846 22.3072 42.5441 22.0572 42.294C21.8071 42.044 21.6667 41.7049 21.6667 41.3512V36.5912L25.52 32.7379C25.7149 32.5441 25.9785 32.4353 26.2533 32.4353C26.5282 32.4353 26.7918 32.5441 26.9867 32.7379L36.9467 42.6846H23ZM40.3333 41.3512C40.3248 41.6094 40.2414 41.8596 40.0933 42.0712L34.0667 36.0179L35.0133 35.0846C35.1089 34.987 35.223 34.9095 35.3489 34.8566C35.4749 34.8037 35.6101 34.7764 35.7467 34.7764C35.8833 34.7764 36.0185 34.8037 36.1444 34.8566C36.2703 34.9095 36.3844 34.987 36.48 35.0846L40.3333 38.9646V41.3512ZM44.3333 21.3512H43V20.0179C43 19.6643 42.8595 19.3251 42.6095 19.0751C42.3594 18.825 42.0203 18.6846 41.6667 18.6846C41.313 18.6846 40.9739 18.825 40.7239 19.0751C40.4738 19.3251 40.3333 19.6643 40.3333 20.0179V21.3512H39C38.6464 21.3512 38.3072 21.4917 38.0572 21.7418C37.8071 21.9918 37.6667 22.3309 37.6667 22.6846C37.6667 23.0382 37.8071 23.3773 38.0572 23.6274C38.3072 23.8774 38.6464 24.0179 39 24.0179H40.3333V25.3512C40.3333 25.7049 40.4738 26.044 40.7239 26.294C40.9739 26.5441 41.313 26.6846 41.6667 26.6846C42.0203 26.6846 42.3594 26.5441 42.6095 26.294C42.8595 26.044 43 25.7049 43 25.3512V24.0179H44.3333C44.687 24.0179 45.0261 23.8774 45.2761 23.6274C45.5262 23.3773 45.6667 23.0382 45.6667 22.6846C45.6667 22.3309 45.5262 21.9918 45.2761 21.7418C45.0261 21.4917 44.687 21.3512 44.3333 21.3512V21.3512Z'
        fill='#6B7995'
      />
    </svg>
  </>
);

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

interface Props {
  form: FormInstance;
  file1: Blob | undefined;
  file2: Blob | undefined;
  fileMemo: Blob | undefined;
  setFile1: (file: Blob | undefined) => void;
  setFile2: (file: Blob | undefined) => void;
  setFileMemo: (file: Blob | undefined) => void;
  imageUrl1: string | undefined;
  imageUrl2: string | undefined;
  fileMemoUrl?: string;
  setFileMemoUrl?: (url: string | undefined) => void;
  setImgUrl1: (setImgUrl1?: string) => void;
  setImgUrl2: (setImgUrl2?: string) => void;
  isEditing?: boolean;
}

export const PromotionCreateStep1 = ({
  form,
  file1,
  file2,
  fileMemo,
  setFile1,
  setFile2,
  setFileMemo,
  imageUrl1,
  imageUrl2,
  fileMemoUrl,
  setFileMemoUrl,
  setImgUrl1,
  setImgUrl2,
  isEditing,
}: Props) => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const promoStateValue = useRecoilValue(promotionState);

  const [promotions, setPromotions] = useState();

  const imgCropProps = {
    modalTitle: "ปรับขนาดรูปภาพ",
    modalOk: "ยืนยัน",
    modalCancel: "ยกเลิก",
  };

  useEffect(() => {
    if (!isEditing || promoStateValue.promotion) {
      fetchPromotion();
    }
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, [promoStateValue]);

  const fetchPromotion = async () => {
    try {
      const { data } = await getPromotion({ company });
      let promoList = data.map((p: any) => ({
        label: `${p.promotionName} (${p.promotionCode})`,
        value: `${p.promotionCode}`,
      }));
      if (isEditing) {
        const currentCode = promoStateValue.promotion?.promotionCode;
        promoList = promoList.filter((p: any) => p.value !== currentCode);
      }
      setPromotions(promoList);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Text level={5} fontWeight={700}>
        รายละเอียดข้อมูลเบื้องต้น
      </Text>
      <Form form={form} layout='vertical'>
        <FlexRow justify='start' style={{ padding: "20px 0" }}>
          <FlexCol style={{ marginRight: 16 }}>
            <Form.Item noStyle name='verticalImage' valuePropName='file'>
              <ImgCrop aspect={3 / 4} {...imgCropProps}>
                <UploadVeritical
                  listType='picture-card'
                  maxCount={1}
                  beforeUpload={(file) => {
                    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
                    if (!isJpgOrPng) {
                      message.error("You can only upload JPG/PNG file!");
                      return true;
                    }
                    setFile1(file);
                    getBase64(file as RcFile, (url) => {
                      setImgUrl1(url);
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
                    setFile1(undefined);
                  }}
                  showUploadList={false}
                  disabled={!!file1 || !!imageUrl1}
                >
                  {!file1 && !imageUrl1 ? (
                    <UploadArea
                      style={{
                        width: "120px",
                        height: "160px",
                      }}
                    >
                      {UploadIcon}
                    </UploadArea>
                  ) : (
                    <ImageWithDeleteButton
                      width='120px'
                      height='160px'
                      src={imageUrl1}
                      handleDelete={() => {
                        setFile1(undefined);
                        setImgUrl1(undefined);
                      }}
                    />
                  )}
                </UploadVeritical>
              </ImgCrop>
            </Form.Item>
          </FlexCol>
          <FlexCol style={{ marginRight: 32 }}>
            <Text level={6}>รูปภาพประกอบโปรโมชัน</Text>
            <Text level={6} color='Text3'>
              JPG, GIF or PNG. Size of
              <br />
              800*1200px
              <br />
              3:4
            </Text>
          </FlexCol>
          <FlexCol style={{ marginRight: 16 }}>
            <Form.Item noStyle name='horizontalImage' valuePropName='file'>
              <ImgCrop aspect={4 / 3} {...imgCropProps}>
                <UploadHorizontal
                  listType='picture-card'
                  maxCount={1}
                  beforeUpload={(file) => {
                    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
                    if (!isJpgOrPng) {
                      message.error("You can only upload JPG/PNG file!");
                      return true;
                    }
                    setFile2(file);
                    getBase64(file as RcFile, (url) => {
                      setImgUrl2(url);
                    });
                  }}
                  customRequest={() => {
                    console.log("customRequest");
                  }}
                  onChange={({ file }: any) => {
                    return "success";
                  }}
                  onRemove={() => {
                    setFile2(undefined);
                  }}
                  showUploadList={false}
                  disabled={!!file2 || !!imageUrl2}
                >
                  {!file2 && !imageUrl2 ? (
                    <UploadArea
                      style={{
                        width: "160px",
                        height: "120px",
                      }}
                    >
                      {UploadIcon}
                    </UploadArea>
                  ) : (
                    <ImageWithDeleteButton
                      width='160px'
                      height='120px'
                      src={imageUrl2}
                      handleDelete={() => {
                        setFile2(undefined);
                        setImgUrl2(undefined);
                      }}
                    />
                  )}
                </UploadHorizontal>
              </ImgCrop>
            </Form.Item>
          </FlexCol>
          <FlexCol>
            <Text level={6}>รูปภาพประกอบโปรโมชัน</Text>
            <Text level={6} color='Text3'>
              JPG, GIF or PNG. Size of
              <br />
              1200*800px
              <br />
              4:3
            </Text>
          </FlexCol>
        </FlexRow>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='promotionCode'
              label='รหัสโปรโมชัน'
              rules={[
                {
                  required: true,
                  message: "*โปรดระบุรหัสโปรโมชัน",
                },
                {
                  max: 20,
                  message: "*รหัสโปรโมชันต้องมีความยาวไม่เกิน 20 ตัวอักษร",
                },
                {
                  validator: async (rule, value) => {
                    if (isEditing) return;
                    const { success } = await checkPromotionCode({
                      promotionCode: value,
                      company,
                    });
                    if (!success) {
                      throw new Error();
                    }
                  },
                  message: "*รหัสโปรโมชันนี้ถูกใช้แล้ว",
                },
                {
                  pattern: /^[^*]*$/,
                  message: "*รหัสโปรโมชันต้องไม่มีเครื่องหมาย (*)",
                },
              ]}
            >
              <Input placeholder='ระบุรหัสโปรโมชัน' disabled={isEditing} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='promotionType'
              label='ประเภทโปรโมชัน'
              rules={[
                {
                  required: true,
                  message: "*โปรดเลือกประเภทโปรโมชัน",
                },
              ]}
            >
              <Select
                placeholder='เลือกประเภทโปรโมชัน'
                data={Object.entries(PROMOTION_TYPE_NAME).map(([key, label]) => ({
                  key: key,
                  value: key,
                  label: `${label}`,
                }))}
                disabled={isEditing}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='promotionName'
              label='ชื่อโปรโมชัน'
              rules={[
                {
                  required: true,
                  message: "*โปรดระบุชื่อโปรโมชัน",
                },
                {
                  max: 50,
                  message: "*ชื่อโปรโมชันต้องมีความยาวไม่เกิน 50 ตัวอักษร",
                },
              ]}
            >
              <Input placeholder='ระบุชื่อโปรโมชัน' autoComplete='off' />
            </Form.Item>
          </Col>
        </Row>
        <Row align='middle' gutter={16}>
          <Col span={12}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='startDate'
                  label='วันที่เริ่มโปรโมชัน'
                  rules={[
                    {
                      required: true,
                      message: "*โปรดเลือกวันที่เริ่มโปรโมชัน",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} enablePast />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='startTime'
                  label='เวลาเริ่มโปรโมชัน'
                  initialValue={dayjs("00:00", "HH:mm")}
                >
                  <TimePicker allowClear={false} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='endDate'
                  label='วันที่สิ้นสุดโปรโมชัน'
                  rules={[
                    {
                      required: true,
                      message: "*โปรดเลือกวันที่สิ้นสุดโปรโมชัน",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    disabledDate={(current: Dayjs) => {
                      const startDate = form.getFieldValue("startDate");
                      return current && current.isBefore(dayjs(startDate));
                    }}
                    enablePast
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='endTime'
                  label='เวลาสิ้นสุดโปรโมชัน'
                  initialValue={dayjs("23:59", "HH:mm")}
                >
                  <TimePicker
                    allowClear={false}
                    disabledTime={(now) => {
                      const startDate = form.getFieldValue("startDate") as Dayjs;
                      const endDate = form.getFieldValue("endDate") as Dayjs;
                      const startTime = form.getFieldValue("startTime") as Dayjs;
                      const isSameDay = startDate && endDate && startDate?.isSame(endDate, "year");
                      if (!isSameDay) return {};

                      const hour = startTime.hour();
                      const minute = startTime.minute();
                      const hours: number[] = [];
                      const minutes: number[] = [];
                      for (let i = 0; i < hour; i++) {
                        hours.push(i);
                      }
                      for (let i = 0; i <= minute; i++) {
                        minutes.push(i);
                      }
                      return {
                        disabledHours: () => hours,
                        disabledMinutes: (selectedHour: number) =>
                          selectedHour === hour ? minutes : [],
                      };
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row align='middle'>
          <Text level={5} fontWeight={700}>
            ไฟล์ Memo Promotion
          </Text>
          &nbsp;
          <Tooltip title='ไฟล์รูปแบบ PDF ที่เป็นต้นฉบับของโปรโมชัน ไว้สำหรับอ้างอิงดูเอกสารต้นฉบับผ่านทางหน้าแอปพลิเคชัน Sellcoda Sale'>
            <img style={{ width: 16, height: 16 }} src={icon.infoIcon} />
          </Tooltip>
        </Row>
        <br />
        <Text level={5} color='Text3'>
          โปรดเลือกไฟล์ Memo Promotion ที่ต้องการแสดงในหน้า Application
        </Text>
        <br />
        <Row>
          <Col span={12}>
            <MemoArea>
              <MemoAreaItem style={{ width: 124 }}>
                <Form.Item
                  noStyle
                  name='memoFile'
                  valuePropName='fileList'
                  getValueFromEvent={normFile}
                >
                  <Upload
                    beforeUpload={(file) => {
                      const isPDF = file.type === "application/pdf";
                      if (!isPDF) {
                        message.error(`อัปโหลดเฉพาะไฟล์ pdf เท่านั้น`);
                        return false;
                      }
                      return isPDF || Upload.LIST_IGNORE;
                    }}
                    customRequest={({ file, onSuccess }) => {
                      if (onSuccess) {
                        onSuccess(file);
                      }
                    }}
                    onChange={({ file }: any) => {
                      if (file.status === "uploading") {
                        setFileMemo(file);
                        file.status = "done";
                      }
                      if (file.status === "done") {
                        setFileMemo(file);
                      }
                      return "success";
                    }}
                    onRemove={() => {
                      setFileMemo(undefined);
                    }}
                    maxCount={1}
                    showUploadList={false}
                  >
                    <Button type='primary' icon={<UploadOutlined />}>
                      เลือกไฟล์
                    </Button>
                  </Upload>
                </Form.Item>
              </MemoAreaItem>
              <MemoAreaItem style={{ width: "calc(100% - 156px)" }}>
                <svg
                  width='24'
                  height='31'
                  viewBox='0 0 24 31'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M20.0596 0.0175781L24 3.84855V5.85091V27.5176C24 28.8983 22.8487 30.0176 21.4286 30.0176H2.57143C1.15127 30.0176 0 28.8983 0 27.5176V2.51758C0 1.13687 1.15127 0.0175781 2.57143 0.0175781H18H20.0596ZM18 1.18424H2.57143C1.85609 1.18424 1.26867 1.71671 1.2056 2.39622L1.2 2.51758V27.5176C1.2 28.213 1.74768 28.7842 2.4466 28.8455L2.57143 28.8509H21.4286C22.1439 28.8509 22.7313 28.3184 22.7944 27.6389L22.8 27.5176V5.85091H18V1.18424ZM22.8 4.68424L22.8 4.33174L19.5626 1.18424H19.2V4.68424H22.8Z'
                    fill='#464E5F'
                  />
                  <path d='M4 15.6846H5.83333V17.5179H4V15.6846Z' fill='#464E5F' />
                  <path
                    d='M6.75 12.0176H8.98014C9.41286 12.0176 9.74294 12.0895 9.97039 12.2334C10.2034 12.372 10.3587 12.5718 10.4364 12.833C10.5196 13.0888 10.5612 13.4246 10.5612 13.8403C10.5612 14.24 10.5224 14.5704 10.4447 14.8315C10.367 15.0873 10.2117 15.2925 9.97871 15.4471C9.74571 15.5963 9.40731 15.6709 8.9635 15.6709H7.80682V17.5176H6.75V12.0176ZM8.614 14.7916C8.89138 14.7916 9.08832 14.7676 9.20482 14.7196C9.32687 14.6663 9.40454 14.5784 9.43782 14.4558C9.47665 14.3279 9.49607 14.1227 9.49607 13.8403C9.49607 13.5578 9.47665 13.3553 9.43782 13.2327C9.40454 13.1048 9.32964 13.0169 9.21314 12.9689C9.09664 12.9209 8.90248 12.8969 8.63064 12.8969H7.80682V14.7916H8.614Z'
                    fill='#464E5F'
                  />
                  <path
                    d='M11.4471 12.0176H13.1696C13.8741 12.0176 14.3734 12.0949 14.6674 12.2494C14.967 12.3986 15.1529 12.6491 15.225 13.0009C15.3027 13.3473 15.3415 13.9362 15.3415 14.7676C15.3415 15.599 15.3027 16.1905 15.225 16.5423C15.1529 16.8887 14.967 17.1392 14.6674 17.2937C14.3734 17.443 13.8741 17.5176 13.1696 17.5176H11.4471V12.0176ZM13.1197 16.6382C13.5246 16.6382 13.7965 16.6089 13.9352 16.5503C14.0794 16.4917 14.1709 16.3451 14.2098 16.1106C14.2542 15.8761 14.2763 15.4284 14.2763 14.7676C14.2763 14.1067 14.2542 13.6591 14.2098 13.4246C14.1709 13.1901 14.0794 13.0435 13.9352 12.9849C13.7965 12.9263 13.5246 12.8969 13.1197 12.8969H12.5039V16.6382H13.1197Z'
                    fill='#464E5F'
                  />
                  <path
                    d='M16.3879 17.5176V12.0176H19.5833V12.8969H17.4447V14.4318H19.3337V15.3192H17.4447V17.5176H16.3879Z'
                    fill='#464E5F'
                  />
                </svg>
                &nbsp;
                <Text
                  level={6}
                  color='Text3'
                  onClick={async () => {
                    try {
                      if (fileMemo && (fileMemo as any)?.originFileObj) {
                        const file = new Blob([(fileMemo as any)?.originFileObj], {
                          type: "application/pdf",
                        });
                        const fileURL = URL.createObjectURL(file);
                        const pdfWindow = window.open();
                        if (pdfWindow) pdfWindow.location.href = fileURL || "";
                      } else if (fileMemoUrl) {
                        const pdfWindow = window.open();
                        if (pdfWindow) pdfWindow.location.href = fileMemoUrl || "";
                      }
                    } catch (error) {
                      return { error };
                    }
                  }}
                  style={{ cursor: fileMemo || fileMemoUrl ? "pointer" : "default" }}
                >
                  {(fileMemo as any)?.originFileObj?.name ||
                    (fileMemoUrl && `${fileMemoUrl?.substring(0, 20)}...`) ||
                    "โปรดเลือกไฟล์ .PDF"}
                </Text>
              </MemoAreaItem>
              <MemoAreaItem
                style={{
                  width: 32,
                  visibility:
                    (fileMemo as any)?.originFileObj || fileMemoUrl ? "visible" : "hidden",
                }}
              >
                <DeleteOutlined
                  style={{ color: color.error, cursor: "pointer" }}
                  onClick={() => {
                    Modal.confirm({
                      title: "ลบไฟล์ Memo Promotion",
                      onOk: () => {
                        setFileMemo(undefined);
                        if (setFileMemoUrl) setFileMemoUrl(undefined);
                      },
                    });
                  }}
                />
              </MemoAreaItem>
            </MemoArea>
          </Col>
        </Row>
        <br />
        <br />
        <Text level={5} fontWeight={700}>
          อ้างอิงเลขที่โปรโมชันที่เกี่ยวข้อง
        </Text>
        <br />
        <Text level={5} color='Text3'>
          โปรดเลือกเลขที่โปรโมชันอ้างอิงโปรโมชันที่เกี่ยวข้อง สามารถเลือกได้มากกว่า 1 โปรโมชัน
        </Text>
        <br />
        <br />
        <Row>
          <Col span={12}>
            <Form.Item name='referencePromotion'>
              <AntdSelect
                mode='multiple'
                placeholder='เลือกโปรโมชันอ้างอิงโปรโมชันที่เกี่ยวข้อง'
                onChange={() => {
                  console.log();
                }}
                style={{ width: "100%", lineHeight: "40px" }}
                options={promotions || []}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name='comment' label='หมายเหตุเพิ่มเติม'>
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
