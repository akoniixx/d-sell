import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Col, Row, Switch, Table, Tabs } from "antd";
import { useState, useEffect } from "react";
import { CardContainer } from "../../../components/Card/CardContainer";
import Button from "../../../components/Button/Button";
import { FlexCol } from "../../../components/Container/Container";
import { color } from "../../../resource";
import Input from "../../../components/Input/Input";
import { RangePicker } from "../../../components/DatePicker/DatePicker";
import Text from "../../../components/Text/Text";
import { useNavigate } from "react-router-dom";
import { getConditionCO } from "../../../datasource/CreditMemoDatasource";
import { dateFormatter } from "../../../utility/Formatter";
import moment from "moment";
import dayjs from "dayjs";

export const IndexConditionCOPage: React.FC = () => {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const [page, setPage] = useState<number>(1);
  const pageSize = 8;
  const [dataState, setDataState] = useState({
    count: 0,
    count_status: [],
    data: [] as any[],
  });
  const [data, setData] = useState<any>([]);
  const [keyword, setKeyword] = useState("");
  const [searchDate, setSearchDate] = useState<any>();
  const [selectedTab, setSelectedTab] = useState<"all" | "true" | "false">("all");

  const fetchCondition = async () => {
    const getList = await getConditionCO({
      take: pageSize,
      page: page,
      company: company,
      searchText: keyword,
      startDate: searchDate?.startDate,
      endDate: searchDate?.endDate,
      creditMemoConditionStatus: selectedTab === "all" ? undefined : selectedTab,
    });
    console.log(getList);
    setDataState(getList);
    setData(getList.data);
  };

  useEffect(() => {
    fetchCondition();
  }, [keyword, searchDate, selectedTab, searchDate]);

  const onSearchKeyword = (e: any) => {
    setKeyword(e.target.value);
  };
  const onSearchDate = (e: any) => {
    const startDate = moment(e[0].$d).format("yyyy-MM-DD");
    const endDate = moment(e[1].$d).format("yyyy-MM-DD");
    setSearchDate({ startDate, endDate });
  };

  const PageTitle = () => {
    return (
      <Row align='middle' gutter={12}>
        <Col className='gutter-row' xl={10} sm={6}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              รายการเงื่อนไข CO
            </span>
          </div>
        </Col>
        <Col className='gutter-row' xl={4} sm={6}>
          <Input
            placeholder='ค้นหารายการ'
            prefix={<SearchOutlined style={{ color: "grey" }} />}
            onPressEnter={(e) => onSearchKeyword(e)}
            defaultValue={keyword}
          />
        </Col>
        <Col className='gutter-row' xl={6} sm={6}>
          <RangePicker
            allowEmpty={[true, true]}
            enablePast
            onChange={(dates) => {
              onSearchDate(dates);
            }}
            value={[dayjs(searchDate?.startDate), dayjs(searchDate?.endDate)]}
          />
        </Col>
        <Col className='gutter-row' xl={4} sm={6}>
          <Button
            type='primary'
            title='+ สร้างเงื่อนไข'
            height={40}
            onClick={() => (window.location.pathname = "discount/createConditionCo")}
          />
        </Col>
      </Row>
    );
  };

  const dataTable = [
    {
      title: "ชื่อรายการ",
      dataIndex: "creditMemoConditionName",
      key: "creditMemoConditionName",
      width: "25%",
    },
    {
      title: "ระยะเวลา",
      width: "20%",
      render: (value: any, row: any) => {
        return {
          children: (
            <Text>{dateFormatter(row?.startDate) + " - " + dateFormatter(row?.endDate)}</Text>
          ),
        };
      },
    },
    {
      title: "จำนวนสินค้า",
      dataIndex: "countProduct",
      key: "countProduct",
      width: "12%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{row.creditMemoConditionProduct.length} รายการ</Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "จำนวนร้านค้า",
      dataIndex: "creditMemoConditionShop",
      key: "creditMemoConditionShop",
      width: "12%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{row.creditMemoConditionShop.length} รายการ</Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "อัปเดทโดย",
      dataIndex: "updateBy",
      key: "updateBy",
      width: "15%",
    },
    {
      title: "สถานะ",
      dataIndex: "creditMemoConditionStatus",
      key: "creditMemoConditionStatus",
      width: "10%",
      render: (value: any, row: any, index: number) => {
        return {
          children: <Switch checked={value} />,
        };
      },
    },
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      width: "12%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <div className='d-flex flex-row justify-content-between'>
                <div className='btn btn-icon btn-light btn-hover-primary btn-sm'>
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <UnorderedListOutlined
                      style={{ color: color["primary"] }}
                      onClick={() =>
                        navigate(`/discount/conditionco/detail/` + row.creditMemoConditionId)
                      }
                    />
                  </span>
                </div>
                <div className='btn btn-icon btn-light btn-hover-primary btn-sm'>
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <EditOutlined style={{ color: color["primary"] }} />
                  </span>
                </div>
                <div className='btn btn-icon btn-light btn-hover-primary btn-sm'>
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <DeleteOutlined style={{ color: color["primary"] }} />
                  </span>
                </div>
              </div>
            </>
          ),
        };
      },
    },
  ];
  const tabsItems = [
    {
      label: "All " + `(${dataState.count})`,
      key: "all",
    },
    {
      label: "Active " + `(${0})`,
      key: "true",
    },
    {
      label: "InActive " + `(${0})`,
      key: "false",
    },
  ];

  return (
    <div className='container'>
      <CardContainer>
        <PageTitle />
        <br />
        <Tabs
          items={tabsItems}
          onChange={(key: string) => {
            setSelectedTab((key as "all" | "true") || "false");
          }}
          defaultValue={selectedTab}
        />
        <Table
          columns={dataTable}
          dataSource={data}
          pagination={{
            position: ["bottomCenter"],
            pageSize,
            current: page,
            total: dataState?.count,
            onChange: (p) => setPage(p),
          }}
          size='large'
          tableLayout='fixed'
        />
      </CardContainer>
    </div>
  );
};
