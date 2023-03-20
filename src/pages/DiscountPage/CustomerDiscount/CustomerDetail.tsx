import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Form, message, Modal, Spin, Tabs, Tag, Table } from "antd";
import { CardContainer } from "../../../components/Card/CardContainer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Button from "../../../components/Button/Button";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import styled from "styled-components";
import { PromotionType } from "../../../definitions/promotion";
import productState from "../../../store/productList";
import { ProductEntity } from "../../../entities/PoductEntity";
import {
  createCreditMemo,
  getCreditHistory,
  getCreditMemoById,
  getCustomerCreditMemo,
  getCustomerCreditMemoHistory,
  getOrderHistory,
  updateCreditMemo,
} from "../../../datasource/CreditMemoDatasource";
import { DetailBox, FlexCol, FlexRow } from "../../../components/Container/Container";
import { CheckCircleTwoTone, EditOutlined } from "@ant-design/icons";
import color from "../../../resource/color";
import Text from "../../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Steps from "../../../components/StepAntd/steps";
import { StoreEntity } from "../../../entities/StoreEntity";
import { CreditMemoEntity } from "../../../entities/CreditMemoEntity";
import TableContainer from "../../../components/Table/TableContainer";
import { AlignType } from "rc-table/lib/interface";
import PageSpin from "../../../components/Spin/pageSpin";
import { dateFormatter, priceFormatter } from "../../../utility/Formatter";

export const CustomerCreditMemoDetail: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>();
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoadingProfile(true);
    const id = pathSplit[3];
    await getCustomerCreditMemo(id)
      .then(async (res: any) => {
        console.log("profile", res);
        setProfile(res);
        setLoadingProfile(false);
        setLoading(true);
        await getOrderHistory({ creditMemoShopId: res?.credit_memo_shop_id })
          .then((res: any) => {
            console.log(res.data);
            setData(res?.data);
          })
          .catch((e: any) => {
            console.log(e);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((e: any) => {
        console.log(e);

        setLoadingProfile(false);
      });
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    const id = pathSplit[3];
    await getCreditHistory(id)
      .then((res: any) => {
        console.log("getCreditHistory", res);
        setHistory(res?.filter((h: any) => h?.action === "สร้าง Credit Memo"));
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
        title='รายละเอียดร้านค้า'
        showBack
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "Discount CO รายร้าน", path: "/discount/customerList" },
              { text: "รายละเอียดร้านค้า", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };

  const creditMemoColumn = [
    {
      title: "วันที่ใช้งาน",
      dataIndex: "updateAt",
      key: "updateAt",
      align: "center" as AlignType,
      render: (value: string) => {
        return dateFormatter(value);
      },
    },
    {
      title: "รายละเอียดออเดอร์",
      dataIndex: "orderId",
      key: "orderId",
      align: "center" as AlignType,
      render: (value: string) => {
        return <Button title='ดูรายละเอียด' onClick={() => navigate(`/order/${value}`)} />;
      },
    },
    {
      title: "จำนวนยอดสั่งซื้อ",
      dataIndex: "orderTotalPrice",
      key: "orderTotalPrice",
      align: "center" as AlignType,
      render: (value: string) => {
        return priceFormatter(value, 2, true);
      },
    },
    {
      title: "ยอดก่อนใช้ส่วนลดดูแลราคา",
      dataIndex: "balanceBefore",
      key: "balanceBefore",
      align: "center" as AlignType,
      render: (value: string) => {
        return priceFormatter(value, 2, true);
      },
    },
    {
      title: "รวมส่วนลดดูแลราคาที่ใช้",
      dataIndex: "usedAmount",
      key: "usedAmount",
      align: "center" as AlignType,
      render: (value: string) => {
        return <Text color='error'>{priceFormatter(value, 2, true)}</Text>;
      },
    },
    {
      title: "คงเหลือส่วนลดดูแลราคา",
      dataIndex: "balanceAfter",
      key: "balanceAfter",
      align: "center" as AlignType,
      render: (value: string) => {
        return priceFormatter(value, 2, true);
      },
    },
  ];

  const historyColumns = [
    {
      title: "วันเวลาที่อัปเดท",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center" as AlignType,
      width: "20%",
      render: (value: string) => {
        return dateFormatter(value);
      },
    },
    {
      title: "ผู้อัปเดท",
      dataIndex: "createBy",
      key: "createBy",
      align: "center" as AlignType,
      width: "20%",
      render: (value: string) => {
        return value || "-";
      },
    },
    {
      title: "ชื่อรายการ Credit Memo",
      dataIndex: "action",
      key: "action",
      align: "center" as AlignType,
      width: "40%",
    },
    {
      title: "จำนวนส่วนลดดูแลราคา",
      dataIndex: "afterValue",
      key: "afterValue",
      align: "center" as AlignType,
      width: "20%",
      render: (value: string) => {
        return priceFormatter(value, 2, true);
      },
    },
  ];

  const tabsItems = [
    {
      label: `ประวัติการใช้งาน Credit Memo`,
      key: "1",
      children: (
        <>
          <TableContainer>
            <Table
              columns={creditMemoColumn}
              dataSource={data?.map((s: any, i: any) => ({ ...s, key: i }))}
              pagination={{
                pageSize: 8,
                position: ["bottomCenter"],
              }}
            />
          </TableContainer>
        </>
      ),
    },
    {
      label: `ประวัติได้รับ Credit memo`,
      key: "2",
      children: (
        <>
          <TableContainer>
            <Table
              dataSource={history}
              columns={historyColumns}
              pagination={{
                pageSize: 8,
                position: ["bottomCenter"],
              }}
            />
          </TableContainer>
        </>
      ),
    },
  ];

  const profileList = [
    {
      title: "ชื่อร้านค้า",
      value: profile?.customer_name,
    },
    {
      title: "จังหวัด",
      value: profile?.province,
    },
    {
      title: "รายชื่อสมาชิก",
      value: `${profile?.firstname || "-"} ${profile?.lastname || ""}`,
    },
    {
      title: "เขต",
      value: profile?.zone,
    },
  ];

  return (
    <>
      {loading ? (
        <PageSpin />
      ) : (
        <div className='container '>
          <CardContainer>
            <Row gutter={16}>
              <Col span={12}>
                <PageTitle />
              </Col>
              <Col span={12}>
                <Row justify='end'>
                  <DetailBox style={{ padding: "20px 32px" }}>
                    <Text fontWeight={700} level={4}>
                      ส่วนลดดูแลราคาคงเหลือ :
                    </Text>
                    &nbsp;&nbsp;&nbsp;
                    <Text fontWeight={700} fontSize={32} color='primary'>
                      {priceFormatter(profile?.balance, 0, true)}
                    </Text>
                  </DetailBox>
                </Row>
              </Col>
            </Row>
            <br />
            <Row>
              {profileList.map(({ title, value }, i) => (
                <Col span={12} key={i} style={{ margin: "8px 0px" }}>
                  <Row>
                    <Col span={10}>
                      <Text color='Text3'>{title}</Text>
                    </Col>
                    <Col span={14}>
                      <Text>{value || "-"}</Text>
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
            <br />
          </CardContainer>
          <br />
          <CardContainer>
            <Row style={{ margin: "16px 0px" }}>
              <Text fontWeight={700} level={4}>
                รายการประวัติ Credit memo
              </Text>
            </Row>
            <Tabs
              items={tabsItems}
              onChange={(key: string) => {
                if (key === "2" && !history) {
                  fetchHistory();
                }
              }}
            />
          </CardContainer>
        </div>
      )}
    </>
  );
};
