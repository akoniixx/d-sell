import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Tabs, Tag, Table } from "antd";
import { CardContainer } from "../../../components/Card/CardContainer";
import Button from "../../../components/Button/Button";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb";
import PageTitleNested from "../../../components/PageTitle/PageTitleNested";
import { getCreditHistory, getCreditMemoById } from "../../../datasource/CreditMemoDatasource";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import color from "../../../resource/color";
import Text from "../../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { CreditMemoEntity } from "../../../entities/CreditMemoEntity";
import TableContainer from "../../../components/Table/TableContainer";
import { AlignType } from "rc-table/lib/interface";
import PageSpin from "../../../components/Spin/pageSpin";
import { numberFormatter } from "../../../utility/Formatter";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import { getZones } from "../../../datasource/CustomerDatasource";
import { StoreEntity, ZoneEntity } from "../../../entities/StoreEntity";
import { coPricePeriod } from "../../../definitions/coPricePeriod";

const SLASH_DMY = "DD/MM/YYYY HH:mm:ss";
export const CreditMemoDetail: React.FC = () => {
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();
  const { pathname } = window.location;
  const pathSplit = pathname.split("/") as Array<string>;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CreditMemoEntity>();
  const [dataSearch, setDataSerach] = useState<CreditMemoEntity>();
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState();
  const [zones, setZones] = useState<ZoneEntity[]>([]);
  const [searchZone, setSearchZone] = useState("");
  const [searchCus, setSearchCus] = useState("");
  const [searchPeriod, setSearchPeriod] = useState<any>({ min: "", max: "" });

  useEffect(() => {
    fetchData();
    fetchZone();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const id = pathSplit[3];
    await getCreditMemoById(id)
      .then((res: any) => {
        setData(res);
        setDataSerach(res);
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchZone = async () => {
    const zoneData = await getZones(company);
    setZones(zoneData.map((d: StoreEntity, i: number) => ({ ...d, key: i })));
  };
  const fetchHistory = async () => {
    setHistoryLoading(true);
    const id = pathSplit[3];
    await getCreditHistory(id)
      .then((res: any) => {
        const sorting = res.sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1));
        setHistory(sorting);
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
      title: "ส่วนลดดูแลราคา (บาท)",
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
        return numberFormatter(value, 0) || "-";
      },
    },
    {
      title: "ข้อมูลใหม่",
      dataIndex: "afterValue",
      key: "afterValue",
      align: "center" as AlignType,
      render: (value: string) => {
        return numberFormatter(value, 0) || "-";
      },
    },
  ];

  const searchPricePeriod = (e: any) => {
    const findPeriod = coPricePeriod.find((x) => x.key === e);
    if (findPeriod || searchZone || searchCus) {
      setSearchPeriod({ min: findPeriod?.min, max: findPeriod?.max });
      const findData = data?.creditMemoShop.filter((x) => {
        const searchPeriod =
          !findPeriod?.min ||
          (x.receiveAmount >= findPeriod?.min && x.receiveAmount <= findPeriod?.max);
        const findZone = !searchZone || x.zone.includes(searchZone);
        const findCus =
          !searchCus ||
          x.customerName.includes(searchCus) ||
          x.customerNo.toLocaleLowerCase().includes(searchCus);
        return searchPeriod && findZone && findCus;
      });
      const map: any = { ...data };
      map.creditMemoShop = findData;
      setDataSerach(map);
    } else {
      setSearchPeriod({ min: "", max: "" });
      setDataSerach(data);
    }
  };

  const searchCusZone = (e: any) => {
    if (e || searchPeriod.min || searchPeriod.max || searchCus) {
      setSearchZone(e);
      const findData = data?.creditMemoShop.filter((x) => {
        const findPeriod =
          !searchPeriod?.min ||
          (x.receiveAmount >= (searchPeriod?.min || 0) &&
            x.receiveAmount <= (searchPeriod?.max || 0));
        const findZone = !e || x.zone.includes(e);
        const findCus =
          !searchCus ||
          x.customerName.includes(searchCus) ||
          x.customerNo.toLocaleLowerCase().includes(searchCus);
        return findPeriod && findZone && findCus;
      });
      const map: any = { ...data };
      map.creditMemoShop = findData;
      setDataSerach(map);
    } else {
      setSearchZone("");
      setDataSerach(data);
    }
  };

  const searchCusName = (e: any) => {
    if (e.target.value || searchPeriod.min || searchPeriod.max || searchZone) {
      setSearchCus(e.target.value);
      const findData = data?.creditMemoShop.filter((x) => {
        const findPeriod =
          !searchPeriod?.min ||
          (x.receiveAmount >= (searchPeriod?.min || 0) &&
            x.receiveAmount <= (searchPeriod?.max || 0));
        const findZone = !searchZone || x.zone.includes(searchZone);
        const findCus =
          !e.target.value ||
          x.customerName.includes(e.target.value) ||
          (x.customerNo && x.customerNo.toLocaleLowerCase().includes(e.target.value));

        console.log("f", findCus);
        return findPeriod && findZone && findCus;
      });
      const map: any = { ...data };
      map.creditMemoShop = findData;
      setDataSerach(map);
    } else {
      setSearchCus("");
      setDataSerach(data);
    }
  };

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
          <Row gutter={8}>
            <Col span={12}>
              <Text fontWeight={700}>รายการส่วนลดดูแลราคา</Text>
            </Col>
            <Col span={4}>
              <Select
                allowClear
                data={[
                  ...coPricePeriod.map((z: any) => ({
                    label: z.lable,
                    key: z.key,
                    value: z.key,
                  })),
                ]}
                placeholder='เลือกช่วงราคา'
                style={{ width: "100%" }}
                onChange={(e) => searchPricePeriod(e)}
              />
            </Col>
            <Col span={4}>
              <Select
                allowClear
                data={[...zones.map((z) => ({ label: z.zoneName, key: z.zoneName }))]}
                placeholder='เขตร้านค้า : ทั้งหมด'
                style={{ width: "100%" }}
                onChange={searchCusZone}
              />
            </Col>
            <Col span={4}>
              <Input
                allowClear
                placeholder='ค้นหาร้านค้า...'
                prefix={<SearchOutlined style={{ color: "grey" }} />}
                onChange={(e) => searchCusName(e)}
              />
            </Col>
          </Row>
          <br />
          <Row justify={"end"}>
            <Col>
              <Text>{`จำนวนที่เลือก ${dataSearch?.creditMemoShop.length} ร้านค้า`}</Text>
            </Col>
          </Row>
          <TableContainer>
            <Table
              columns={creditMemoColumn}
              dataSource={dataSearch?.creditMemoShop?.map((s: any, i: any) => ({ ...s, key: i }))}
              loading={loading}
              pagination={false}
              scroll={{ y: 500 }}
              style={{ height: "500px" }}
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
