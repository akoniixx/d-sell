import React, { useEffect, useState, memo, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Tag, Card, Form, Upload, Radio, Divider, Select, message } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { PlusOutlined } from "@ant-design/icons";
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

const Container = styled.div`
  margin: 32px 0px 10px 0px;
`;

const ProdImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: contain;
`;

const PriceContainer = styled.div`
  padding: 20px;
  background: ${color["background1"]};
  border-radius: 8px;
`;

interface DescProps {
  name: string;
  label: string;
  value: ReactNode;
  enable?: boolean;
  customInput?: ReactNode;
}

const ProdFormItem = ({ name, label, value, enable, customInput }: DescProps) => {
  return (
    <Col xl={12} sm={24}>
      <Form.Item label={label} initialValue={value} name={name}>
        {customInput ? customInput : <Input disabled={!enable} />}
      </Form.Item>
    </Col>
  );
};

export const DistributionPageEdit: React.FC = (props: any) => {
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isFreebie = pathSplit[2] === 'freebies';

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState<ProductEntity>();
  const [categories, setCategories] = useState<Array<ProductCategoryEntity>>();
  const [file, setFile] = useState<Blob>();
  const [uploading, setUploading] = useState(false);

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
        unitPrice: priceFormatter(parseFloat(data.unitPrice || "")),
        basePrice: priceFormatter(parseFloat(data.marketPrice || ""))
      })

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
    data.append("file", file!);

    try {
      setUploading(true);
      if(isFreebie){
        const res = await updateProductFreebie(data);
        window.location.href = `/PromotionPage/freebies/${productFreebiesId}`;
      }else {
        const res = await updateProduct(data);
        window.location.href = `/PriceListPage/DistributionPage/${productId}`;
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

  const dataGroup1 = [
    {
      name: "productBrandName",
      label: "Product Brands",
      value: (productBrand as BrandEntity)?.productBrandName,
      freebieHide: true
    },
    {
      name: "productLocation",
      label: "โรงงาน",
      value: LOCATION_FULLNAME_MAPPING[productLocation as string],
      freebieHide: true
    },
    {
      name: "productCodeNAV",
      label: "รหัสสินค้า",
      value: isFreebie ? productFreebiesCodeNAV : productCodeNAV,
    },
    {
      name: "productName",
      label: "ชื่อทางการค้า (Tradename)",
      value: productName,
    },
    {
      name: "commonName",
      label: "ชื่อสามัญ",
      value: commonName,
      freebieHide: true
    },
    {
      name: "productGroup",
      label: "กลุ่มสินค้า (Product Group)",
      value: productGroup,
    },
    {
      name: "productCategory",
      label: "กลุ่มสินค้า (Product Category)",
      value: (productCategory as ProductCategoryEntity)?.productCategoryId,
      enable: true,
      freebieHide: true,
      customInput: (
        <Select
          options={categories?.map((cat: ProductCategoryEntity) => ({
            label: cat.productCategoryName,
            value: cat.productCategoryId,
          }))}
        />
      ),
    },
  ];

  const dataGroup2 = [
    {
      name: "saleUOM",
      label: "ปริมาณสินค้า / หน่วย",
      value: saleUOM,
    },
    {
      name: "unitPrice",
      label: "ราคากลาง (Base price)",
      value: unitPrice ? priceFormatter(parseFloat(unitPrice || "")) : '-',
    },
  ];

  const dataGroup3 = [
    {
      name: "basePrice",
      label: "ราคากลาง (Base price)",
      value: marketPrice ? priceFormatter(parseFloat(marketPrice || "")) : '-',
    },
  ];

  const PageTitle = () => {
    return (
      <PageTitleNested
        title='รายละเอียดสินค้า'
        showBack
        extraTitle={
          productStatus && (
            <Tag color={STATUS_COLOR_MAPPING[productStatus]}>{nameFormatter(productStatus)}</Tag>
          )
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายชื่อสินค้า", path: `/${pathSplit[1]}/${pathSplit[2]}` },
              { text: "รายละเอียดสินค้า", path: `/${pathSplit[1]}/${pathSplit[2]}/${isFreebie ? productFreebiesId : productId}` },
              { text: "แก้ไขสินค้า", path: window.location.pathname },
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
    <>
      <div className='container '>
        <CardContainer>
          <PageTitle />
          <Container>
            <Row>
              <Text level={5} fontWeight={700}>
                รายละเอียดข้อมูลสินค้า
              </Text>
            </Row>
            <Form form={form} layout='vertical' onFinish={updateData}>
              <Row style={{ padding: "16px 0px" }}>
                <Form.Item valuePropName='file' name={"productImage"}>
                  <Upload
                    listType='picture-card'
                    maxCount={1}
                    beforeUpload={() => false}
                    customRequest={() => {
                      console.log("customRequest");
                    }}
                    onChange={({ file }: any) => {
                      setFile(file);
                      console.log(file);
                      return "success";
                    }}
                  >
                    {!file && <ProdImage src={isFreebie ? productFreebiesImage : productImage} />}
                  </Upload>
                </Form.Item>
              </Row>
              <Row gutter={24}>
                {dataGroup1.filter((e) => !isFreebie || !e.freebieHide).map((d, i) => (
                  <ProdFormItem {...d} key={i} />
                ))}
              </Row>
              {!isFreebie && <PriceContainer>
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
              </PriceContainer>}
              <br />
              <Form.Item
                label={"คุณสมบัติและ ประโยชน์"}
                name='description'
                initialValue={description}
              >
                <TextArea disabled={isFreebie}/>
              </Form.Item>
              <br />
              <Form.Item label={"สถานะสินค้า"} name='productStatus' initialValue={isFreebie ? productFreebiesStatus : productStatus}>
                <Radio.Group disabled={!isFreebie}>
                  <Radio value={"ACTIVE"}>ใช้งาน</Radio>
                  <Radio value={"INACTIVE"}>ปิดการใช้งาน</Radio>
                  {!isFreebie && <Radio value={"HOLD"}>Hold</Radio>}
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
