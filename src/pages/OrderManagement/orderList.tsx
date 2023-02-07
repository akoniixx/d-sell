import React, { useEffect, useState, memo, ReactNode } from "react";
import { Table, Tabs, Modal, Switch, Row, Col, Pagination, Tag } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { RangePicker } from "../../components/DatePicker/DatePicker";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Text from "../../components/Text/Text";
import color from "../../resource/color";
import icons from "../../resource/icon";
import Select from "../../components/Select/Select";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AlignType } from "rc-table/lib/interface";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import { getOrders } from "../../datasource/OrderDatasourc";
import {
  OrderPaymentMethodName,
  OrderStatusKey,
  ORDER_PAYMENT_METHOD_NAME,
  ORDER_PAYMENT_STATUS,
  ORDER_STATUS,
} from "../../definitions/orderStatus";
import { numberFormatter, priceFormatter } from "../../utility/Formatter";
import { OrderEntity } from "../../entities/OrderEntity";

const SLASH_DMY = "DD/MM/YYYY";
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

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [dataState, setDataState] = useState({
    data: [],
    dashboard: {
      confirmStatusCount: 0,
      deliverySuccessCount: 0,
      inDeliveryCount: 0,
      waitConfirmStatusCount: 0,
    },
    count: 0,
  });

  const [dateFilter, setDateFilter] = useState<any>();

  useEffect(() => {
    if (!loading) fetchData();
  }, []);

  useEffect(() => {
    console.log("change filter");
    fetchData();
  }, [keyword, statusFilter]);

  const resetPage = () => setPage(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, dashboard, count } = await getOrders({
        search: keyword,
        status: statusFilter,
        page,
        take: pageSize,
      });
      // startDate endDate
      setDataState({ data, dashboard, count });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
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
      value: dataState.dashboard.waitConfirmStatusCount,
    },
    {
      color: "#0068F4",
      icon: icons.iconCliboard,
      title: "ยืนยันคำสั่งซื้อแล้ว",
      value: dataState.dashboard.confirmStatusCount,
    },
    {
      color: "#FF9138",
      icon: icons.iconTruck,
      title: "กำลังจัดส่ง",
      value: dataState.dashboard.inDeliveryCount,
    },
    {
      color: "#2ED477",
      icon: icons.iconCheckedTruck,
      title: "จัดส่งสำเร็จ",
      value: dataState.dashboard.deliverySuccessCount,
    },
  ];

  const columns = [
    {
      title: "รหัสคำสั่งซื้อ",
      dataIndex: "orderNo",
      key: "orderNo",
      width: "15%",
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
      width: "15%",
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
      width: "20%",
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
      title: "การจัดส่ง",
      dataIndex: "zone",
      key: "zone",
      width: "10%",
      render: (value: any, row: any, index: number) => {
        return (
          <FlexCol>
            <Text level={5}>{"-"}</Text>
          </FlexCol>
        );
      },
    },
    {
      title: "จำนวน",
      dataIndex: "price",
      key: "price",
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
      width: "15%",
      align: "center" as AlignType,
      render: (value: OrderStatusKey, row: any, index: number) => {
        return (
          <FlexCol align='center' justify='center'>
            <Text
              level={5}
              fontWeight={700}
              style={{ color: ORDER_STATUS[value]?.color, textAlign: "center" }}
            >
              {ORDER_STATUS[value]?.name_default || "-"}
            </Text>
            <Text
              level={6}
              style={{ color: ORDER_PAYMENT_STATUS.STATUS_1.color, textAlign: "center" }}
            >
              {ORDER_PAYMENT_STATUS.STATUS_1.name_default}
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
      width: "10%",
      render: (value: any, row: any, index: number) => {
        return {
          children: row.status ? (
            <>
              <div className='d-flex flex-row justify-content-between'>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() => navigate("/order/" + row.orderId)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <UnorderedListOutlined style={{ color: color["primary"] }} />
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ height: 32 }} />
            </>
          ),
        };
      },
    },
  ];

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
          <Row justify='space-between'>
            <Col span={8}>
              <Select
                data={Object.entries(ORDER_STATUS).map(([key, val]) => ({
                  key,
                  value: key,
                  label: val.name_default,
                }))}
                style={{ width: "100%" }}
                placeholder='ทั้งหมด'
                mode='multiple'
                maxTagCount='responsive'
                showArrow
                onChange={(value: string[]) => {
                  setStatusFilter(value);
                  resetPage();
                }}
              />
            </Col>
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
