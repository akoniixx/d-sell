import { Col, Divider, Form, Row, Image, Upload, message, Checkbox, Radio, Space } from "antd";
import React, { useEffect, useState } from "react";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import { CardContainer } from "../../components/Card/CardContainer";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import image from "../../resource/image";
import Text from "../../components/Text/Text";
import ImgCrop from "../../components/ImgCrop/ImgCrop";
import styled from "styled-components";
import { color } from "../../resource";
import { ImageWithDeleteButton, UploadIcon } from "../../components/Image/Image";
import DatePicker, { TimePicker } from "../../components/DatePicker/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useForm } from "antd/es/form/Form";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { getBase64 } from "../../utility/uploadHelper";
import { RcFile } from "antd/lib/upload";
import { createHighlight, getHighlightById, updateHighlight } from "../../datasource/News";
import { useEffectOnce } from "react-use";

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

export const CreateHighLightNewsPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEdit = pathSplit[2] === "edithighlight";
  const id = pathSplit[3];

  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const [form] = useForm();

  const [newsUrl, setNewsUrl] = useState<string>();
  const [file, setFile] = useState<any>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffectOnce(() => {
    if (isEdit) {
      fetchData();
    }
  });

  const fetchData = async () => {
    setLoading(true);
    const { responseData } = await getHighlightById(id);
    console.log("fetchData", responseData);
    form.setFieldsValue({
      ...responseData,
      startDate: dayjs(responseData?.startDate),
      endDate: dayjs(responseData?.endDate),
      startTime: dayjs(responseData?.startDate),
      endTime: dayjs(responseData?.endDate),
      status: responseData.status === "true",
    });
    setImageUrl(responseData.imageUrl);
  };

  const onSave = async () => {
    const {
      topic,
      startDate,
      startTime,
      endDate,
      endTime,
      url,
      isShowOnSaleApp,
      isShowOnShopApp,
      status,
    } = form.getFieldsValue();

    const data = new FormData();
    data.append("company", company);
    data.append("topic", topic);
    data.append("isShowOnSaleApp", isShowOnSaleApp);
    data.append("isShowOnShopApp", isShowOnShopApp);
    data.append("status", status || "");
    data.append("url", url);
    data.append("createdBy", firstname + " " + lastname);
    data.append("updatedBy", firstname + " " + lastname);

    if (startDate && startTime)
      data.append(
        "startDate",
        dayjs(
          `${startDate?.format("YYYY-MM-DD")} ${startTime?.format("HH:mm")}:00.000`,
        ).toISOString(),
      );

    if (endDate && endTime)
      data.append(
        "endDate",
        dayjs(`${endDate?.format("YYYY-MM-DD")} ${endTime?.format("HH:mm")}:00.000`).toISOString(),
      );

    if (file) data.append("image", file);
    const cb = (res) => {
      console.log(res);
      if (res.success) {
        message.success("บันทึกข้อมูลสำเร็จ");
        navigate(`/news/highlight`);
      } else {
        message.error(res.userMessage || "บันทึกข้อมูลไม่สำเร็จ");
      }
    };
    const cbCatch = (e) => console.log(e);
    const cbFinal = () => setUploading(false);

    // console.log(data)

    try {
      setUploading(true);
      if (isEdit) {
        await updateHighlight(data).then(cb).catch(cbCatch).finally(cbFinal);
      } else {
        await createHighlight(data).then(cb).catch(cbCatch).finally(cbFinal);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <CardContainer>
      <PageTitleNested
        title='เพิ่มข่าวสารไฮไลท์'
        showBack
        onBack={() => navigate(`/news/highlight`)}
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "ข่าวสารไฮไลท์", path: `/news/highlight` },
              { text: "เพิ่มข่าวสารไฮไลท์", path: window.location.pathname },
            ]}
          />
        }
      />
      <Divider />
      <Form
        form={form}
        layout='vertical'
        initialValues={{ isShowSaleApp: true, isShowShopApp: true }}
        onFinish={onSave}
      >
        <Row justify={"space-between"} gutter={16}>
          <Col span={18}>
            <Col span={6}>
              <Text level={5} fontWeight={700}>
                รายละเอียดข้อมูลข่าวสาร
              </Text>
            </Col>
            <Row>
              <Col span={4}>
                <ImgCrop aspect={4 / 5} {...imgCropProps}>
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
              <Col span={20}>
                <Text level={6}>รูปภาพประกอบโปรโมชัน</Text>
                <br />
                <Text level={6} color='Text3'>
                  JPG, GIF or PNG. Size of
                  <br />
                  1200*1500px
                  <br />
                  4:5
                </Text>
              </Col>
            </Row>
            <Form.Item
              name='topic'
              label='ชื่อข่าวสาร'
              rules={[
                {
                  required: true,
                  message: "*โปรดระบุชื่อข่าวสาร",
                },
                {
                  max: 50,
                  message: "*ชื่อข่าวสารต้องมีความยาวไม่เกิน 50 ตัวอักษร",
                },
              ]}
            >
              <Input placeholder='ระบุชื่อข่าวสาร' />
            </Form.Item>
            <Row align='middle' gutter={16}>
              <Col span={6}>
                <Form.Item
                  name='startDate'
                  label='วันที่เริ่มเผยแผ่'
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
              <Col span={6}>
                <Form.Item
                  name='startTime'
                  label='เวลาเริ่ม'
                  initialValue={dayjs("00:00", "HH:mm")}
                >
                  <TimePicker allowClear={false} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name='endDate'
                  label='วันที่สิ้นสุดเผยแพร่'
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
              <Col span={6}>
                <Form.Item
                  name='endTime'
                  label='เวลาสิ้นสุด'
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
            <Row>
              <Col span={24}>
                <Form.Item name='url' label='URL ภาพข่าวสาร'>
                  <Input onChange={(e) => setNewsUrl(e.target.value)} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Text level={5} fontWeight={700}>
                  แอปพลิเคชัน
                </Text>
                <Form.Item name='isShowSaleApp' valuePropName='checked' noStyle>
                  <Checkbox>Sale App</Checkbox>
                </Form.Item>
                <Form.Item name='isShowShopApp' valuePropName='checked' noStyle>
                  <Checkbox>Shop App</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={24}>
                <Text level={5} fontWeight={700}>
                  <span style={{ color: color.error }}>*</span> สถานะ
                </Text>
                <Form.Item
                  name='status'
                  rules={[
                    {
                      required: true,
                      message: "*โปรดเลือกสถานะ",
                    },
                  ]}
                >
                  <Radio.Group style={{ width: "100%" }}>
                    <Space direction='vertical' style={{ width: "100%" }}>
                      <Radio value={true}>ใช้งาน</Radio>
                      <Radio value={false}>แบบร่าง</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <div
              style={{
                position: "absolute",
                margin: "108px 9px 0px",
                width: 270,
                height: 336,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundImage: `url(${imageUrl})`,
                backgroundColor: "#FFFFFF40",
              }}
            />
            <div
              style={{
                width: 288,
                height: 600,
                backgroundRepeat: "no-repeat",
                backgroundSize: "288px 600px",
                backgroundImage: `url(${image.indexHighLightApp})`,
              }}
            />
          </Col>
        </Row>
        <Divider />
        <Row justify='space-between' gutter={12}>
          <Col xl={3} sm={6}></Col>
          <Col xl={15} sm={6}></Col>
          <Col xl={3} sm={6}>
            <Button typeButton='primary' title='บันทึก' htmlType='submit' />
          </Col>
        </Row>
      </Form>
    </CardContainer>
  );
};
