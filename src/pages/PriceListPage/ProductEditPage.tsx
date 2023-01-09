import React, { useEffect, useState, memo, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Tag, Card, Form, Upload, Radio, Divider, message } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { CameraOutlined, PlusOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import {
  getProductBrand,
  getProductCategory,
  getProductDetail,
  getProductGroup,
  getProductList,
  updateProduct,
} from "../../datasource/ProductDatasource";
import { nameFormatter, priceFormatter } from "../../utility/Formatter";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import Text from "../../components/Text/Text";
import { BrandEntity } from "../../entities/BrandEntity";
import { LOCATION_FULLNAME_MAPPING } from "../../definitions/location";
import { STATUS_COLOR_MAPPING } from "../../definitions/product";
import { useRecoilValue } from "recoil";
import { profileAtom } from "../../store/ProfileAtom";
import { ProductGroupEntity } from "../../entities/ProductGroupEntity";
import { useEffectOnce } from "react-use";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import icon from "../../resource/icon";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import { ProductEntity } from "../../entities/PoductEntity";
import styled from "styled-components";
import Input from "../../components/Input/Input";
import color from "../../resource/color";
import TextArea from "../../components/Input/TextArea";
import { RcFile } from "antd/lib/upload";
import { ProductCategoryEntity } from "../../entities/ProductCategoryEntity";
import { getProductFreebieDetail, updateProductFreebie } from "../../datasource/PromotionDatasource";
import Select from "../../components/Select/Select";
import type { UploadFile } from 'antd/es/upload/interface';
import ImgCrop from "../../components/ImgCrop/ImgCrop";

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
}

const ProdFormItem = ({ name, label, value, enable, customInput, withSpace, customSpan }: DescProps) => {
  return (<>
    <Col xl={customSpan ? customSpan : 12} sm={24}>
      <Form.Item label={label} initialValue={value} name={name}>
        {customInput ? customInput : <Input disabled={!enable} />}
      </Form.Item>
    </Col>
    {withSpace && <Col xl={customSpan ? 24 - customSpan : 12} sm={0}/>}
  </>);
};

export const DistributionPageEdit: React.FC = (props: any) => {
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isFreebie = pathSplit[2] === 'freebies';

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState<ProductEntity>();
  const [categories, setCategories] = useState<Array<ProductCategoryEntity>>();
  const [file, setFile] = useState<Blob>();
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
      const id = parseInt(pathSplit[4])
      if(isFreebie){
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
        saleUOM: data.qtySaleUnit + ' ' + data.baseUOM,
        unitPrice: priceFormatter(parseFloat(data.unitPrice || "")) + '/' + data.baseUOM,
        basePrice: priceFormatter(parseFloat(data.marketPrice || "")) + '/' + data.baseUOM,
      })

      const url = isFreebie ? data.productFreebiesImage : data.productImage
      if(url){
        setFileList([{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url,
        }])
      }

      console.log({ data, file });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async () => {
    const { description, productCategory, productStatus } = form.getFieldsValue();
    const data = new FormData();
    if(isFreebie) {
      data.append("productFreebiesId", `${productFreebiesId}`);
      data.append("productFreebiesStatus", `${productStatus}`)
    }else {
      data.append("productId", `${productId}`);
      data.append("description", description);
      data.append("categoryId", productCategory);
    }

    if(!isRemoved && productImage){
      data.append("productImage", productImage);
    }
    if(!isRemoved && productFreebiesImage){
      data.append("productFreebiesImage", productFreebiesImage);
    }
    data.append("file", file!);

    try {
      setUploading(true);
      if(isFreebie){
        const res = await updateProductFreebie(data);
        navigate(`/PromotionPage/freebies/${productFreebiesId}`);
      }else {
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
    baseUOM,
    baseUnitOfMeaEn,
    baseUnitOfMeaTh,
    commonName,
    company,
    createDate,
    description,
    inventoryGroup,
    marketPrice,
    packSize,
    packingUOM,
    productBrand,
    productBrandId,
    productCategory,
    productCategoryId,
    productCodeNAV,
    productGroup,
    productId,
    productImage,
    productLocation,
    productName,
    productStatus,
    productStrategy,
    qtySaleUnit,
    saleUOM,
    unitPrice,
    updateBy,
    updateDate,
    productFreebiesId,
    productFreebiesCodeNAV,
    productFreebiesImage,
    productFreebiesStatus
  } = dataState || {};

  const dataGroup1 = isFreebie ? [
    {
      name: "productName",
      label: "ชื่อสินค้า",
      value: productName,
      freebieHide: false
    },
    {
      name: "productGroup",
      label: "ชื่อหมวด",
      value: productGroup,
      freebieHide: false
    },
    {
      name: "size",
      label: "ขนาด",
      value: "-",
      freebieHide: false
    },
    {
      name: "baseUnitOfMeaTh",
      label: "หน่วย",
      value: baseUnitOfMeaTh ? baseUnitOfMeaTh : baseUnitOfMeaEn,
      freebieHide: false,
    },
  ] : [
    {
      name: "productCodeNAV",
      label: "รหัสสินค้า",
      value: isFreebie ? productFreebiesCodeNAV : productCodeNAV,
      freebieHide: true
    },
    {
      name: "productLocation",
      label: "โรงงาน",
      value: LOCATION_FULLNAME_MAPPING[productLocation as string],
      freebieHide: true
    },
    {
      name: "productName",
      label: "ชื่อทางการค้า (Tradename)",
      value: productName,
      freebieHide: true
    },
    {
      name: "commonName",
      label: "ชื่อสามัญ (Common name)",
      value: commonName,
      freebieHide: true
    },
    {
      name: "productBrandName",
      label: "Product Brands",
      value: (productBrand as BrandEntity)?.productBrandName,
      freebieHide: true
    },
    {
      name: "productCategory",
      label: "กลุ่มสินค้า (Product Category)",
      value: (productCategory as ProductCategoryEntity)?.productCategoryId,
      enable: true,
      freebieHide: true,
      customInput: (
        <Select
          data={categories?.map((cat: ProductCategoryEntity) => ({
            key: `${cat.productCategoryId}`,
            label: cat.productCategoryName,
            value: `${cat.productCategoryId}`,
          })) || []}
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
        title={isFreebie ? 'แก้ไขของแถม' : 'แก้ไขสินค้า'}
        showBack
        onBack={() => navigate(`/${pathSplit[1]}/${pathSplit[2]}/${isFreebie ? productFreebiesId : productId}`)}
        customBreadCrumb={
          <BreadCrumb
            data={
              isFreebie ? 
              [
                { text: "รายการของแถม", path: `/${pathSplit[1]}/${pathSplit[2]}` },
                { text: "แก้ไขของแถม", path: window.location.pathname },
              ] : [
                { text: "รายชื่อสินค้า", path: `/${pathSplit[1]}/${pathSplit[2]}` },
                { text: "รายละเอียดสินค้า", path: `/${pathSplit[1]}/${pathSplit[2]}/${isFreebie ? productFreebiesId : productId}` },
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
    <>
      <div className='container '>
        <CardContainer>
          <PageTitle />
          <Container>
            <Row>
              <Text level={5} fontWeight={700}>
                {isFreebie ? 'รายละเอียดของแถม' : 'รายละเอียดข้อมูลสินค้า'}
              </Text>
            </Row>
            <Form form={form} layout='vertical' onFinish={updateData}>
              <Row style={{ padding: "16px 0px" }}>
                <Form.Item valuePropName='file' name={"productImage"}>
                {/* <ImgCrop aspect={1}> */}
                  <Upload
                    listType='picture-card'
                    maxCount={1}
                    beforeUpload={() => false}
                    fileList={fileList}
                    customRequest={() => {
                      console.log("customRequest");
                    }}
                    onChange={({ file, fileList: newFileList }: any) => {
                      setFile(file);
                      setFileList(newFileList);
                      return "success";
                    }}
                    onRemove={() => {
                      console.log('onremove')
                      setFile(undefined);
                      setRemoved(true);
                    }}
                  >
                    {!fileList?.length && <ProdImage ><CameraOutlined/></ProdImage>}
                  </Upload>
                {/* </ImgCrop> */}
                </Form.Item>
              </Row>
              <Row gutter={24}>
                {dataGroup1?.filter((e: any) => !isFreebie || !e.freebieHide).map((d, i) => (
                  <ProdFormItem 
                    {...d} 
                    withSpace={isFreebie && d.name !== 'size'}
                    customSpan={d.name === 'baseUnitOfMeaTh' ? 4 : d.name === 'size' ? 8 : undefined}
                    key={i}
                  />
                ))}
              </Row>
              {!isFreebie && <>
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
              </>}
              <Row>
                <Col span={isFreebie ? 12 : 24}>
                  <Form.Item
                      label={isFreebie ? "คุณสมบัติ" : "คุณสมบัติและ ประโยชน์"}
                      name='description'
                      initialValue={description}
                    >
                      <TextArea disabled={isFreebie}/>
                  </Form.Item>
                </Col>
              </Row>
              <br />
              <Form.Item label={"สถานะสินค้า"} name='productStatus' initialValue={isFreebie ? productFreebiesStatus : productStatus}>
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
          </Container>
        </CardContainer>
      </div>
    </>
  );
};
