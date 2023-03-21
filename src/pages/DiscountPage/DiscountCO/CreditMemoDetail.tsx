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
import { FlexCol, FlexRow } from "../../../components/Container/Container";
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

const SLASH_DMY = "DD/MM/YYYY";
export const CreditMemoDetail: React.FC = () => {
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
    await getCreditMemoById(id)
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
        setHistoryLoading(false);
      });
  };

  const PageTitle = () => {
    return (
      <PageTitleNested
        title='รายละเอียด Credit Memo'
        showBack
        extra={
          <Button
            type='primary'
            icon={<EditOutlined />}
            title='แก้ไขรายละเอียด'
            height={40}
            onClick={() => navigate(`/discount/edit/${pathSplit[3]}`)}
          />
        }
        customBreadCrumb={
          <BreadCrumb
            data={[
              { text: "รายการ เพิ่ม/ลด Credit Memo", path: "/discount/list" },
              { text: "รายละเอียด Credit Memo", path: window.location.pathname },
            ]}
          />
        }
      />
    );
  };

  const descriptionItems = [
    {
      label: "สถานะ",
      value: (
        <>
          <Tag color={data?.creditMemoStatus ? color.success : "default"}>
            {data?.creditMemoStatus ? "Active" : "Inactive"}
          </Tag>
        </>
      ),
    },
    {
      label: "ชื่อรายการ",
      value: data?.creditMemoName,
    },
    {
      label: "จำนวนรายการทั้งหมด",
      value: data?.creditMemoShop?.length || "0",
    },
    {
      label: "หมายเหตุเพิ่มเติม",
      value: data?.remark || "-",
    },
    {
      label: "อัปเดทโดย",
      value: data?.updateBy || "-",
    },
  ];

  const creditMemoColumn = [
    {
      title: "รหัสร้านค้า",
      dataIndex: "customerCompanyId",
      key: "customerCompanyId",
      align: "center" as AlignType,
    },
    {
      title: "ชื่อร้านค้า",
      dataIndex: "customerName",
      key: "customerName",
      align: "center" as AlignType,
    },
    {
      title: "ส่วนลดดูแลราคา",
      dataIndex: "receiveAmount",
      key: "receiveAmount",
      align: "center" as AlignType,
    },
  ];

  const creditMemoHistoryColumn = [
    {
      title: "วันเวลาที่อัปเดท",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center" as AlignType,
      render: (value: string) => {
        return moment(value).format(SLASH_DMY);
      },
    },
    {
      title: "ผู้ใช้งาน",
      dataIndex: "createBy",
      key: "createBy",
      align: "center" as AlignType,
      render: (value: string) => {
        return value || "-";
      },
    },
    {
      title: "กิจกรรม",
      dataIndex: "action",
      key: "action",
      align: "center" as AlignType,
    },
    {
      title: "ข้อมูลเดิม",
      dataIndex: "beforeValue",
      key: "beforeValue",
      align: "center" as AlignType,
      render: (value: string) => {
        return value || "-";
      },
    },
    {
      title: "ข้อมูลใหม่",
      dataIndex: "afterValue",
      key: "afterValue",
      align: "center" as AlignType,
      render: (value: string) => {
        return value || "-";
      },
    },
  ];

  const tabsItems = [
    {
      label: `รายละเอียด Credit Memo`,
      key: "1",
      children: (
        <>
          {descriptionItems.map(({ label, value }, i) => (
            <Row key={i} style={{ margin: "12px 0px" }}>
              <Col xl={6} sm={8}>
                <Text color='Text3'>{label}</Text>
              </Col>
              <Col xl={18} sm={16}>
                <Text>{value}</Text>
              </Col>
            </Row>
          ))}
          <br />
          <br />
          <Text fontWeight={700}>รายการ Credit Memo</Text>
          <br />
          <br />
          <TableContainer>
            <Table
              columns={creditMemoColumn}
              dataSource={data?.creditMemoShop?.map((s: any, i: any) => ({ ...s, key: i }))}
              loading={loading}
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
      label: `ประวัติการสร้าง Credit Memo`,
      key: "2",
      children: (
        <>
          <Row style={{ margin: "16px 0px" }}>
            <Text fontWeight={700} level={4}>
              รายการประวัติการสร้าง Credit Memo
            </Text>
          </Row>
          <TableContainer>
            <Table
              dataSource={history}
              columns={creditMemoHistoryColumn}
              loading={historyLoading}
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

  return (
    <>
      <div className='container '>
        <CardContainer>
          {loading ? (
            <PageSpin />
          ) : (
            <>
              <PageTitle />
              <Divider />
              <Tabs
                items={tabsItems}
                onChange={(key: string) => {
                  if (key === "2" && !history) {
                    fetchHistory();
                  }
                }}
              />
            </>
          )}
        </CardContainer>
      </div>
    </>
  );
};
