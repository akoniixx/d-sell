import React, { ReactNode, useEffect, useState } from "react";
import {
  Row,
  Col,
  Divider,
  Form,
  message,
  Modal,
  Spin,
  Tabs,
  Tag,
  Table,
  Avatar,
  Radio,
  Space,
} from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Button from "../../components/Button/Button";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import styled from "styled-components";
import { PromotionType } from "../../definitions/promotion";
import productState from "../../store/productList";
import { ProductEntity } from "../../entities/PoductEntity";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import {
  CheckCircleTwoTone,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import color from "../../resource/color";
import image from "../../resource/image";
import Text from "../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Steps from "../../components/StepAntd/steps";
import TableContainer from "../../components/Table/TableContainer";
import { AlignType } from "rc-table/lib/interface";
import PageSpin from "../../components/Spin/pageSpin";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { getCustomersById } from "../../datasource/CustomerDatasource";
import {
  getSpecialPriceByCustomerId,
  updateSpecialPrice,
} from "../../datasource/SpecialPriceDatasource";
import { priceFormatter } from "../../utility/Formatter";
import {
  ORDER_STATUS,
  ORDER_PAYMENT_STATUS,
  ORDER_PAYMENT_METHOD_NAME,
} from "../../definitions/orderStatus";
import { getOrderDetail } from "../../datasource/OrderDatasourc";
import { OrderEntity } from "../../entities/OrderEntity";

const SLASH_DMY = "DD/MM/YYYY";

const DetailBox = styled.div`
  padding: 32px;
  margin-top: 12px;

  background: ${color.background1};
  border: 1px solid ${color.background2};
  border-radius: 16px;
`;
const DetailItem = ({
  label,
  value,
  alignRight,
  fontWeight,
  fontSize,
  color,
  style,
}: {
  label: string;
  value: string | ReactNode;
  alignRight?: boolean;
  fontWeight?: 400 | 500 | 600 | 700;
  fontSize?: 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 | 34 | 36 | 38 | 40 | 46 | 50;
  color?:
    | "primary"
    | "secondary"
    | "Text1"
    | "Text2"
    | "Text3"
    | "error"
    | "success"
    | "warning"
    | "white";
  style?: any;
}) => {
  return (
    <Row gutter={16} style={{ margin: "10px 0px" }}>
      <Col span={alignRight ? 18 : 8}>
        <Text fontWeight={fontWeight} fontSize={fontSize}>
          {label} :
        </Text>
      </Col>
      <Col span={alignRight ? 6 : 16}>
        <Row justify={alignRight ? "end" : "start"}>
          <Text fontWeight={fontWeight} color={color ? color : "Text2"} style={style}>
            {value || "-"}
          </Text>
        </Row>
      </Col>
    </Row>
  );
};

export const OrderDetail: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;

  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderEntity>();

  useEffect(() => {
    if (!loading) fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const id = pathSplit[2];
    await getOrderDetail(id)
      .then((res: OrderEntity) => {
        console.log("getOrderDetail", res);
        setOrderData(res);
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const PageTitle = () => {
    return (
      <PageTitleNested
        title='ORDER NO: SPO000001'
        showBack
        onBack={() => navigate(`/order`)}
        extra={
          <FlexCol align='end'>
            <Text
              level={3}
              fontWeight={700}
              style={{
                color: orderData?.status ? ORDER_STATUS[orderData?.status].color : undefined,
                fontWeight: 700,
              }}
            >
              {orderData?.status ? ORDER_STATUS[orderData?.status].name_default : "-"}
            </Text>
            <Text
              style={{
                color: ORDER_PAYMENT_STATUS.STATUS_1.color,
              }}
            >
              {ORDER_PAYMENT_STATUS.STATUS_1.name_default}
            </Text>
            <Text level={7}>วันที่อัปเดท&nbsp;{moment(orderData?.updateAt).format(SLASH_DMY)}</Text>
          </FlexCol>
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการคำสั่งซื้อ", path: "/order" },
              { text: "รายละเอียดคำสั่งซื้อ", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };

  const columns = [
    {
      title: "ชื่อสินค้า",
      dataIndex: "product",
      key: "product",
      render: (productName: string, row: ProductEntity, index: number) => {
        return {
          children: (
            <FlexRow align='center'>
              <div style={{ marginRight: 16 }}>
                <Avatar
                  src={row?.productImage || image.product_no_image}
                  size={50}
                  shape='square'
                />
              </div>
              <FlexCol>
                <Text level={5}>{productName}</Text>
                <Text level={6} color='Text3'>
                  {row?.commonName}
                </Text>
              </FlexCol>
            </FlexRow>
          ),
        };
      },
    },
    {
      title: "ขนาด",
      dataIndex: "packSize",
      key: "packSize",
      render: (packSize: string, product: ProductEntity, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{packSize}</Text>
              <Text level={6} color='Text3'>
                {product?.productCodeNAV}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "UNIT PRICE",
      dataIndex: "price",
      key: "price",
      render: (unitPrice: string, product: ProductEntity, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{priceFormatter(unitPrice || "", undefined, false, true)}</Text>
              <Text level={6} color='Text3'>
                {" บาท / " + product?.saleUom}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "PACK PRICE",
      dataIndex: "marketPrice",
      key: "marketPrice",
      render: (marketPrice: number, product: ProductEntity, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{priceFormatter(marketPrice || "", undefined, false, true)}</Text>
              <Text level={6} color='Text3'>
                {" บาท / " + product?.saleUom}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
  ];

  return loading ? (
    <CardContainer>{<PageSpin />}</CardContainer>
  ) : (
    <>
      <div className='container '>
        <CardContainer>{<PageTitle />}</CardContainer>
        <br />
        <Row gutter={16}>
          <Col span={12}>
            <CardContainer>
              <Text level={4} fontWeight={700}>
                รายละเอียดคำสั่งซื้อ
              </Text>
              <DetailBox style={{ height: 220 }}>
                <DetailItem label='ชื่อร้านค้า' value={orderData?.customerName} />
                <DetailItem label='Nav NO.' value={orderData?.navNo} />
                <DetailItem label='Order No.' value={orderData?.orderNo} />
                <DetailItem
                  label='ช่องทางการจ่ายเงิน'
                  value={
                    <Text color={"primary"}>
                      {orderData?.paymentMethod
                        ? ORDER_PAYMENT_METHOD_NAME[orderData?.paymentMethod]
                        : "-"}
                    </Text>
                  }
                />
              </DetailBox>
            </CardContainer>
          </Col>
          <Col span={12}>
            <CardContainer>
              <Text level={4} fontWeight={700}>
                รายละเอียดการจัดส่ง
              </Text>
              <DetailBox style={{ height: 220 }}>
                {/* TODO */}
                <DetailItem label='การจัดส่ง' value='รับที่โรงงาน' />
                <DetailItem
                  label='ที่อยู่'
                  value='เลขที่ 2/1 หมู่ที่ 3 แม่ลา นครหลวง พระนครศรีอยุธยา 13260'
                />
                <DetailItem label='หมายเหตุการจัดส่ง' value='ส่งไว้ที่เดิม' />
              </DetailBox>
            </CardContainer>
          </Col>
        </Row>
        <br />
        <CardContainer>
          <Table columns={columns} dataSource={orderData?.orderProducts || []} pagination={false} />
        </CardContainer>
        <br />
        <Row gutter={16}>
          <Col span={12}>
            <CardContainer>
              <Text level={4} fontWeight={700}>
                รวมหมายเหตุ***
              </Text>
              <br />
              <br />
              <Text level={5} fontWeight={700}>
                หมายเหตุ (สำหรับ Sale Co)
              </Text>
              <DetailBox>-</DetailBox>
              <br />
              <Text level={5} fontWeight={700}>
                หมายเหตุ (ขอส่วนลดพิเศษเพิ่ม)
              </Text>
              <DetailBox>-</DetailBox>
            </CardContainer>
          </Col>
          <Col span={12}>
            <CardContainer>
              <Text level={4} fontWeight={700}>
                ใบเสร็จรวมเงิน
              </Text>
              <DetailBox>
                <DetailItem
                  label='รวมเงิน'
                  value={priceFormatter(orderData?.totalPrice || "", undefined, true)}
                  alignRight
                  fontWeight={700}
                  fontSize={18}
                />
                <DetailItem
                  label='ภาษีมูลค่าเพิ่ม'
                  value={priceFormatter(0, undefined, true)}
                  alignRight
                />
                <DetailItem label='รวมเงิน' value=' ' fontWeight={700} fontSize={18} />
                <DetailBox style={{ backgroundColor: "white", padding: 22 }}>
                  <DetailItem
                    label='ส่วนลดรายการ (Discount)'
                    value={priceFormatter(orderData?.discount || "", undefined, true)}
                    color='error'
                    alignRight
                  />
                  <DetailItem
                    label='ส่วนลดดูแลราคา (CO. ดูแลราคา / วงเงินเคลม)'
                    value={priceFormatter(orderData?.coDiscount || "", undefined, true)}
                    color='success'
                    alignRight
                  />
                  <DetailItem
                    label='ส่วนลดพิเศษ (Special Req.)'
                    value={priceFormatter(orderData?.specialRequestDiscount || "", undefined, true)}
                    style={{ color: "#9B51E0" }}
                    alignRight
                  />
                </DetailBox>
                <br />
                <DetailItem
                  label='รวมส่วนลด'
                  value={priceFormatter(orderData?.totalDiscount || "", undefined, true)}
                  fontWeight={700}
                  fontSize={18}
                  alignRight
                />
                <Divider />
                <DetailItem
                  label='ราคารวม'
                  value={
                    <Text color='primary' fontWeight={700} fontSize={32}>
                      {priceFormatter(orderData?.totalPrice || "", undefined, true)}
                    </Text>
                  }
                  fontWeight={700}
                  fontSize={24}
                  alignRight
                />
              </DetailBox>
            </CardContainer>
          </Col>
        </Row>
      </div>
    </>
  );
};
