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
import { priceFormatter } from "../../../utility/Formatter";

export const CustomerCreditMemoDetail: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CreditMemoEntity>();
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const id = pathSplit[3];
    await getCustomerCreditMemo(id)
      .then((res: any) => {
        console.log("getCreditMemoById", res);
        setData(res);
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    const id = pathSplit[3];
    await getCreditHistory(id)
      .then((res: any) => {
        console.log("getCreditHistory", res);
        setHistory(res);
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
              { text: "Discount CO รายร้าน", path: "/discount/list" },
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
      dataIndex: "customerCompanyId",
      key: "customerCompanyId",
      align: "center" as AlignType,
      render: (value: string) => {
        return "10/09/2021 10:40 น.";
      },
    },
    {
      title: "รายละเอียดออเดอร์",
      dataIndex: "customerName",
      key: "customerName",
      align: "center" as AlignType,
      render: (value: string) => {
        return <Button title='ดูรายละเอียด' />;
      },
    },
    {
      title: "จำนวนยอดสั่งซื้อ",
      dataIndex: "receiveAmount",
      key: "receiveAmount",
      align: "center" as AlignType,
      render: (value: string) => {
        return "1,461,600 ฿";
      },
    },
    {
      title: "ยอดก่อนใช้ส่วนลดดูแลราคา",
      dataIndex: "receiveAmount",
      key: "receiveAmount",
      align: "center" as AlignType,
      render: (value: string) => {
        return "261,000 ฿";
      },
    },
    {
      title: "รวมส่วนลดดูแลราคาที่ใช้",
      dataIndex: "receiveAmount",
      key: "receiveAmount",
      align: "center" as AlignType,
      render: (value: string) => {
        return <Text color='error'>-61,600 ฿</Text>;
      },
    },
    {
      title: "คงเหลือส่วนลดดูแลราคา",
      dataIndex: "receiveAmount",
      key: "receiveAmount",
      align: "center" as AlignType,
      render: (value: string) => {
        return <Text>199,400 ฿</Text>;
      },
    },
  ];

  const tabsItems = [
    {
      label: `ประวัติการใช้งาน Credit Memo`,
      key: "1",
      children: (
        <>
          <br />
          <Text fontWeight={700}>รายการประวัติได้รับ Credit memo</Text>
          <br />
          <br />
          <TableContainer>
            <Table
              columns={creditMemoColumn}
              dataSource={data?.creditMemoShop?.map((s: any, i: any) => ({ ...s, key: i }))}
              pagination={false}
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
          <Row style={{ margin: "16px 0px" }}>
            <Text fontWeight={700} level={4}>
              รายการประวัติได้รับ Credit memo
            </Text>
          </Row>
          <TableContainer>
            <Table dataSource={history} columns={[]} />
          </TableContainer>
        </>
      ),
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
                      {priceFormatter(361600, 0, true)}
                    </Text>
                  </DetailBox>
                </Row>
              </Col>
            </Row>
            <br />
          </CardContainer>
          <br />
          <CardContainer>
            <>
              <Tabs
                items={tabsItems}
                onChange={(key: string) => {
                  if (key === "2" && !history) {
                    fetchHistory();
                  }
                }}
              />
            </>
          </CardContainer>
        </div>
      )}
    </>
  );
};
