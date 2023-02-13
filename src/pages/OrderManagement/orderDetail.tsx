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
import icons from "../../resource/icon";
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
  OrderStatusKey,
} from "../../definitions/orderStatus";
import { getOrderDetail, updateOrderStatus } from "../../datasource/OrderDatasourc";
import { OrderEntity } from "../../entities/OrderEntity";
import { getOrderStatus } from "../../utility/OrderStatus";
import TextArea from "../../components/Input/TextArea";

const SLASH_DMY = "DD/MM/YYYY";

const DetailBox = styled.div`
  padding: 32px;
  margin-top: 12px;

  background: ${color.background1};
  border: 1px solid ${color.background2};
  border-radius: 16px;
`;

const NavResponseBox = styled(CardContainer)`
  border-width: ${(props) => (props.color ? "1px 1px 1px 13px" : "0px")};
  border-style: solid;
  border-color: ${(props) => props.color};
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

  const [updating, setUpdating] = useState(false);

  const [form] = Form.useForm();
  const [navForm] = Form.useForm();

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

  const updateStatus = async (nextStatus?: OrderStatusKey) => {
    const { status } = form.getFieldsValue();
    const onSubmit = async () => {
      setUpdating(true);
      const id = pathSplit[2];
      await updateOrderStatus({
        orderId: id,
        status: nextStatus ? nextStatus : status,
      })
        .then((res: any) => {
          navigate(0);
          console.log(res);
        })
        .catch((e: any) => {
          console.log(e);
        })
        .finally(() => {
          setUpdating(false);
        });
    };
    Modal.confirm({
      title: `ยืนยันการปรับสถานะ "${getOrderStatus(
        nextStatus ? nextStatus : (status as OrderStatusKey),
        company,
      )}"`,
      icon: null,
      content: (
        <Text color='Text3' level={6}>
          โปรดยืนยันรายการ
        </Text>
      ),
      onOk: onSubmit,
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
              {orderData?.status ? getOrderStatus(orderData?.status, company) : "-"}
            </Text>
            <Text
              style={{
                color: orderData?.paidStatus
                  ? ORDER_PAYMENT_STATUS[orderData?.paidStatus].name_default
                  : undefined,
              }}
            >
              {orderData?.paidStatus
                ? ORDER_PAYMENT_STATUS[orderData?.paidStatus].name_default
                : "-"}
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

  const orderStatusOption = (
    <CardContainer>
      <Form form={form} onFinish={() => updateStatus()}>
        <Row gutter={16} justify='end'>
          <Col span={4}>
            {orderData?.status !== "WAIT_CONFIRM_ORDER" && (
              <Button
                title='ยกเลิกคำสั่งซื้อ'
                typeButton='danger'
                onClick={() => updateStatus("COMPANY_CANCLE_ORDER")}
              />
            )}
          </Col>
          <Col span={8} />
          <Col span={4}>
            <Form.Item name='status' noStyle initialValue={orderData?.status}>
              <Select
                data={[
                  "WAIT_CONFIRM_ORDER",
                  "CONFIRM_ORDER",
                  "OPEN_ORDER",
                  "IN_DELIVERY",
                  "DELIVERY_SUCCESS",
                ].map((key) => ({
                  key,
                  value: key,
                  label: getOrderStatus(key as OrderStatusKey, company),
                }))}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name='paymentStatus' noStyle>
              <Select
                data={Object.entries(ORDER_PAYMENT_STATUS).map(([key, { name_default }]) => ({
                  key,
                  value: key,
                  label: name_default,
                }))}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Button title='ปรับสถานะคำสั่งซื้อ' htmlType='submit' loading={updating} />
          </Col>
        </Row>
      </Form>
    </CardContainer>
  );

  const OrderNavOption = () => {
    const step = "wait"; //"success" 'wait' 'failed';
    const info = {
      wait: {
        borderColor: undefined,
        icon: undefined,
        title: (
          <Row align='middle' justify='space-between'>
            <Col span={20}>
              <div>
                <Text level={2}>
                  ส่งคำสั่งซื้อไปที่ระบบ <span style={{ color: color.primary }}>Navistion</span>
                </Text>
                &nbsp;
                <Text level={5}>
                  เมื่อตรวจสอบคำสั่งซื้อเรียบร้อยให้กดปุ่ม “ส่งการสั่งซื้อทันที”
                </Text>
              </div>
            </Col>
            <Col span={4}>
              <Row justify='end'>
                <Button title='ส่งการสั่งซื้อทันที' style={{ width: "180px" }} />
              </Row>
            </Col>
          </Row>
        ),
      },
      success: {
        borderColor: color.success,
        icon: icons.resultSuccess,
        title: (
          <>
            <Text level={2} color='success'>
              ส่งคำสั่งซื้อไปยังระบบ Navistion แล้ว
            </Text>
          </>
        ),
      },
      failed: {
        borderColor: color.warning,
        icon: icons.resultFailed,
        title: (
          <>
            <Text level={2} color='warning'>
              ส่งคำสั่งซื้อไปยังระบบ Navistion ไม่สำเร็จ “โปรดติดต่อทีม Support”
            </Text>
          </>
        ),
      },
    };
    const { borderColor, icon, title } = info[step];
    return (
      <NavResponseBox color={borderColor}>
        <FlexRow style={{ width: "100%" }}>
          {icon && (
            <div>
              <img src={icon} />
            </div>
          )}
          <div style={{ width: "100%" }}>
            {title}
            <br />
            <Form form={navForm} layout='vertical'>
              <Form.Item label='เงื่อนไข Memo'>
                <TextArea />
              </Form.Item>
            </Form>
          </div>
        </FlexRow>
      </NavResponseBox>
    );
  };
  const getOption = () => {
    switch (orderData?.status) {
      case "WAIT_CONFIRM_ORDER":
        return (
          <>
            <br />
            {orderStatusOption}
          </>
        );
      case "CONFIRM_ORDER":
      case "OPEN_ORDER":
      case "IN_DELIVERY":
      case "DELIVERY_SUCCESS":
        return (
          <>
            <br />
            <OrderNavOption />
            <br />
            {orderStatusOption}
          </>
        );
      default:
        return <></>;
    }
  };

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
                <DetailItem label='การจัดส่ง' value={orderData?.deliveryDest} />
                <DetailItem label='ที่อยู่' value={orderData?.deliveryAddress} />
                <DetailItem label='หมายเหตุการจัดส่ง' value={orderData?.deliveryRemark} />
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
              <DetailBox>{orderData?.saleCoRemark || "-"}</DetailBox>
              <br />
              <Text level={5} fontWeight={700}>
                หมายเหตุ (ขอส่วนลดพิเศษเพิ่ม)
              </Text>
              <DetailBox>{orderData?.specialRequestRemark || "-"}</DetailBox>
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
        {getOption()}
      </div>
    </>
  );
};
