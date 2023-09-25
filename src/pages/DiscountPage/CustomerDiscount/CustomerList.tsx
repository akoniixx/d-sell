import React, { useEffect, useState } from "react";
import { Table, Row, Col } from "antd";
import { CardContainer } from "../../../components/Card/CardContainer";
import { SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { getCustomerCreditMemoList } from "../../../datasource/CreditMemoDatasource";
import { FlexCol } from "../../../components/Container/Container";
import Text from "../../../components/Text/Text";
import color from "../../../resource/color";
import { priceFormatter } from "../../../utility/Formatter";
import { getZones } from "../../../datasource/CustomerDatasource";
import Select from "../../../components/Select/Select";
import { AlignType } from "rc-table/lib/interface";
import Permission, { checkPermission } from "../../../components/Permission/Permission";
import { useRecoilValue } from "recoil";
import { roleAtom } from "../../../store/RoleAtom";

type FixedType = "left" | "right" | boolean;

export const CustomerDiscountListPage: React.FC = () => {
  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company, firstname, lastname } = userProfile;
  const roleData = useRecoilValue(roleAtom);

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [dataState, setDataState] = useState({
    count: 0,
    count_status: [],
    data: [],
  });
  const [zones, setZones] = useState<any>();
  const [searchZone, setSearchZone] = useState<any>();

  useEffect(() => {
    if (!loading) fetchData();
    fetchZone();
  }, [keyword, statusFilter, page, searchZone]);

  const resetPage = () => setPage(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, count, count_status } = await getCustomerCreditMemoList({
        company,
        creditMemoShopStatus: statusFilter,
        searchText: keyword,
        take: pageSize,
        page,
        zone: searchZone,
      });
      setDataState({
        data: data?.map((e: any, i: number) => ({ ...e, key: i })),
        count,
        count_status,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const fetchZone = async () => {
    const zoneData = await getZones(company);
    const data = zoneData.map((item: any) => {
      return {
        label: item.zoneName,
        value: item.zoneName,
        key: item.zoneId,
      };
    });
    setZones(data);
  };

  const PageTitle = () => {
    return (
      <Row justify={"space-between"} gutter={8}>
        <Col span={company === "ICPF" ? 15 : 11}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              ส่วนลดดูแลราคารายร้าน
            </span>
          </div>
        </Col>
        <Permission permission={["manageConditionStore", "create"]} reverse>
          <Col span={4} />
        </Permission>
        <Col span={4}>
          <Select
            allowClear
            value={searchZone}
            placeholder='เขตร้านค้า : ทั้งหมด'
            data={zones}
            style={{ width: "100%" }}
            onChange={(e) => setSearchZone(e)}
          />
        </Col>
        <Col span={5}>
          <Input
            allowClear
            placeholder='ค้นหาร้านค้า/รหัสร้านค้า'
            prefix={<SearchOutlined style={{ color: "grey" }} />}
            defaultValue={keyword}
            onPressEnter={(e: any) => {
              const value = (e.target as HTMLTextAreaElement).value;
              setKeyword(value);
              resetPage();
            }}
            onChange={(e: any) => {
              const value = (e.target as HTMLInputElement).value;
              if (!value) {
                setKeyword("");
                resetPage();
              }
            }}
            style={{ width: "100%" }}
          />
        </Col>
        {company !== "ICPF" && (
          <Permission permission={["manageConditionStore", "create"]}>
            <Col span={4}>
              <Button
                type='primary'
                title='+ สร้างส่วนลดดูแลราคา'
                height={40}
                onClick={() => navigate(`/discount/create`)}
              />
            </Col>
          </Permission>
        )}
      </Row>
    );
  };

  const tabsItems = [
    {
      label: `ทั้งหมด (${
        dataState?.count_status?.reduce((prev, { count }) => prev + parseInt(count), 0) || 0
      })`,
      key: "ALL",
    },
    {
      label: `Active (${
        (dataState?.count_status?.find((s: any) => s.credit_memo_status) as any)?.count || 0
      })`,
      key: "true",
    },
    {
      label: `Inactive (${
        (dataState?.count_status?.find((s: any) => !s.credit_memo_status) as any)?.count || 0
      })`,
      key: "false",
    },
  ];

  const columns = [
    {
      title: "Customer No",
      dataIndex: "customer_no",
      key: "customer_no",
      width: "15%",
    },
    {
      title: "ชื่อร้านค้า",
      dataIndex: "customer_name",
      key: "customername",
      width: "25%",
      render: (value: string, row: any) => {
        return (
          <>
            <FlexCol>
              <Text level={6}>{value}</Text>
              <Text color='Text3' level={6}>
                {row.province ? "จ." + row.province : "-"}
              </Text>
            </FlexCol>
          </>
        );
      },
    },
    {
      title: "ชื่อเจ้าของร้าน",
      dataIndex: "firstname",
      key: "name",
      width: "20%",
      render: (firstname: string, row: any) => {
        return (
          <>
            <FlexCol>
              <Text level={6}>{`${firstname || "-"} ${row.lastname || ""}`}</Text>
            </FlexCol>
          </>
        );
      },
    },
    {
      title: "เขต",
      dataIndex: "zone",
      key: "zone",
      width: "10%",
    },
    {
      title: <div style={{ display: "flex", justifyContent: "flex-start" }}>ยอดคงเหลือ</div>,
      dataIndex: "balance",
      key: "balance",
      width: "15%",
      align: "right" as AlignType,
      render: (value: string, row: any) => {
        return priceFormatter(value, undefined, true);
      },
    },
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      width: "15%",
      fixed: "right" as FixedType | undefined,
      hidden: !checkPermission(["manageConditionStore", "view"], roleData),
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <div className='d-flex flex-row justify-content-between'>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() => navigate("/discount/customerDetail/" + row.customer_company_id)}
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <UnorderedListOutlined style={{ color: color["primary"] }} />
                  </span>
                </div>
              </div>
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
          <Table
            className='rounded-lg'
            columns={columns}
            dataSource={dataState.data}
            pagination={{
              showSizeChanger: false,
              pageSize,
              current: page,
              onChange: (page) => setPage(page),
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
