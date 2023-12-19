import React, { ReactNode, useEffect, useState } from "react";
import { Row, Col, Divider, Form, Modal, Table, Image, Badge } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import Button from "../../components/Button/Button";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../components/PageTitle/PageTitleNested";
import styled from "styled-components";
import { ProductEntity } from "../../entities/PoductEntity";
import {
  DetailBox as DetailBoxStyled,
  FlexCol,
  FlexRow,
} from "../../components/Container/Container";
import color from "../../resource/color";
import image from "../../resource/image";
import icons from "../../resource/icon";
import Text from "../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import PageSpin from "../../components/Spin/pageSpin";
import Select from "../../components/Select/Select";
import { priceFormatter } from "../../utility/Formatter";
import {
  ORDER_STATUS,
  ORDER_PAYMENT_STATUS,
  ORDER_PAYMENT_METHOD_NAME,
  OrderStatusKey,
  OrderPaymentStatusKey,
  ORDER_DELIVERY_DEST_METHOD_NAME,
} from "../../definitions/orderStatus";
import { getOrderDetail, submitToNav, updateOrderStatus } from "../../datasource/OrderDatasourc";
import { OrderEntity } from "../../entities/OrderEntity";
import { getOrderStatus } from "../../utility/OrderStatus";
import TextArea from "../../components/Input/TextArea";
import Permission from "../../components/Permission/Permission";

const SLASH_DMY = "DD/MM/YYYY";
type FixedType = "left" | "right" | boolean | undefined;

const DetailBox = styled(DetailBoxStyled)`
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
  labelEn,
  value,
  alignRight,
  fontWeight,
  fontSize,
  color,
  style,
  leftSpan,
}: {
  label: string;
  labelEn?: string;
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
  leftSpan?: number;
}) => {
  return (
    <Row gutter={16} style={{ margin: "10px 0px" }}>
      <Col span={leftSpan ? leftSpan : alignRight ? 14 : 9}>
        <Text fontWeight={fontWeight} fontSize={fontSize}>
          {label}
        </Text>
        <br />
        {labelEn && (
          <Text fontWeight={fontWeight} fontSize={fontSize}>
            ({labelEn})
          </Text>
        )}
      </Col>
      <Col span={leftSpan ? 24 - leftSpan : alignRight ? 10 : 15}>
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
  const path = pathSplit[1];
  const isViewMode = path === "view-order";
  const isSpecialRequestMode = path === "special-request";

  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderEntity>();
  const [updating, setUpdating] = useState(false);
  const [showCancelModal, setCancelModal] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [navSubmitStatus, setNavSubmitStatus] = useState<"success" | "wait" | "failed">("wait");
  const [navSubmitBody, setNavSubmitBody] = useState<any>();

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
        console.log(res);
        setOrderData(res);
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmitStatus = async ({
    status,
    paidStatus,
    cancelRemark,
  }: {
    status: OrderStatusKey;
    paidStatus?: OrderPaymentStatusKey;
    cancelRemark?: string;
  }) => {
    setUpdating(true);
    const id = pathSplit[2];
    await updateOrderStatus({
      orderId: id,
      status,
      paidStatus,
      cancelRemark,
      updateBy: `${firstname} ${lastname}`,
    })
      .then((res: any) => {
        navigate(0);
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateStatus = async (nextStatus?: OrderStatusKey) => {
    const { status, paidStatus } = form.getFieldsValue();
    if (status === orderData?.status && paidStatus === orderData?.paidStatus) {
      Modal.error({
        title: "สถานะไม่มีการเปลี่ยนแปลง กรุณาตรวจสอบอีกครั้ง",
      });
      return;
    }
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
      onOk: () => onSubmitStatus({ status: nextStatus ? nextStatus : status, paidStatus }),
    });
  };

  const onSubmitOrder = async () => {
    const { remark } = navForm.getFieldsValue();
    const orderId = pathSplit[2];
    const onOk = async () => {
      setSubmitting(true);
      await submitToNav({
        orderId,
        remark,
        updateBy: `${firstname} ${lastname}`,
      })
        .then((res: any) => {
          const { success, userMessage } = res;
          if (success) {
            setNavSubmitStatus("success");
          } else {
            setNavSubmitStatus("failed");
          }
          setNavSubmitBody({ ...res, orderId, remark });
        })
        .catch((e: any) => {
          console.log(e);
        })
        .finally(() => {
          setSubmitting(false);
        });
    };
    Modal.confirm({
      title: "ส่งคำสั่งซื้อไปที่ระบบ Navision",
      onOk,
    });
  };

  const PageTitle = () => {
    return (
      <PageTitleNested
        title={`ORDER NO: ${orderData?.orderNo}`}
        showBack
        onBack={isSpecialRequestMode ? () => navigate(`/special-request`) : () => navigate(-1)}
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
              {
                text: isSpecialRequestMode ? "รายการขอโปรโมชันพิเศษเพิ่มเติม" : "รายการคำสั่งซื้อ",
                path: isSpecialRequestMode ? "/special-request" : -1,
              },
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
      dataIndex: "productName",
      key: "productName",
      render: (productName: string, row: ProductEntity, index: number) => {
        return {
          children: (
            <FlexRow align='center'>
              <div style={{ marginRight: 16 }}>
                <Image
                  src={row?.productImage || image.product_no_image}
                  style={{
                    width: "55px",
                    height: "55px",
                    objectFit: "contain",
                  }}
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
                {product?.productCodeNAV || product?.productFreebiesCodeNAV}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "จำนวน",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: string, product: ProductEntity, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{quantity}</Text>
              <Text level={6} color='Text3'>
                {product?.saleUOMTH || product?.saleUOM || product?.baseUnitOfMeaTh}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "ราคา / หน่วย",
      dataIndex: "marketPrice",
      key: "marketPrice",
      render: (marketPrice: number, product: ProductEntity, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{priceFormatter(marketPrice || "0", undefined, false, true)}</Text>
              <Text level={6} color='Text3'>
                {" บาท / " +
                  (product?.saleUOMTH || product?.saleUOM || product?.saleUom || "หน่วย")}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "โปรโมชัน",
      dataIndex: "orderProductPromotions",
      key: "orderProductPromotions",
      width: "8%",
      render: (orderProductPromotions: any[], product: any, index: number) => {
        const findPromotion = () => {
          let promotion = "";
          if (product?.orderProductPromotions.length) {
            const p: any = [];
            for (let i = 0; product?.orderProductPromotions.length > i; i++) {
              p.push(product?.orderProductPromotions[i].promotionCode);
            }
            promotion = p.map((a: any) => a).join(", ");
          } else {
            promotion = product.productPromotionCode;
          }
          return promotion || "-";
        };
        return {
          children: (
            <FlexCol>
              <Text key={index} level={5}>
                {findPromotion()}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "ลำดับการขน",
      dataIndex: "shipmentOrder",
      key: "shipmentOrder",
    },
    {
      title: "ส่วนลด",
      dataIndex: "discount",
      key: "discount",
      fixed: "right" as FixedType,
      render: (discount: number, product: ProductEntity, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5} color={discount ? "error" : "Text3"} fontWeight={700}>
                {discount ? "- " + priceFormatter(discount || "0", undefined, false, true) : "-"}
              </Text>
              <Text level={6} color='Text3'>
                บาท
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "Special REQ./หน่วย",
      dataIndex: "specialRequestDiscount",
      key: "specialRequestDiscount",
      fixed: "right" as FixedType,
      render: (discount: number, product: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5} color={discount ? "purple" : "Text3"} fontWeight={700}>
                {discount
                  ? "- " +
                    priceFormatter(discount / product.quantity || "0", undefined, false, true)
                  : "-"}
              </Text>
              <Text level={6} color='Text3'>
                บาท
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "Special REQ. รวม",
      dataIndex: "specialRequestDiscount",
      key: "specialRequestDiscount",
      fixed: "right" as FixedType,
      render: (discount: number, product: ProductEntity, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5} color={discount ? "purple" : "Text3"} fontWeight={700}>
                {discount ? "- " + priceFormatter(discount || "0", undefined, false, true) : "-"}
              </Text>
              <Text level={6} color='Text3'>
                บาท
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "จำนวนรวม",
      dataIndex: "price",
      key: "price",
      fixed: "right" as FixedType,
      render: (price: number, product: ProductEntity, index: number) => {
        return {
          children: (
            <>
              {product.isFreebie && !product.isSpecialRequestFreebie && (
                <div style={{ position: "relative", bottom: 26, right: -10 }}>
                  <Badge.Ribbon text='ของแถม' placement='end' />
                </div>
              )}
              {product.isFreebie && product.isSpecialRequestFreebie && (
                <div style={{ position: "relative", bottom: 26, right: -10 }}>
                  <Badge.Ribbon text='ของแถม' placement='end' color={color.error} />
                </div>
              )}
              <FlexCol>
                <Text level={5} color='primary' fontWeight={700}>
                  {priceFormatter(price || "0", undefined, false, true)}
                </Text>
                <Text level={6} color='Text3'>
                  {"บาท"}
                </Text>
              </FlexCol>
            </>
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
                onClick={() => setCancelModal(true)}
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
                placeholder='สถานะ'
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name='paidStatus' noStyle initialValue={orderData?.paidStatus}>
              <Select
                data={Object.entries(ORDER_PAYMENT_STATUS).map(([key, { name_default }]) => ({
                  key,
                  value: key,
                  label: name_default,
                }))}
                style={{ width: "100%" }}
                placeholder='สถานะการชำระเงิน'
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
    const step = navSubmitStatus; //"success" 'wait' 'failed';
    const info = {
      wait: {
        borderColor: undefined,
        icon: undefined,
        editable: true,
        title: (
          <Row align='middle' justify='space-between'>
            <Col span={20}>
              <div>
                <Text level={2}>
                  ส่งคำสั่งซื้อไปที่ระบบ <span style={{ color: color.primary }}>Navision</span>
                </Text>
                &nbsp;
                <Text level={5}>
                  เมื่อตรวจสอบคำสั่งซื้อเรียบร้อยให้กดปุ่ม “ส่งการสั่งซื้อทันที”
                </Text>
              </div>
            </Col>
            <Col span={4}>
              <Row justify='end'>
                <Button
                  title='ส่งการสั่งซื้อทันที'
                  style={{ width: "180px" }}
                  onClick={onSubmitOrder}
                />
              </Row>
            </Col>
          </Row>
        ),
      },
      success: {
        borderColor: color.success,
        icon: icons.resultSuccess,
        editable: false,
        title: (
          <>
            <Text level={2} color='success'>
              ส่งคำสั่งซื้อไปยังระบบ Navision แล้ว
            </Text>
            <br />
            <Text>
              SO Number {navSubmitBody?.responseData?.Order_No} อัปเดทไปยังระบบล่าสุด เมื่อ&nbsp;
              {moment(navSubmitBody?.responseDateTime).format("DD/MM/YYYY HH:mm")}
            </Text>
            <br />
          </>
        ),
      },
      failed: {
        borderColor: color.warning,
        icon: icons.resultFailed,
        editable: false,
        title: (
          <>
            <Text level={2} color='warning'>
              ส่งคำสั่งซื้อไปยังระบบ Navision ไม่สำเร็จ “โปรดติดต่อทีม Support”
            </Text>
            <br />
            <Text>
              อัปเดทไปยังระบบล่าสุด เมื่อ&nbsp;
              {moment(navSubmitBody?.responseDateTime).format("DD/MM/YYYY HH:mm")}
            </Text>
            <br />
            <Text level={6} color='error'>
              message:&nbsp;{navSubmitBody?.userMessage}
            </Text>
            <br />
            <Text level={6} color='error'>
              ({navSubmitBody?.developerMessage})
            </Text>
            <br />
          </>
        ),
      },
    };
    const { borderColor, icon, title, editable } = info[step];
    return (
      <NavResponseBox color={borderColor}>
        <FlexRow style={{ width: "100%" }}>
          {icon && (
            <div>
              <img src={icon} />
            </div>
          )}
          <div style={{ width: "100%", paddingLeft: editable ? 0 : 20 }}>
            {title}
            <br />
            <Form form={navForm} layout='vertical'>
              <Form.Item name='remark' label='เงื่อนไข Memo'>
                <TextArea disabled={!editable} />
              </Form.Item>
            </Form>
          </div>
        </FlexRow>
      </NavResponseBox>
    );
  };

  const getOption = () => {
    switch (orderData?.status) {
      case "WAIT_APPROVE_ORDER":
        return !isSpecialRequestMode ? (
          <></>
        ) : (
          <>
            <br />
            <CardContainer>
              <Row gutter={16} align='middle' justify='end'>
                <Col span={3}>
                  <Row justify='end'>
                    <Text>จัดการคำสั่งซื้อ :</Text>
                  </Row>
                </Col>
                <Col span={3}>
                  <Button
                    title='ปฎิเสธ'
                    typeButton='danger'
                    onClick={() => setCancelModal(true)}
                    // onClick={() => updateStatus("REJECT_ORDER")}
                  />
                </Col>
                <Col span={3}>
                  <Button
                    title='อนุมัติ'
                    typeButton='primary'
                    onClick={() => updateStatus("WAIT_CONFIRM_ORDER")}
                  />
                </Col>
              </Row>
            </CardContainer>
          </>
        );
      case "WAIT_CONFIRM_ORDER":
      case "OPEN_ORDER":
      case "IN_DELIVERY":
        return isSpecialRequestMode ? (
          <></>
        ) : (
          <>
            <br />
            {orderStatusOption}
          </>
        );
      case "CONFIRM_ORDER":
        return isSpecialRequestMode ? (
          <></>
        ) : (
          <>
            <br />
            <OrderNavOption />
            <br />
            {orderStatusOption}
          </>
        );
      case "DELIVERY_SUCCESS":
        return <></>;
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
              <DetailBox style={{ height: 260 }}>
                <DetailItem label='ชื่อร้านค้า' value={orderData?.customerName} />
                <DetailItem label='Customer Code' value={orderData?.customerNo} />
                <DetailItem label='เขต' value={orderData?.customerZone} />
                <DetailItem label='SO NO.' value={orderData?.soNo} />
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
              <DetailBox style={{ height: 260 }}>
                {/* TODO */}
                <DetailItem
                  label='การจัดส่ง'
                  value={
                    orderData?.deliveryDest
                      ? ORDER_DELIVERY_DEST_METHOD_NAME[orderData?.deliveryDest]
                      : "-"
                  }
                />
                <DetailItem label='ที่อยู่' value={orderData?.deliveryAddress} />
                {/* <DetailItem label='หมายเหตุการจัดส่ง' value={orderData?.deliveryRemark} /> */}
                <DetailItem label='ข้อมูลทะเบียนรถ' value={orderData?.numberPlate} />
              </DetailBox>
            </CardContainer>
          </Col>
        </Row>
        <br />
        <CardContainer>
          <Row>
            <Col span={12}>
              <Text level={4} fontWeight={700}>
                รายการสินค้า
              </Text>
            </Col>
            <Col span={12}>
              <div style={{ display: "flex", justifyContent: "end", paddingRight: 8, gap: 8 }}>
                <Image src={icons.ribbonBadgeBlue} preview={false} width={20} />{" "}
                <span>ของแถมโปรโมชั่น</span>
                <Image src={icons.ribbonBadgeRed} preview={false} width={20} />{" "}
                <span>ของแถม Special Request</span>
              </div>
            </Col>
          </Row>
          <br />
          <Table
            columns={columns}
            dataSource={
              orderData?.orderProducts?.sort((a, b) =>
                ("" + (a.productCodeNAV || a.productFreebiesCodeNAV)).localeCompare(
                  b.productCodeNAV || b.productFreebiesCodeNAV || "",
                ),
              ) || []
            }
            pagination={false}
            scroll={{ x: "max-content" }}
          />
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
                หมายเหตุ (การจัดส่ง)
              </Text>
              <DetailBox>{orderData?.deliveryRemark || "-"}</DetailBox>
              <br />
              <Text level={5} fontWeight={700}>
                หมายเหตุ (ขอส่วนลดพิเศษเพิ่ม)
              </Text>
              <DetailBox>{orderData?.specialRequestRemark || "-"}</DetailBox>
              <br />
              <Text level={5} fontWeight={700}>
                หมายเหตุการยกเลิก (บริษัท)
              </Text>
              <DetailBox>{orderData?.cancelRemark || "-"}</DetailBox>
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
                  value={priceFormatter(orderData?.price || "0", undefined, true)}
                  alignRight
                  fontWeight={700}
                  fontSize={18}
                  leftSpan={10}
                />
                <DetailItem label='รายละเอียดส่วนลด' value=' ' fontWeight={700} fontSize={18} />
                <DetailBox style={{ backgroundColor: "white", padding: 22 }}>
                  <DetailItem
                    label='ส่วนลดรายการ'
                    labelEn='Discount'
                    value={priceFormatter(orderData?.discount || "0", undefined, true)}
                    color='error'
                    alignRight
                    style={{ color: "#2ED477" }}
                  />
                  <DetailItem
                    label='ส่วนลดพิเศษ'
                    labelEn='Special Req.'
                    value={priceFormatter(
                      orderData?.specialRequestDiscount || "0",
                      undefined,
                      true,
                    )}
                    style={{ color: "#9B51E0" }}
                    alignRight
                  />
                  <DetailItem
                    label='ส่วนลดเงินสด'
                    labelEn='Cash'
                    value={priceFormatter(orderData?.cashDiscount || "0", undefined, true)}
                    color='secondary'
                    style={{ color: "#FF9138" }}
                    alignRight
                  />
                  <DetailItem
                    label=' ส่วนลดดูแลราคา'
                    labelEn='CO. ดูแลราคา / วงเงินเคลม'
                    value={priceFormatter(orderData?.coDiscount || "0", undefined, true)}
                    color='success'
                    alignRight
                    style={{ color: "#F46363" }}
                  />
                </DetailBox>
                <br />
                <DetailItem
                  label='รวมส่วนลดสุทธิ'
                  value={priceFormatter(orderData?.totalDiscount || "0", undefined, true)}
                  fontWeight={700}
                  fontSize={18}
                  alignRight
                  leftSpan={10}
                />
                <DetailItem
                  label={`มูลค่ารวมหลังหักส่วนลด`}
                  value={priceFormatter(
                    (orderData?.price || 0) - (orderData?.totalDiscount || 0) || "0",
                    undefined,
                    true,
                  )}
                  fontWeight={700}
                  fontSize={18}
                  alignRight
                  leftSpan={10}
                />
                {!!orderData?.vat && orderData?.vat > 0 && (
                  <DetailItem
                    label={`ภาษีมูลค่าเพิ่ม ${orderData?.vatPercentage}%`}
                    value={priceFormatter(orderData?.vat || "0", undefined, true)}
                    fontWeight={700}
                    fontSize={18}
                    alignRight
                    leftSpan={10}
                  />
                )}
                <Divider />
                <DetailItem
                  label='ราคารวม'
                  value={
                    <Text color='primary' fontWeight={700} fontSize={32}>
                      {priceFormatter(orderData?.totalPrice || "0", undefined, true)}
                    </Text>
                  }
                  fontWeight={700}
                  fontSize={24}
                  alignRight
                  leftSpan={10}
                />
              </DetailBox>
            </CardContainer>
          </Col>
        </Row>
        {!isViewMode && (
          <Permission
            permission={
              isSpecialRequestMode ? ["specialRequest", "approve"] : ["manageOrder", "edit"]
            }
          >
            <div>{getOption()}</div>
          </Permission>
        )}
      </div>
      <Modal open={showCancelModal} footer={false} closable={false} width={420}>
        <FlexCol align='center'>
          <Text fontWeight={700}>
            {isSpecialRequestMode
              ? `เหตุผลที่ปฎิเสธคำขอสั่งซื้อพิเศษ*`
              : `เหตุผลยกเลิกคำสั่งซื้อ (โดยบริษัท)*`}
          </Text>
          <br />
        </FlexCol>
        <Form form={form}>
          <Form.Item noStyle name='cancelRemark'>
            <TextArea rows={4} placeholder='โปรดระบุเหตุผล...' />
          </Form.Item>
        </Form>
        <br />
        <Row gutter={16}>
          <Col span={12}>
            <Button
              title='ยกเลิก'
              typeButton='primary-light'
              style={{ width: "100%" }}
              onClick={() => setCancelModal(false)}
            />
          </Col>
          <Col span={12}>
            <Button
              title='ยืนยัน'
              typeButton='primary'
              style={{ width: "100%" }}
              onClick={() =>
                onSubmitStatus({
                  status: isSpecialRequestMode ? "REJECT_ORDER" : "COMPANY_CANCEL_ORDER",
                  cancelRemark: form.getFieldValue("cancelRemark"),
                })
              }
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
