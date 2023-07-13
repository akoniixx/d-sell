import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Tabs, Tag, Table } from "antd";
import { CardContainer } from "../../../components/Card/CardContainer";
import Button from "../../../components/Button/Button";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import { getCreditHistory, getCreditMemoById } from "../../../datasource/CreditMemoDatasource";
import { EditOutlined } from "@ant-design/icons";
import color from "../../../resource/color";
import Text from "../../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { CreditMemoEntity } from "../../../entities/CreditMemoEntity";
import TableContainer from "../../../components/Table/TableContainer";
import { AlignType } from "rc-table/lib/interface";
import PageSpin from "../../../components/Spin/pageSpin";
import { numberFormatter } from "../../../utility/Formatter";

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
        title='รายละเอียด ส่วนลดดูแลราคา'
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
              { text: "รายการ เพิ่ม/ลด ส่วนลดดูแลราคา", path: "/discount/list" },
              { text: "รายละเอียด ส่วนลดดูแลราคา", path: window.location.pathname },
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
      dataIndex: "customerNo",
      key: "customerNo",
      align: "center" as AlignType,
    },
    {
      title: "ชื่อร้านค้า",
      dataIndex: "customerName",
      key: "customerName",
      align: "center" as AlignType,
    },
    {
      title: "เขต",
      dataIndex: "zone",
      key: "zone",
      align: "center" as AlignType,
    },
    {
      title: "ส่วนลดดูแลราคา",
      dataIndex: "receiveAmount",
      key: "receiveAmount",
      align: "center" as AlignType,
      render: (value: any) => {
        return numberFormatter(value, 0);
      },
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
      label: `รายละเอียด ส่วนลดดูแลราคา`,
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
          <Text fontWeight={700}>รายการ ส่วนลดดูแลราคา</Text>
          <br />
          <br />
          <TableContainer>
            <Table
              columns={creditMemoColumn}
              dataSource={data?.creditMemoShop?.map((s: any, i: any) => ({ ...s, key: i }))}
              loading={loading}
              pagination={false}
            />
          </TableContainer>
        </>
      ),
    },
    {
      label: `ประวัติการสร้าง ส่วนลดดูแลราคา`,
      key: "2",
      children: (
        <>
          <Row style={{ margin: "16px 0px" }}>
            <Col>
              <Text fontWeight={700} level={4}>
                รายการประวัติการสร้าง ส่วนลดดูแลราคา
              </Text>
            </Col>
          </Row>
          <TableContainer>
            <Table
              dataSource={history}
              columns={creditMemoHistoryColumn}
              loading={historyLoading}
              pagination={false}
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
