import React, { useState, useRef, ReactNode, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  Image,
  Card,
  Form,
  Upload,
  Radio,
  Divider,
  Spin,
  message,
  Checkbox,
  Space,
  Modal,
} from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import Text from "../../components/Text/Text";
import { useEffectOnce } from "react-use";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import styled from "styled-components";
import Input from "../../components/Input/Input";
import color from "../../resource/color";
import ImgCrop from "../../components/ImgCrop/ImgCrop";
import { ImageWithDeleteButton, UploadIcon } from "../../components/Image/Image";
import { RcFile } from "antd/lib/upload";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { newsTypes } from "../../definitions/news";
import ImageResize from "quill-image-resize-module-react";
import { inputNumberValidator } from "../../utility/validator";
import { createNews, getNewsById, updateNews } from "../../datasource/News";
import DatePicker, { TimePicker } from "../../components/DatePicker/DatePicker";
import dayjs from "dayjs";
import axios from "axios";

Quill.register("modules/imageResize", ImageResize);

const imgCropProps = {
  modalTitle: "ปรับขนาดรูปภาพ",
  modalOk: "ยืนยัน",
  modalCancel: "ยกเลิก",
};

const imageSize = "148px";
const previewImageStyle = {
  width: 280,
  height: 280,
};

const UploadBox = styled(Upload)`
  .ant-upload,
  .ant-upload-list-picture-card-container,
  .ant-upload-picture-card-wrapper,
  .ant-upload-list-picture-card .ant-upload-list-item {
    height: ${imageSize};
    width: ${imageSize};
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

const QuillContainer = styled.div`
  .ql-toolbar.ql-snow {
    border-radius: 4px 4px 0 0 !important;
  }
  .ql-container.ql-snow {
    border-radius: 0 0 4px 4px !important;
  }
  .ql-editor {
    max-height: 80vh;
    overflow: auto;
  }
`;

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export const NewsEdit: React.FC = (props: any) => {
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isEdit = pathSplit[2] === "edit";
  const id = pathSplit[3];

  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const [form] = Form.useForm();
  const [vidForm] = Form.useForm();

  const navigate = useNavigate();

  const [newsData, setNewsData] = useState();

  const [loading, setLoading] = useState(false);
  const [imgFile, setImgFile] = useState<any>();
  const [imgUrl, setImgUrl] = useState<any>();
  const [uploading, setUploading] = useState(false);
  const [topic, setTopic] = useState("หัวข้อข่าว");
  const [content, setContent] = useState("-");
  const [status, setStatus] = useState<string>();

  const [showVideoModal, setVideoModal] = useState(false);
  const [vidIndex, setVidIndex] = useState();

  const quillRef = useRef<any>(null);
  const outputDivRef = useRef<any>(null);

  const onSubmitVideo = () => {
    const { width, height, url } = vidForm.getFieldsValue();
    console.log({ width, height, url });
    const quill = quillRef?.current?.getEditor();
    // test url https://www.youtube.com/embed/0utfT0nbuTA?si=Mgq1KHKJypkOdoyD
    // test url https://www.youtube.com/watch?v=KMoe95BTwew
    // test url https://youtu.be/KMoe95BTwew?si=RJek2YfcpY-B-njR
    const src = url?.replace("youtu.be", "www.youtube.com/embed/").replace("watch?v=", "embed/");
    const iframeStr = `<iframe width="${width}" height="${height}" style="overflow:hidden;" src="${src}" frameborder="0" clipboard-write; encrypted-media; ></iframe>`;
    quill.clipboard.dangerouslyPasteHTML(vidIndex, iframeStr);

    vidForm.resetFields();
    setVideoModal(false);
  };

  const videoHandler = useMemo(() => {
    return () => {
      const quill = quillRef?.current?.getEditor();
      const range = quill.getSelection();
      setVidIndex(range.index);
      setVideoModal(true);
    };
  }, []);

  const modules = {
    toolbar: {
      handlers: {
        video: videoHandler,
      },
      container: [
        ["bold", "italic", "link", "image", "video"],
        [{ size: ["small", false, "large", "huge"] }],
        [{ align: "" }, { align: "center" }, { align: "right" }],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
  };

  useEffectOnce(() => {
    if (isEdit) fetchData();
  });

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();

      quill.on("text-change", async () => {
        if (outputDivRef.current) {
          console.log(quill.root.innerHTML);
          // const prettyHtml = await prettier.format(quill.root.innerHTML, {
          //   parser: "html",
          //   plugins: [htmlParser],
          // });
          // outputDivRef.current.textContent = prettyHtml;
          // setContent(quill.root.innerHTML);
        }
      });
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { responseData } = await getNewsById(id);
      setNewsData(responseData);

      const app: string[] = [];
      if (responseData?.isShowOnSaleApp) app.push("isShowOnSaleApp");
      if (responseData?.isShowOnShopApp) app.push("isShowOnShopApp");
      form.setFieldsValue({
        ...responseData,
        app,
        startDate: dayjs(responseData?.startDate),
        endDate: dayjs(responseData?.endDate),
        startTime: dayjs(responseData?.startDate),
        endTime: dayjs(responseData?.endDate),
      });
      setStatus(responseData?.status);
      setImgUrl(responseData?.imageUrl);

      // set Content
      setContent(responseData?.contentFile);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async () => {
    const { topic, type, app, startDate, startTime } = form.getFieldsValue();
    const data = new FormData();

    const quill = quillRef.current.getEditor();
    console.log(form.getFieldsValue(), quill.root.innerHTML);

    const content = new Blob([quill.root.innerHTML], { type: "text/html" });

    if (isEdit) data.append("newsId", id);

    data.append("company", company);
    data.append("topic", topic);
    data.append("isShowOnSaleApp", app?.includes("isShowOnSaleApp"));
    data.append("isShowOnShopApp", app?.includes("isShowOnShopApp"));
    data.append("status", status || "");
    data.append("type", type);
    data.append("createdBy", firstname + " " + lastname);

    if (startDate && startTime)
      data.append(
        "publishTime",
        dayjs(
          `${startDate?.format("YYYY-MM-DD")} ${startTime?.format("HH:mm")}:00.000`,
        ).toISOString(),
      );

    if (imgFile) data.append("image", imgFile);
    if (content) data.append("content", content);

    const cb = (res) => {
      console.log(res);
      if (res.success) {
        message.success("บันทึกข้อมูลสำเร็จ");
        navigate(`/${pathSplit[1]}/list`);
      } else {
        message.error(res.userMessage || "บันทึกข้อมูลไม่สำเร็จ");
      }
    };
    const cbCatch = (e) => console.log(e);
    const cbFinal = () => setUploading(false);

    try {
      setUploading(true);
      if (isEdit) {
        await updateNews(data).then(cb).catch(cbCatch).finally(cbFinal);
      } else {
        await createNews(data).then(cb).catch(cbCatch).finally(cbFinal);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setUploading(false);
    }
  };

  const PageTitle = () => {
    return (
      <PageTitleNested
        title={"เพิ่มข่าวสาร"}
        showBack
        onBack={() => navigate(`/${pathSplit[1]}/list`)}
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการข่าวสาร", path: `/${pathSplit[1]}/list` },
              { text: "เพิ่มข่าวสาร", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };

  return loading ? (
    <div className='container '>
      <Card loading />
    </div>
  ) : (
    <Row justify={"space-between"} gutter={8}>
      <Col span={24}>
        <CardContainer>
          <PageTitle />
          <Divider />
          <Form form={form} layout='vertical' onFinish={updateData}>
            <Row gutter={16}>
              <Col style={{ width: "calc(100% - 320px)" }}>
                <Text level={5} fontWeight={700}>
                  รายละเอียดข้อมูลข่าวสาร
                </Text>
                <FlexRow style={{ padding: "16px 0px" }}>
                  <FlexCol style={{ marginRight: 16 }}>
                    <Form.Item noStyle name='image' valuePropName='file'>
                      <ImgCrop aspect={1} {...imgCropProps}>
                        <UploadBox
                          listType='picture-card'
                          maxCount={1}
                          beforeUpload={(file) => {
                            const isJpgOrPng =
                              file.type === "image/jpeg" || file.type === "image/png";
                            if (!isJpgOrPng) {
                              message.error("You can only upload JPG/PNG file!");
                              return true;
                            }
                            setImgFile(file);
                            getBase64(file as RcFile, (url) => {
                              setImgUrl(url);
                            });
                          }}
                          customRequest={() => {
                            console.log("customRequest");
                          }}
                          onChange={({ file }: any) => {
                            return "success";
                          }}
                          onRemove={() => {
                            setImgFile(undefined);
                            setImgUrl(undefined);
                          }}
                          showUploadList={false}
                          disabled={!!imgFile || !!imgUrl}
                        >
                          {!imgFile && !imgUrl ? (
                            <UploadArea
                              style={{
                                width: imageSize,
                                height: imageSize,
                              }}
                            >
                              {UploadIcon}
                            </UploadArea>
                          ) : (
                            <Spin spinning={loading}>
                              <ImageWithDeleteButton
                                width={imageSize}
                                height={imageSize}
                                src={imgUrl}
                                handleDelete={() => {
                                  setImgFile(undefined);
                                  setImgUrl(undefined);
                                }}
                              />
                            </Spin>
                          )}
                        </UploadBox>
                      </ImgCrop>
                    </Form.Item>
                  </FlexCol>
                  <FlexCol>
                    <Text level={6}>รูปภาพประกอบข่าวสาร</Text>
                    <Text level={6} color='Text3'>
                      JPG, GIF or PNG. Size of
                      <br />
                      1200*1200px
                      <br />
                      1:1
                    </Text>
                  </FlexCol>
                </FlexRow>
                <br />
                <Form.Item
                  name='topic'
                  label='หัวข้อข่าว'
                  rules={[
                    {
                      required: true,
                      message: "*โปรดระบุหัวข้อข่าว",
                    },
                    {
                      max: 50,
                      message: "*หัวข้อข่าวต้องมีความยาวไม่เกิน 50 ตัวอักษร",
                    },
                  ]}
                >
                  <Input
                    placeholder='ระบุหัวข้อข่าว'
                    autoComplete='off'
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </Form.Item>
                <Form.Item name='content' label='รายละเอียดข่าว' required>
                  <QuillContainer>
                    <ReactQuill
                      ref={quillRef}
                      modules={modules}
                      onChange={(c) => setContent(c)}
                      value={content}
                    />
                  </QuillContainer>
                </Form.Item>
                <Form.Item name='type' label='หมวดหมู่' initialValue={newsTypes.NEWS.key} required>
                  <Radio.Group>
                    <br />
                    <Space direction='vertical'>
                      {Object.values(newsTypes).map(({ key, name }) => (
                        <Radio value={key} key={key}>
                          {name}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name='app'
                  label='แอปพลิเคชัน'
                  required
                  rules={[
                    {
                      validator(rule, value, callback) {
                        if (value.length <= 0) {
                          return Promise.reject("กรุณาเลือกอย่างน้อย 1 แอปพลิเคชัน");
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Checkbox.Group
                    options={[
                      {
                        label: "Shop Application",
                        value: "isShowOnShopApp",
                      },
                      {
                        label: "Sale Application",
                        value: "isShowOnSaleApp",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item name='status' label='สถานะ' required>
                  <Radio checked={status !== "DRAFT"} onChange={() => setStatus("PUBLISHED")}>
                    ใช้งาน
                  </Radio>
                  <br />
                  <FlexCol>
                    {[
                      {
                        name: "เผยแพร่ทันที",
                        key: "PUBLISHED",
                        isSub: true,
                      },
                      {
                        name: "ตั้งเวลาเผยแพร่",
                        key: "WAITING",
                        isSub: true,
                        extra: (
                          <Row gutter={16} style={{ padding: "4px 0" }}>
                            <Col span={12}>
                              <Form.Item name='startDate' required>
                                <DatePicker style={{ width: "100%" }} enablePast />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item name='startTime' initialValue={dayjs("00:00", "HH:mm")}>
                                <TimePicker allowClear={false} />
                              </Form.Item>
                            </Col>
                          </Row>
                        ),
                      },
                      {
                        name: "แบบร่าง",
                        key: "DRAFT",
                      },
                    ]
                      .filter(({ isSub }) => {
                        if (status === "DRAFT") {
                          return !isSub;
                        }
                        return true;
                      })
                      .map(({ key, name, isSub, extra }) => (
                        <div
                          style={{ ...(isSub ? { paddingLeft: 24 } : {}), width: "100%" }}
                          key={key}
                        >
                          <Radio
                            key={key}
                            checked={status === key}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setStatus(key);
                              }
                            }}
                          >
                            {name}
                          </Radio>
                          {status === key && (
                            <>
                              <br />
                              {extra}
                            </>
                          )}
                        </div>
                      ))}
                  </FlexCol>
                </Form.Item>
              </Col>
              <Col style={{ width: "320px" }}>
                <Text level={5} fontWeight={700}>
                  ภาพตัวอย่างในแอปพลิเคชัน
                </Text>
                <div
                  style={{
                    padding: 12,
                    border: `1px solid ${color.background2}`,
                    borderRadius: 8,
                    marginTop: 8,
                    maxHeight: "90vh",
                    overflowX: "hidden",
                    overflowY: "auto",
                  }}
                >
                  <UploadArea style={previewImageStyle}>
                    {imgUrl ? <img src={imgUrl} style={previewImageStyle} /> : UploadIcon}
                  </UploadArea>
                  <br />
                  <Text level={4} fontWeight={700}>
                    {topic}
                  </Text>
                  <Row>
                    <Text level={6} color='Text3'>
                      13 พ.ย. 2564, 12:00 น.
                    </Text>
                    &nbsp;&nbsp;
                    <Text level={6} color='Text3'>
                      อ่านแล้ว 0
                    </Text>
                  </Row>
                  <Divider />
                  <div
                    className='view ql-editor'
                    style={{
                      display: "block",
                      wordBreak: "break-word",
                      wordWrap: "break-word",
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                  ></div>
                </div>
              </Col>
            </Row>
            <Divider />
            <Row align='middle' justify='end'>
              <Button
                type='primary'
                htmlType='submit'
                size='large'
                style={{ width: 136 }}
                loading={uploading}
              >
                บันทึก
              </Button>
            </Row>
          </Form>
        </CardContainer>
        <Modal
          title='เพิ่มวิดีโอ'
          open={showVideoModal}
          onCancel={() => setVideoModal(false)}
          footer={null}
        >
          <Form form={vidForm} layout='vertical' onFinish={onSubmitVideo}>
            <Form.Item
              name='width'
              label='ความกว้าง'
              required
              initialValue={280}
              rules={[
                {
                  message: "กรอกตัวเลข",
                  validator: inputNumberValidator,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='height'
              label='ความสูง'
              required
              initialValue={168}
              rules={[
                {
                  message: "กรอกตัวเลข",
                  validator: inputNumberValidator,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name='url' label='Video URI' required rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <br />
            <Form.Item>
              <Row justify='end'>
                <Button type='primary' htmlType='submit'>
                  OK
                </Button>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
      </Col>
    </Row>
  );
};
