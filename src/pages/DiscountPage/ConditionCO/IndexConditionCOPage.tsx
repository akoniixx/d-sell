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

export const IndexConditionCOPage: React.FC = () => {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 8;
  const [dataState, setDataState] = useState({
    count: 0,
    count_status: [],
    data: [] as any[],
  });
  const [data, setData] = useState<any>([]);
  const fetchCondition = async () => {
    const getList = await getConditionCO({ take: pageSize, page: page, company: company });
    console.log(getList);
    setData(getList.data);
  };

  useEffect(() => {
    fetchCondition();
  }, []);

  const mockData = [
    {
      name: "รายการลดแรง 1",
      dateTime: "2023-03-01 - 2023-03-31",
      countProduct: 5,
      countShop: 3,
      status: true,
      updateBy: "รชยา ช่างภักดี",
    },
    {
      name: "รายการลดแรง 2",
      dateTime: "2023-03-01 - 2023-03-31",
      countProduct: 10,
      countShop: 80,
      status: true,
      updateBy: "รชยา ช่างภักดี",
    },
    {
      name: "รายการลดแรง 3",
      dateTime: "2023-03-01 - 2023-03-31",
      countProduct: 22,
      countShop: 53,
      status: false,
      updateBy: "รชยา ช่างภักดี",
    },
  ];

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
          <Input placeholder='ค้นหารายการ' prefix={<SearchOutlined style={{ color: "grey" }} />} />
        </Col>
        <Col className='gutter-row' xl={6} sm={6}>
          <RangePicker allowEmpty={[true, true]} enablePast />
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
      dataIndex: "startDate",
      key: "startDate",
      width: "20%",
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
              <Text level={5}>{value} รายการ</Text>
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
                    <EditOutlined
                      style={{ color: color["primary"] }}
                      onClick={() =>
                        navigate(`/discount/editConditionCo/` + row.creditMemoConditionId)
                      }
                    />
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
      label: "All",
      key: "ALL",
    },
    {
      label: "Active",
      key: "true",
    },
    {
      label: "InActive",
      key: "false",
    },
  ];

  return (
    <div className='container'>
      <CardContainer>
        <PageTitle />
        <br />
        <Tabs items={tabsItems} />
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
          loading={loading}
          size='large'
          tableLayout='fixed'
        />
      </CardContainer>
    </div>
  );
};
