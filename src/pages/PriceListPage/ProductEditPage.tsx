import React, { useState, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Row, Col, Image, Card, Form, Upload, Radio, Divider } from "antd";
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
  updateProductFreebie,
} from "../../datasource/PromotionDatasource";
import Select from "../../components/Select/Select";
import type { UploadFile } from "antd/es/upload/interface";
import image from "../../resource/image";
import CardSection from "../../components/Card/CardSection";

const Container = styled.div`
  margin: 32px 0px 10px 0px;
`;

const ProdImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  color: grey;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PriceContainer = styled.div`
  padding: 20px;
  background: ${color["background1"]};
  border-radius: 8px;
`;

interface DescProps {
  name: string;
  label: string;
  value?: ReactNode;
  enable?: boolean;
  customInput?: ReactNode;
  withSpace?: boolean;
  customSpan?: number;
  required?: boolean;
}

const ProdFormItem = ({
  name,
  label,
  value,
  enable,
  customInput,
  withSpace,
  customSpan,
  required,
}: DescProps) => {
  return (
    <>
      <Col xl={customSpan ? customSpan : 12} sm={24}>
        <Form.Item label={label} initialValue={value} name={name} rules={[{ required }]}>
          {customInput ? customInput : <Input disabled={!enable} />}
        </Form.Item>
      </Col>
      {withSpace && <Col xl={customSpan ? 24 - customSpan : 12} sm={0} />}
    </>
  );
};

export const DistributionPageEdit: React.FC = (props: any) => {
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isFreebie = pathSplit[2] === "freebies";

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState<ProductEntity>();
  const [categories, setCategories] = useState<Array<ProductCategoryEntity>>();
  const [file, setFile] = useState<any>();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>();
  const [isRemoved, setRemoved] = useState(false);

  useEffectOnce(() => {
    fetchProduct();
  });

  const fetchProduct = async () => {
    try {
      setLoading(true);

      let data;
      const id = parseInt(pathSplit[4]);
      if (isFreebie) {
        data = await getProductFreebieDetail(id);
      } else {
        data = await getProductDetail(parseInt(pathSplit[4]));
      }

      const userProfile = JSON.parse(localStorage.getItem("profile")!);
      const { company } = userProfile;
      const categories = await getProductCategory(company);

      setDataState(data);
      setCategories(categories);

      form.setFieldsValue({
        saleUOM: data.qtySaleUnit + " " + (company === "ICPL" ? data.baseUOM : data.packingUOM),
        unitPrice:
          priceFormatter(parseFloat(data.unitPrice || "")) +
          "/" +
          (company === "ICPL" ? data.baseUOM : data.packingUOM),
        basePrice:
          priceFormatter(parseFloat(data.marketPrice || "")) +
          "/" +
          (data.saleUOMTH || data.saleUOM),
      });

      const url = isFreebie ? data.productFreebiesImage : data.productImage;
      if (url) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url,
          },
        ]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const mockPromoton: any = [
    {
      key: 1,
      name: "MKT 02/66 ราคาพิเศษ 123",
      img: image.error404,
      code: "Memo 16-64",
    },
    {
      key: 2,
      name: "MKT 02/66 ราคาพิเศษ 456",
      img: image.error404,
      code: "Memo 16-65",
    },
  ];

  const updateData = async () => {
    const { description, productCategoryId, productStatus } = form.getFieldsValue();
    const data = new FormData();
    if (isFreebie) {
      data.append("productFreebiesId", `${productFreebiesId}`);
      data.append("productFreebiesStatus", `${productStatus}`);
    } else {
      data.append("productId", `${productId}`);
      data.append("description", description || "");
      data.append("productCategoryId", productCategoryId);
    }

    if (!isRemoved && productImage) {
      data.append("productImage", productImage);
    }
    if (!isRemoved && productFreebiesImage) {
      data.append("productFreebiesImage", productFreebiesImage);
    }
    if (file && file.uid !== "-1") {
      data.append("file", file!);
    }

    try {
      setUploading(true);
      if (isFreebie) {
        const res = await updateProductFreebie(data);
        navigate(`/freebies/freebies`);
      } else {
        const res = await updateProduct(data);
        navigate(`/PriceListPage/DistributionPage/${productId}`);
      }
      // message.success('บันทึกข้อมูลสำเร็จ');
    } catch (e) {
      console.log(e);
    } finally {
      setUploading(false);
    }
  };

  const {
    baseUnitOfMeaEn,
    baseUnitOfMeaTh,
    commonName,
    company,
    description,
    productBrand,
    productCategoryId,
    productCodeNAV,
    productGroup,
    productId,
    productImage,
    productLocation,
    productName,
    productStatus,
    productFreebiesId,
    productFreebiesCodeNAV,
    productFreebiesImage,
    productFreebiesStatus,
  } = dataState || {};

  const dataGroup1 = isFreebie
    ? [
        {
          name: "productName",
          label: "ชื่อสินค้า",
          value: productName,
          freebieHide: false,
        },
        {
          name: "productGroup",
          label: "ชื่อหมวด",
          value: productGroup,
          freebieHide: false,
        },
      ]
    : [
        {
          name: "productCodeNAV",
          label: "รหัสสินค้า",
          value: isFreebie ? productFreebiesCodeNAV : productCodeNAV,
          freebieHide: true,
        },
        {
          name: "productLocation",
          label: "โรงงาน",
          value: LOCATION_FULLNAME_MAPPING[productLocation as string],
          freebieHide: true,
        },
        {
          name: "productName",
          label: "ชื่อทางการค้า (Tradename)",
          value: productName,
          freebieHide: true,
        },
        {
          name: "commonName",
          label: "ชื่อสามัญ (Common name)",
          value: commonName,
          freebieHide: true,
        },
        {
          name: "productBrand",
          label: "Product Brands",
          value: (productBrand as BrandEntity)?.productBrandName,
          freebieHide: true,
        },
        {
          name: "productCategoryId",
          label: "หมวดสินค้า (Product Category)",
          value: productCategoryId,
          enable: true,
          freebieHide: true,
          required: true,
          customInput: (
            <Select
              data={
                categories?.map((cat: ProductCategoryEntity) => ({
                  key: `${cat.productCategoryId}`,
                  label: cat.productCategoryName,
                  value: `${cat.productCategoryId}`,
                })) || []
              }
              style={{ height: 40 }}
            />
          ),
        },
      ];

  const dataGroup2 = [
    {
      name: "saleUOM",
      label: "ปริมาณสินค้า / หน่วย",
      // value: baseUOM ? qtySaleUnit + ' ' + baseUOM : '-',
    },
    {
      name: "unitPrice",
      label: "ราคากลาง (Base price)",
      // value: unitPrice ? priceFormatter(parseFloat(unitPrice || "")) + '/' + baseUOM : '-',
    },
  ];

  const dataGroup3 = [
    {
      name: "basePrice",
      label: "ราคากลาง (Base price)",
      // value: marketPrice ? priceFormatter(parseFloat(marketPrice || "")) + '/' + baseUOM : '-',
    },
  ];

  const PageTitle = () => {
    return (
      <PageTitleNested
        title={isFreebie ? "แก้ไขของแถม" : "แก้ไขสินค้า"}
        showBack
        onBack={
          isFreebie
            ? () => navigate(`/${pathSplit[1]}/${pathSplit[2]}`)
            : () => navigate(`/${pathSplit[1]}/${pathSplit[2]}/${productId}`)
        }
        customBreadCrumb={
          <BreadCrumb
            data={
              isFreebie
                ? [
                    { text: "รายการของแถม", path: `/${pathSplit[1]}/${pathSplit[2]}` },
                    { text: "แก้ไขของแถม", path: window.location.pathname },
                  ]
                : [
                    { text: "รายชื่อสินค้า", path: `/${pathSplit[1]}/${pathSplit[2]}` },
                    {
                      text: "รายละเอียดสินค้า",
                      path: `/${pathSplit[1]}/${pathSplit[2]}/${
                        isFreebie ? productFreebiesId : productId
                      }`,
                    },
                    { text: "แก้ไขสินค้า", path: window.location.pathname },
                  ]
            }
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
      <Col span={isFreebie ? 16 : 24}>
        <CardContainer>
          <PageTitle />
          <Row>
            <Text level={5} fontWeight={700}>
              {isFreebie ? "รายละเอียดของแถม" : "รายละเอียดข้อมูลสินค้า"}
            </Text>
          </Row>
          <Form form={form} layout='vertical' onFinish={updateData}>
            <Row style={{ padding: "16px 0px" }}>
              {company !== "ICPL" ? (
                <Form.Item valuePropName='file' name={"productImage"}>
                  {/* <ImgCrop aspect={1}> */}
                  <Upload
                    listType='picture-card'
                    maxCount={1}
                    beforeUpload={() => false}
                    fileList={fileList}
                    //customRequest={() => {}}
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
                  {/* </ImgCrop> */}
                </Form.Item>
              ) : (
                <>
                  {productImage ? (
                    <Container>
                      <ProdImage>
                        <img
                          src={productImage}
                          style={{
                            width: "136px",
                            height: "136px",
                            objectFit: "contain",
                          }}
                        />
                      </ProdImage>
                    </Container>
                  ) : (
                    <Container>
                      <ProdImage>
                        <img
                          src={image.product_no_image}
                          style={{
                            width: "136px",
                            height: "136px",
                            objectFit: "contain",
                          }}
                        />
                      </ProdImage>
                    </Container>
                  )}
                </>
              )}
            </Row>
            <Row gutter={24}>
              {dataGroup1
                ?.filter((e: any) => !isFreebie || !e.freebieHide)
                .map((d, i) => (
                  <ProdFormItem {...d} customSpan={isFreebie ? 24 : 12} key={i} />
                ))}
              {isFreebie && (
                <>
                  <Col xl={12} sm={12}>
                    <Form.Item label='ขนาด'>
                      <Input value='-' disabled />
                    </Form.Item>
                  </Col>
                  <Col xl={12} sm={12}>
                    <Form.Item label='หน่วย'>
                      <Input value={baseUnitOfMeaTh ? baseUnitOfMeaTh : baseUnitOfMeaEn} disabled />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
            {!isFreebie && (
              <>
                <PriceContainer>
                  <Text color='primary' fontWeight={700}>
                    UNIT SIZE
                  </Text>
                  <Row gutter={24}>
                    {dataGroup2.map((d, i) => (
                      <ProdFormItem {...d} key={i} />
                    ))}
                  </Row>
                  <Text color='primary' fontWeight={700}>
                    PACKAGE SIZE
                  </Text>
                  <Row gutter={24}>
                    {dataGroup3.map((d, i) => (
                      <ProdFormItem {...d} key={i} />
                    ))}
                  </Row>
                </PriceContainer>
                <br />
              </>
            )}
            <Row>
              <Col span={24}>
                <Form.Item
                  label={isFreebie ? "คุณสมบัติ" : "คุณสมบัติและ ประโยชน์"}
                  name='description'
                  initialValue={description}
                >
                  <TextArea disabled={isFreebie} />
                </Form.Item>
              </Col>
            </Row>
            <br />
            <Form.Item
              label={"สถานะสินค้า"}
              name='productStatus'
              initialValue={isFreebie ? productFreebiesStatus : productStatus}
            >
              <Radio.Group disabled={!isFreebie}>
                <Radio value={"ACTIVE"}>ใช้งาน</Radio>
                <Radio value={"INACTIVE"}>ปิดการใช้งาน</Radio>
                {!isFreebie && <Radio value={"HOLD"}>ปิดการใช้งานชั่วคราว</Radio>}
              </Radio.Group>
            </Form.Item>
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
      {isFreebie && (
        <Col span={8}>
          <CardSection title='โปรโมชันที่เข้าร่วมของแถม' bgColor='#1B4586' textColor='white'>
            <CardContainer style={{ borderRadius: "5px", height: "500px" }}>
              {mockPromoton?.length > 0 ? (
                <>
                  {mockPromoton?.map((x: any) => (
                    <>
                      <Row justify={"space-between"} key={x.key}>
                        <Col span={3}>
                          <Image src={x.img} width={70} />
                        </Col>
                        <Col span={13}>
                          <Text level={6}>{x.name}</Text>
                          <br />
                          <Text color='Text3' level={6}>
                            {x.code}
                          </Text>
                        </Col>
                        <Col span={2}>
                          <Link
                            to={`/PromotionPage/promotion/detail/5c47d272-14b2-47f3-84ae-425bcad22da2`}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            <div className='btn btn-icon btn-light btn-hover-primary btn-sm'>
                              <span className='svg-icon svg-icon-primary svg-icon-2x'>
                                <UnorderedListOutlined style={{ color: color["primary"] }} />
                              </span>
                            </div>
                          </Link>
                        </Col>
                      </Row>
                      <br />
                    </>
                  ))}
                </>
              ) : (
                <div style={{display : 'flex', justifyContent: 'center'}}>
                  <Text align='center' color="Text3"> ไม่พบข้อมูลโปรโมชัน</Text>
                </div>
              )}
            </CardContainer>
          </CardSection>
        </Col>
      )}
    </Row>
  );
};
