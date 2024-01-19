import { EditOutlined } from "@ant-design/icons";
import { Col, Row, Image, Button, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AntdTabs from "../../../components/AntdTabs/AntdTabs";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import { CardContainer } from "../../../components/Card/CardContainer";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import { getProductDetail } from "../../../datasource/ProductDatasource";
import color from "../../../resource/color";
import Text from "../../../components/Text/Text";
import TextArea from "antd/lib/input/TextArea";

export const DetailPriceList: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const id = parseInt(pathSplit[3]);
  const [data, setData] = useState<any>();

  const getProductById = async () => {
    const res = await getProductDetail(id);
    setData(res);
  };

  useEffect(() => {
    getProductById();
  }, []);

  const dataGroup1: any = [
    {
      label: "รหัสสินค้า :",
      value: data?.productCodeNAV,
    },
    {
      label: "ชื่อทางการค้า :",
      value: data?.productName,
    },
    {
      label: "ชื่อสามัญ :",
      value: data?.commonName,
    },
    {
      label: "Product Brands :",
      value: data?.productBrand?.productBrandName,
    },
    {
      label: "หมวดสินค้า :",
      value: data?.productCategory?.productCategoryName,
    },
    {
      label: "Product Group :",
      value: data?.productGroup,
    },
    {
      label: "โรงงาน :",
      value: data?.productLocation,
    },
  ];
  const dataGroup2: any = [
    {
      label: "ขนาดบรรจุ :",
      value: data?.packSize,
    },
    {
      label: "จำนวนบรรจุ :",
      value: `${data?.qtySaleUnit} ขวด`,
    },
    {
      label: "ปริมาณ/หน่วย :",
      value: `${data?.packingQtyUnit} ${data?.baseUOM}`,
    },
    {
      label: "ปริมาณทั้งหมด :",
      value: data?.volume,
    },
  ];
  const dataGroup3: any = [
    {
      label: "ราคาต่อหน่วยย่อย :",
      value: `${data?.unitPrice} บาท`,
    },
    {
      label: "ราคาต่อหน่วยขาย :",
      value: `${data?.marketPrice} บาท`,
    },
    {
      label: "ภาษีข้อมูลเพิ่ม (Vat)",
      value: "7%",
    },
    {
      label: "ราคาหน่วยย่อย + Vat :",
      value: `${(Number(data?.unitPrice) + Number(data?.unitPrice * 0.07)).toFixed(2)} บาท`,
    },
    {
      label: "ราคาหน่วยขาย + Vat :",
      value: `${(Number(data?.marketPrice) + Number(data?.marketPrice * 0.07)).toFixed(2)} บาท`,
    },
  ];

  const DetailProduct = () => {
    return (
      <Row justify={"space-between"} gutter={8}>
        <Col span={16}>
          <CardContainer style={{ backgroundColor: "#f2f5f7" }}>
            <Row gutter={8} justify={"space-between"}>
              <Col>
                <Image
                  src={data?.productImage}
                  style={{
                    width: "136px",
                    height: "136px",
                    objectFit: "contain",
                  }}
                />
              </Col>
              <Col>
                <Button
                  type='primary'
                  onClick={() => navigate("/PriceListPage/CreatePriceList/" + data?.productId)}
                >
                  <EditOutlined />
                  แก้ไขรายละเอียด
                </Button>
              </Col>
            </Row>
            <br />
            {dataGroup1.map((d: any, i) => (
              <Row align='middle' style={{ padding: "8px 0px" }} key={i}>
                <Col xl={6} sm={8}>
                  <Text level={5} color='Text3'>
                    {d.label}
                  </Text>
                </Col>
                <Col xl={18} sm={16}>
                  <Text level={5} color='Text1'>
                    {d.value}
                  </Text>
                </Col>
              </Row>
            ))}
            <Row justify={"space-between"}>
              <Col span={12}>
                <Text color='primary' fontWeight={700}>
                  ขนาด/ปริมาณสินค้า
                </Text>
                {dataGroup2.map((d: any, i) => (
                  <Row align='middle' style={{ padding: "8px 0px" }} key={i}>
                    <Col span={12}>
                      <Text level={5} color='Text3'>
                        {d.label}
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text level={5} color='Text1'>
                        {d.value}
                      </Text>
                    </Col>
                  </Row>
                ))}
              </Col>
              <Col span={12}>
                <Text color='primary' fontWeight={700}>
                  ราคาสินค้า
                </Text>
                {dataGroup3.map((d: any, i) => (
                  <Row align='middle' style={{ padding: "8px 0px" }} key={i}>
                    <Col span={12}>
                      <Text level={5} color='Text3'>
                        {d.label}
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text level={5} color='Text1'>
                        {d.value}
                      </Text>
                    </Col>
                  </Row>
                ))}
              </Col>
            </Row>
            <Row>
              <Col xl={6} sm={8}>
                <Text level={5} color='Text3'>
                  คุณสมบัติและประโยชน์ :
                </Text>
              </Col>
              <Col xl={18} sm={16}>
                <TextArea
                  rows={4}
                  value={data?.description}
                  bordered={false}
                  style={{ fontFamily: "Sarabun", fontSize: "16px", padding: 0 }}
                  disabled
                />
              </Col>
            </Row>
          </CardContainer>
        </Col>
        <Col span={8}>
          <CardContainer style={{ backgroundColor: "#f2f5f7" }}>
            <Text fontWeight={700}>โปรโมชันที่สินค้าเข้าร่วม</Text>
            <br />
            <Text>รายการทั้งหมด 0 รายการ</Text>
            <Divider />
          </CardContainer>
        </Col>
      </Row>
    );
  };

  const ShopProduct = () => {
    return <></>;
  };

  const dataTabs: { key: string; label: React.ReactNode; children?: JSX.Element | undefined }[] = [
    {
      label: "รายละเอียดสินค้า ",
      key: "product",
      children: <DetailProduct />,
    },
    {
      label: "ร้านค้าที่มีสินค้า ",
      key: "shop",
      children: <ShopProduct />,
    },
  ];

  return (
    <CardContainer>
      <PageTitleNested
        title='รายละเอียดสินค้า'
        showBack
        onBack={() => navigate(`/PriceListPage/DistributionPage`)}
        //extraTitle={
        //   productStatus && (
        //     <Tag color={STATUS_COLOR_MAPPING[productStatus]}>{nameFormatter(productStatus)}</Tag>
        //   )
        //}
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายชื่อสินค้า", path: `/PriceListPage/DistributionPage` },
              { text: "รายละเอียดสินค้า", path: window.location.pathname },
            ]}
          />
        }
      />
      <br />
      <AntdTabs data={dataTabs} />
    </CardContainer>
  );
};
