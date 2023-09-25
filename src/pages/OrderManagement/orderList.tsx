import React, { useEffect, useState } from "react";
import { Table, Col, Image, Row } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { RangePicker } from "../../components/DatePicker/DatePicker";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Text from "../../components/Text/Text";
import color from "../../resource/color";
import icons from "../../resource/icon";
import Select from "../../components/Select/Select";
import { AlignType } from "rc-table/lib/interface";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import { getOrders, getPdfPo } from "../../datasource/OrderDatasourc";
import {
  OrderDeliveryDestKey,
  OrderPaymentMethodName,
  OrderStatusKey,
  ORDER_DELIVERY_DEST_METHOD_NAME,
  ORDER_PAYMENT_METHOD_NAME,
  ORDER_PAYMENT_STATUS,
  ORDER_STATUS,
} from "../../definitions/orderStatus";
import { numberFormatter, priceFormatter } from "../../utility/Formatter";
import { OrderEntity } from "../../entities/OrderEntity";
import { zoneDatasource } from "../../datasource/ZoneDatasource";
import { getOrderStatus } from "../../utility/OrderStatus";
import Permission, { checkPermission } from "../../components/Permission/Permission";
import { roleAtom } from "../../store/RoleAtom";
import { useRecoilValue } from "recoil";

const SLASH_DMY = "DD/MM/YYYY HH:mm";
const SummaryBox = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) => {
  return (
    <Col span={6}>
      <div
        style={{ width: "100%", padding: "20px 24px", borderRadius: 20, backgroundColor: color }}
      >
        <FlexRow align='center' justify='space-between'>
          <Text level={1} color='white' fontSize={32} fontWeight={700}>
            {value}
          </Text>
          <img src={icon} />
        </FlexRow>
        <div>
          <Text level={4} color='white' fontWeight={700}>
            {title}
          </Text>
        </div>
      </div>
    </Col>
  );
};

export const OrderList: React.FC = () => {
  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const roleData = useRecoilValue(roleAtom);

  const navigate = useNavigate();

  const [zone, setZone] = React.useState<{ label: string; value: string; key: string }[]>([]);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>();
  const [zoneFilter, setZoneFilter] = useState<string[]>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [dateFilter, setDateFilter] = useState<any>();
  const [dataState, setDataState] = useState({
    data: [],
    statusCount: {
      COMPANY_CANCEL_ORDER: 0,
      CONFIRM_ORDER: 0,
      DELIVERY_SUCCESS: 0,
      IN_DELIVERY: 0,
      OPEN_ORDER: 0,
      REJECT_ORDER: 0,
      SHOPAPP_CANCEL_ORDER: 0,
      WAIT_APPROVE_ORDER: 0,
      WAIT_CONFIRM_ORDER: 0,
    },
    count: 0,
  });

  useEffect(() => {
    if (!loading) fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [keyword, statusFilter, zoneFilter, dateFilter, page]);

  const resetPage = () => setPage(1);

  const getZoneByCompany = async () => {
    const res = await zoneDatasource.getAllZoneByCompany(company);
    const data = res.map((item: any) => {
      return {
        label: item.zoneName,
        value: item.zoneName,
        key: item.zoneId,
      };
    });
    setZone(data);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, statusCount, count } = await getOrders({
        company,
        search: keyword,
        status: statusFilter,
        customerZones: zoneFilter,
        page,
        take: pageSize,
        startDate: dateFilter && dateFilter[0] ? dateFilter[0].format("YYYY-MM-DD") : undefined,
        endDate: dateFilter && dateFilter[1] ? dateFilter[1].format("YYYY-MM-DD") : undefined,
      });
      setDataState({ data, statusCount, count });
      if (zone.length <= 0) {
        getZoneByCompany();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const getPdf = async (id: string, orderCode: string) => {
    await getPdfPo(id).then((res: any) => {
      const blob = new Blob([res], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.setAttribute("download", `${orderCode}.pdf`);
      a.click();
    });
  };

  const PageTitle = () => {
    return (
      <Row align='middle' gutter={16}>
        <Col className='gutter-row' span={16}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              จัดการคำสั่งซื้อ
            </span>
          </div>
        </Col>
        <Col span={8}>
          <RangePicker
            allowEmpty={[true, true]}
            enablePast
            value={dateFilter}
            onChange={(dates, dateString) => {
              setDateFilter(dates);
            }}
          />
        </Col>
      </Row>
    );
  };

  const summaryBoxList = [
    {
      color: "#FFC804",
      icon: icons.iconWaiting,
      title: "รอยืนยันคำสั่งซื้อ",
      value:
        dataState?.statusCount?.WAIT_APPROVE_ORDER + dataState?.statusCount?.WAIT_CONFIRM_ORDER,
    },
    {
      color: "#0068F4",
      icon: icons.iconCliboard,
      title: "ยืนยันคำสั่งซื้อแล้ว",
      value: dataState?.statusCount?.CONFIRM_ORDER,
    },
    {
      color: "#FF9138",
      icon: icons.iconTruck,
      title: "กำลังจัดส่ง",
      value: dataState?.statusCount?.IN_DELIVERY,
    },
    {
      color: "#2ED477",
      icon: icons.iconCheckedTruck,
      title: "จัดส่งสำเร็จ",
      value: dataState?.statusCount?.DELIVERY_SUCCESS,
    },
  ];

  const columns = [
    {
      title: "รหัสคำสั่งซื้อ",
      dataIndex: "orderNo",
      key: "orderNo",
      width: 138,
      render: (value: any, row: any, index: number) => {
        return (
          <FlexCol>
            <Text level={5}>{value || "-"}</Text>
            <Text level={6} color='Text3'>
              {moment(row.createAt).format(SLASH_DMY)}
            </Text>
          </FlexCol>
        );
      },
    },
    {
      title: "รหัส SO",
      dataIndex: "soNo",
      key: "soNo",
      width: 132,
      render: (value: any, row: any, index: number) => {
        return (
          <FlexCol>
            <Text level={5}>{value || "-"}</Text>
          </FlexCol>
        );
      },
    },
    {
      title: "รายชื่อร้านค้า",
      dataIndex: "customerName",
      key: "customerName",
      render: (value: any, row: any, index: number) => {
        return (
          <FlexCol>
            <Text level={5}>{value || "-"}</Text>
            <Text level={6} color='Text3'>
              {row.customerNo}
            </Text>
          </FlexCol>
        );
      },
    },
    {
      title: "เขต",
      dataIndex: "customerZone",
      key: "customerZone",
      width: 100,
      render: (value: any, row: any, index: number) => {
        return (
          <FlexCol>
            <Text level={5}>{value || "-"}</Text>
          </FlexCol>
        );
      },
    },
    {
      title: "การจัดส่ง",
      dataIndex: "deliveryDest",
      key: "deliveryDest",
      width: 110,
      render: (value: OrderDeliveryDestKey, row: any, index: number) => {
        return (
          <FlexCol>
            <Text level={5}>{value ? ORDER_DELIVERY_DEST_METHOD_NAME[value] : "-"}</Text>
          </FlexCol>
        );
      },
    },
    {
      title: "จำนวน",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: "15%",
      render: (value: any, row: any, index: number) => {
        return (
          <FlexCol>
            <Text level={5}>{numberFormatter(value) || "-"}</Text>
            <Text level={6} color='Text3'>
              {ORDER_PAYMENT_METHOD_NAME[row.paymentMethod as OrderPaymentMethodName] || "-"}
            </Text>
          </FlexCol>
        );
      },
    },
    {
      title: "วันที่ & สถานะ",
      dataIndex: "status",
      key: "status",
      width: 180,
      align: "center" as AlignType,
      render: (value: OrderStatusKey, row: OrderEntity, index: number) => {
        return (
          <FlexCol align='center' justify='center'>
            <Text
              level={5}
              fontWeight={700}
              style={{ color: ORDER_STATUS[value]?.color, textAlign: "center" }}
            >
              {getOrderStatus(value, company) || "-"}
            </Text>
            <Text
              level={6}
              style={{
                color: row?.paidStatus
                  ? ORDER_PAYMENT_STATUS[row?.paidStatus].name_default
                  : undefined,
                textAlign: "center",
              }}
            >
              {row?.paidStatus ? ORDER_PAYMENT_STATUS[row?.paidStatus].name_default : "-"}
            </Text>
            <Text level={6} color='Text3' style={{ textAlign: "center" }}>
              {moment(row.updateAt).format(SLASH_DMY)}
            </Text>
          </FlexCol>
        );
      },
    },
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      width: 100,
      hidden: !checkPermission(["manageOrder", "view"], roleData),
      render: (value: any, row: any, index: number) => {
        return {
          children: row.status ? (
            <Row justify={"space-between"} gutter={8}>
              <Col span={12}>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() => navigate("/order/" + row.orderId)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <UnorderedListOutlined style={{ color: color["primary"] }} />
                  </span>
                </div>
              </Col>
              {company === "ICPI" && (
                <Col span={12}>
                  <div
                    className='btn btn-icon btn-light btn-hover-primary btn-sm'
                    onClick={() => getPdf(row.orderId, row.orderNo)}
                  >
                    <Image
                      src={icons.downloadFileIcon}
                      preview={false}
                      style={{ width: 18, height: 22, color: color.BK, paddingBottom: 4 }}
                    />
                  </div>
                </Col>
              )}
            </Row>
          ) : (
            <>
              <div style={{ height: 32 }} />
            </>
          ),
        };
      },
    },
  ].filter((item) => !item.hidden);

  return (
    <>
      <div className='container '>
        <CardContainer>
          <PageTitle />
          <br />
          <br />
          <Row gutter={16}>
            {summaryBoxList.map((e, i) => (
              <SummaryBox {...e} key={i} />
            ))}
          </Row>
          <br />
          <br />
          <Row justify='space-between' gutter={16}>
            <Col span={6}>
              <Select
                data={Object.entries(ORDER_STATUS).map(([key, val]) => ({
                  key,
                  value: key,
                  label: val.name_default,
                }))}
                style={{ width: "100%" }}
                placeholder='สถานะทั้งหมด'
                mode='multiple'
                maxTagCount='responsive'
                showArrow
                onChange={(value: string[]) => {
                  setStatusFilter(value);
                  resetPage();
                }}
              />
            </Col>
            <Col span={6}>
              <Select
                data={zone}
                style={{ width: "100%" }}
                placeholder='เขตทั้งหมด'
                mode='multiple'
                maxTagCount='responsive'
                showArrow
                onChange={(value: string[]) => {
                  setZoneFilter(value);
                  resetPage();
                }}
              />
            </Col>
            <Col span={4}></Col>
            <Col span={8}>
              <Input
                placeholder='ค้นหา...'
                suffix={<SearchOutlined />}
                defaultValue={keyword}
                onPressEnter={(e) => {
                  const value = (e.target as HTMLTextAreaElement).value;
                  setKeyword(value);
                  resetPage();
                }}
                onChange={(e) => {
                  const value = (e.target as HTMLInputElement).value;
                  if (!value) {
                    setKeyword("");
                    resetPage();
                  }
                }}
              />
            </Col>
          </Row>
          <br />
          <Table
            className='rounded-lg'
            columns={columns}
            dataSource={dataState.data.map((e: OrderEntity, i: number) => ({ ...e, key: i }))}
            pagination={{
              pageSize,
              current: page,
              total: dataState.count,
              showSizeChanger: false,
              position: ["bottomCenter"],
              onChange: (page) => setPage(page),
            }}
            size='large'
            tableLayout='fixed'
            loading={loading}
          />
        </CardContainer>
      </div>
    </>
  );
};
