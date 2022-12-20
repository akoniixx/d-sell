import React, { useEffect, useState, memo, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tabs, Row, Col, Input, Select, Avatar, Tag, Card, Button } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { EditOutlined, FormOutlined, SearchOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import {
  getProductBrand,
  getProductCategory,
  getProductDetail,
  getProductGroup,
  getProductList,
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
import { ProductCategoryEntity } from "../../entities/ProductCategoryEntity";
import { getProductFreebieDetail } from "../../datasource/PromotionDatasource";

const Container = styled.div`
  margin: 32px 0px 10px 0px;
`;

const ProdImage = styled.img`
  width: 136px;
  height: 136px;
  border-radius: 12px;
  object-fit: contain;
`;

interface DescProps {
  label: string;
  value: ReactNode;
}

const ProdDesc = ({ label, value }: DescProps) => {
  return (
    <Row align='middle' style={{ padding: "8px 0px" }}>
      <Col xl={6} sm={8}>
        <Text level={5} color='Text3'>
          {label}
        </Text>
      </Col>
      <Col xl={18} sm={16}>
        <Text level={5} color='Text1'>
          {value || "-"}
        </Text>
      </Col>
    </Row>
  );
};

export const DistributionPageDetail: React.FC = (props: any) => {
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const isFreebie = pathSplit[2] === 'freebies';

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState<ProductEntity>();

  useEffectOnce(() => {
    fetchProduct();
  });

  const fetchProduct = async () => {
    try {
      setLoading(true);
      let data;
      const id = parseInt(pathSplit[3])
      if(isFreebie){
        data = await getProductFreebieDetail(id);
      } else {
        data = await getProductDetail(id);
      }
      setDataState(data);
      console.log({ pathSplit, data });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
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
    productFreebiesImage
  } = dataState || {};

  const dataGroup1 = [
    {
      label: "Product Brands",
      value: (productBrand as BrandEntity)?.productBrandName,
      freebieHide: true
    },
    {
      label: "โรงงาน",
      value: LOCATION_FULLNAME_MAPPING[productLocation as string],
      freebieHide: true
    },
    {
      label: "รหัสสินค้า",
      value: isFreebie ? productFreebiesCodeNAV : productCodeNAV,
    },
    {
      label: "ชื่อทางการค้า (Tradename)",
      value: productName,
    },
    {
      label: "ชื่อสามัญ",
      value: commonName,
      freebieHide: true
    },
    {
      label: "กลุ่มสินค้า (Product Group)",
      value: productGroup,
    },
    {
      label: "กลุ่มสินค้า (Product Category)",
      value: (productCategory as ProductCategoryEntity)?.productCategoryName,
      freebieHide: true
    },
  ];

  const dataGroup2 = [
    {
      label: "ปริมาณสินค้า / หน่วย",
      value: saleUOM,
    },
    {
      label: "ราคากลาง (Base price)",
      value: priceFormatter(parseFloat(unitPrice || "")),
    },
  ];

  const dataGroup3 = [
    {
      label: "ราคากลาง (Base price)",
      value: priceFormatter(parseFloat(marketPrice || "")),
    },
  ];

  const dataGroup4 = [
    {
      label: "คุณสมบัติและ ประโยชน์",
      value: description,
    },
  ];

  const PageTitle = () => {
    return (
      <PageTitleNested
        title='รายละเอียดสินค้า'
        showBack
        extra={
          <Button
            type='primary'
            onClick={() =>
              navigate(`/${pathSplit[1]}/${pathSplit[2]}/edit/${isFreebie ? productFreebiesId : productId}`)
            }
          >
            <EditOutlined />
            แก้ไขรายละเอียด
          </Button>
        }
        extraTitle={
          productStatus && (
            <Tag color={STATUS_COLOR_MAPPING[productStatus]}>{nameFormatter(productStatus)}</Tag>
          )
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายชื่อสินค้า", path: `/${pathSplit[1]}/${pathSplit[2]}` },
              { text: "รายละเอียดสินค้า", path: window.location.pathname },
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
            <ProdImage src={isFreebie ? productFreebiesImage : productImage} />
          </Container>
          <Container>
            {dataGroup1.filter((e) => !isFreebie || !e.freebieHide).map((p: DescProps, i) => (
              <ProdDesc {...p} key={i} />
            ))}
          </Container>
          {!isFreebie && <>
            <Container>
              <Text color='primary' fontWeight={700}>
                UNIT SIZE
              </Text>
              {dataGroup2.map((p: DescProps, i) => (
                <ProdDesc {...p} key={i} />
              ))}
            </Container>
            <Container>
              <Text color='primary' fontWeight={700}>
                PACKAGE SIZE
              </Text>
              {dataGroup3.map((p: DescProps, i) => (
                <ProdDesc {...p} key={i} />
              ))}
            </Container>
          </>}
          <Container>
            {dataGroup4.map((p: DescProps, i) => (
              <ProdDesc {...p} key={i} />
            ))}
          </Container>
        </CardContainer>
      </div>
    </>
  );
};
