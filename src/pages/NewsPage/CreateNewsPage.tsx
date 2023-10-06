import React, { useState, useRef, ReactNode, useEffect } from "react";
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
  FormInstance,
} from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { CameraOutlined, UnorderedListOutlined } from "@ant-design/icons";
import {
  getProductCategory,
  getProductDetail,
  updateProduct,
} from "../../datasource/ProductDatasource";
import { priceFormatter } from "../../utility/Formatter";
import Text from "../../components/Text/Text";
import { BrandEntity } from "../../entities/BrandEntity";
import { LOCATION_FULLNAME_MAPPING } from "../../definitions/location";
import { useEffectOnce } from "react-use";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import { ProductEntity } from "../../entities/PoductEntity";
import styled from "styled-components";
import Input from "../../components/Input/Input";
import color from "../../resource/color";
import TextArea from "../../components/Input/TextArea";
import { ProductCategoryEntity } from "../../entities/ProductCategoryEntity";
import {
  getProductFreebieDetail,
  getProductFreebiePromotionDetail,
  updateProductFreebie,
} from "../../datasource/PromotionDatasource";
import Select from "../../components/Select/Select";
import type { UploadFile } from "antd/es/upload/interface";
import image from "../../resource/image";
import CardSection from "../../components/Card/CardSection";
import ImgCrop from "../../components/ImgCrop/ImgCrop";
import { ImageWithDeleteButton, UploadIcon } from "../../components/Image/Image";
import { RcFile } from "antd/lib/upload";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles
import axios from "axios";
import { newsTypes } from "../../definitions/news";

const imgCropProps = {
  modalTitle: "ปรับขนาดรูปภาพ",
  modalOk: "ยืนยัน",
  modalCancel: "ยกเลิก",
};

const imageSize = "148px";

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

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const Preview = ({ form }: { form: FormInstance }) => {
  const topic = Form.useWatch("topic", form);
  const desc = Form.useWatch("desc", form);
  const file = Form.useWatch("file", form);
  const [imgUrl, setImgUrl] = useState<string | undefined>();
  useEffect(() => {
    if (file)
      getBase64(file as RcFile, (url) => {
        setImgUrl(url);
      });
  }, [file]);
  return (
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
        }}
      >
        {
          <UploadArea
            style={{
              width: 280,
              height: 280,
              backgroundImage: imgUrl ? `url("${imgUrl}")` : undefined,
              backgroundSize: "contain",
            }}
          >
            {!imgUrl && UploadIcon}
          </UploadArea>
        }
        <br />
        <Text level={4} fontWeight={700}>
          {topic || "หัวข้อข่าว"}
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
          style={{ overflow: "hidden", wordWrap: "break-word" }}
          dangerouslySetInnerHTML={{ __html: desc || "-" }}
        />
      </div>
    </Col>
  );
};

const ImageUpload = ({
  form,
  initFile,
  initUrl,
}: {
  form: FormInstance;
  initFile?: any;
  initUrl?: string;
}) => {
  const [imgFile, _setImgFile] = useState<any>(initFile);
  const [imgUrl, setImgUrl] = useState<string | undefined>(initUrl);
  const setImgFile = (file: any) => {
    _setImgFile(file);
    form.setFieldValue("file", file);
    getBase64(file as RcFile, (url) => {
      setImgUrl(url);
    });
  };
  return (
    <ImgCrop aspect={1} {...imgCropProps}>
      <UploadBox
        listType='picture-card'
        maxCount={1}
        beforeUpload={(file) => {
          const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
          if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
            return true;
          }
          setImgFile(file);
        }}
        customRequest={() => {
          console.log("customRequest");
        }}
        onChange={({ file }: any) => {
          return "success";
        }}
        onRemove={() => {
          setImgFile(undefined);
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
          // <Spin spinning={loading}>
          <ImageWithDeleteButton
            width={imageSize}
            height={imageSize}
            src={imgUrl}
            handleDelete={() => {
              setImgFile(undefined);
            }}
          />
          // </Spin>
        )}
      </UploadBox>
    </ImgCrop>
  );
};

export const NewsEdit: React.FC = (props: any) => {
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isFreebie = pathSplit[2] === "freebies";

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);

  const quillRef = useRef<any>(null);
  const outputDivRef = useRef<any>(null);

  const videoHandler = () => {
    const quill = quillRef?.current?.getEditor();
    const range = quill.getSelection();
    const url = prompt("Enter iframe URL:");
    const width = prompt("Enter iframe width:", "400px");
    const height = prompt("Enter iframe height:", "300px");
    const iframeStr = `<iframe width="${width}px" height="${height}px" src="${url}" frameborder="0"></iframe>`;
    quill.clipboard.dangerouslyPasteHTML(range.index, iframeStr);
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/png");
    input.click();

    input.onchange = async () => {
      const file = input?.files ? input?.files[0] : undefined;
      const formData = new FormData();

      formData.append("file", file || "");
      formData.append("resourceId", "a10a3057-2de6-4638-a226-3cbb5caf9113");
      formData.append("resource", "DRONER");
      formData.append("category", "PROFILE_IMAGE");
      // Save current cursor state
      const range = quillRef.current.getEditor().getSelection(true);

      // Insert temporary loading placeholder image
      quillRef.current
        .getEditor()
        .insertEmbed(
          range.index,
          "image",
          `${window.location.origin}/images/loaders/placeholder.gif`,
        );

      // Move cursor to right side of image (easier to continue typing)
      quillRef.current.getEditor().setSelection(range.index + 1);
      const width = prompt("Enter image width:", "100");
      const height = prompt("Enter image height:", "200");

      // axios
      //   .post("https://api-dnds-dev.iconkaset.com/file/upload", formData, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //       Authorization:
      //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE5YWYwYzgyLWFhOTYtNDBkOC1iNzk4LTAzMTM4NTk3NzI1MCIsInRlbGVwaG9uZU5vIjoiMDkzNTE5MTUyOSIsImlhdCI6MTY5MjE2MjQ1NywiZXhwIjoxNjk5OTM4NDU3fQ.mBIXdTD-YIT7JyHGMVdArEQ6Rz3GkZR_QxEkfNVaJ2s",
      //     },
      //   })
      //   .then(async (res) => {
      //     const image = await axios.get(
      //       `https://api-dnds-dev.iconkaset.com/file/geturl?path=${res.data.path}`,
      //     );
      //     quillRef.current.getEditor().deleteText(range.index, 1);
      //     const quill = quillRef.current.getEditor();
      //     quill.insertEmbed(range.index, "image", image.data.url);
      //     quill.formatText(range.index, 1, { width: `${width}px`, height: `${height}px` });
      //   });
      quillRef.current.getEditor().deleteText(range.index, 1);
      const quill = quillRef.current.getEditor();
      quill.insertEmbed(
        range.index,
        "image",
        "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      );
      quill.formatText(range.index, 1, { width: `${width}px`, height: `${height}px` });
    };
  };

  const modules = {
    toolbar: {
      handlers: {
        image: imageHandler,
        video: videoHandler,
      },
      container: [
        ["bold", "italic", "link", "image", "video"],
        [{ align: "" }, { align: "center" }, { align: "right" }],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    },
  };

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();

      quill.on("text-change", async () => {
        if (outputDivRef.current) {
          console.log("inner", quill.root.innerHTML);
          // const prettyHtml = await prettier.format(quill.root.innerHTML, {
          //   parser: "html",
          //   plugins: [htmlParser],
          // });
          // outputDivRef.current.textContent = prettyHtml;
        }
      });
    }
  }, []);

  const updateData = async () => {
    const { description, productCategoryId, productStatus } = form.getFieldsValue();
    const data = new FormData();
    try {
      setUploading(true);
      if (isFreebie) {
        const res = await updateProductFreebie(data);
        navigate(`/freebies/freebies`);
      } else {
        const res = await updateProduct(data);
        // navigate(`/PriceListPage/DistributionPage/${productId}`);
      }
      //message.success('บันทึกข้อมูลสำเร็จ');
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

  return (
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
                    <Form.Item noStyle name='file' valuePropName='file'>
                      <ImageUpload form={form} />
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
                      message: "*โปรดระบุชื่อโปรโมชัน",
                    },
                    {
                      max: 50,
                      message: "*ชื่อโปรโมชันต้องมีความยาวไม่เกิน 50 ตัวอักษร",
                    },
                  ]}
                >
                  <Input
                    placeholder='ระบุชื่อหัวข้อข่าว'
                    autoComplete='off'
                    // onBlur={(e) => setTopic(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label='รายละเอียดข่าว' name='desc' required>
                  <ReactQuill
                    ref={quillRef}
                    modules={modules}
                    // onChange={(e) => {
                    //   console.log("onChange", form.getFieldValue("desc"));
                    // }}
                  />
                </Form.Item>
                <br />
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
                <Form.Item name='type' label='แอปพลิเคชัน' required>
                  <Checkbox.Group
                    options={[
                      {
                        label: "Shop Application",
                        value: "1",
                      },
                      {
                        label: "Sale Application",
                        value: "2",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item name='type' label='สถานะ' required>
                  <Radio.Group>
                    <br />
                    <Space direction='vertical'>
                      {[
                        {
                          name: "ใช้งาน",
                          key: "1",
                        },
                        {
                          name: "แบบร่าง",
                          key: "2",
                        },
                      ].map(({ key, name }) => (
                        <Radio value={key} key={key}>
                          {name}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Preview form={form} />
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
      </Col>
    </Row>
  );
};
