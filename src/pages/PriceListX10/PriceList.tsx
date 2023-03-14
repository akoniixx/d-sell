import React, { useEffect, useState, memo } from "react";
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
import { getCreditMemoList } from "../../datasource/CreditMemoDatasource";
import moment from "moment";
import { FlexCol } from "../../components/Container/Container";
import Text from "../../components/Text/Text";
import color from "../../resource/color";
import Select from "../../components/Select/Select";
import { useRecoilValue, useSetRecoilState } from "recoil";
import customerCompanyState from "../../store/customerCompany";
import { getCustomers, getZones } from "../../datasource/CustomerDatasource";
import { getSpecialPriceList } from "../../datasource/SpecialPriceDatasource";
import { StoreEntity, ZoneEntity } from "../../entities/StoreEntity";
import { AlignType } from "rc-table/lib/interface";

const SLASH_DMY = "DD/MM/YYYY";

export const PriceListX10: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };
  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();

  const customerCompanyValue = useRecoilValue(customerCompanyState);
  const setCustomerCompanyState = useSetRecoilState(customerCompanyState);

  const [keyword, setKeyword] = useState("");
  const [zoneFilter, setZoneFilter] = useState<any>();
  const [zones, setZones] = useState<ZoneEntity[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [statusCount, setStatusCount] = useState({
    ALL: 0,
    true: 0,
    false: 0,
  });
  const [dataState, setDataState] = useState({
    data: customerCompanyValue.specialPrice,
    specialPrice: customerCompanyValue.specialPriceCount,
    filteredData: customerCompanyValue.specialPrice,
  });

  useEffect(() => {
    if (!loading && (customerCompanyValue.data.length <= 0 || zones.length <= 0)) fetchData();
  }, []);

  useEffect(() => {
    let data = [...customerCompanyValue.specialPrice];
    if (keyword) {
      data = data.filter((d: any) => `${d?.customerName || ""}`.includes(keyword));
    }
    if (zoneFilter) {
      data = data.filter((d: any) => d?.zone === zoneFilter);
    }
    const newStatusCount = {
      ...statusCount,
      ALL: data.length,
    };
    if (statusFilter) {
      data = data.filter((d: any) => !!d?.status === (statusFilter === "true"));
      if (statusFilter === "true") {
        newStatusCount.true = data.length;
        newStatusCount.false = newStatusCount.ALL - data.length;
      } else {
        newStatusCount.false = data.length;
        newStatusCount.true = newStatusCount.ALL - data.length;
      }
    } else {
      newStatusCount.true = data.reduce((acc, d: any) => (d?.status ? acc + 1 : acc), 0);
      newStatusCount.false = newStatusCount.ALL - newStatusCount.true;
    }
    setDataState({
      ...dataState,
      filteredData: data,
    });
    setStatusCount(newStatusCount);
    resetPage();
  }, [keyword, zoneFilter, statusFilter]);

  const resetPage = () => setPage(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, count, count_status } = await getCustomers({
        company,
        cutomerType: "DL",
      });
      const { responseData } = await getSpecialPriceList({});
      const specialPriceList = responseData?.filter((r: any) =>
        data?.find((d: any) => d.customerCompanyId === r.customer_company_id),
      );
      const specialPriceData = data?.map((d: StoreEntity, i: number) => {
        const found = responseData?.find((r: any) => d.customerCompanyId === r.customer_company_id);
        return {
          ...d,
          status: found && found.count && parseInt(found.count) > 0,
          key: i,
        };
      });
      const zoneData = await getZones(company);
      setZones(zoneData.map((d: StoreEntity, i: number) => ({ ...d, key: i })));
      setDataState({
        data: specialPriceData,
        specialPrice: specialPriceList,
        filteredData: specialPriceData,
      });
      setStatusCount({
        ALL: specialPriceData?.length || 0,
        true: specialPriceList?.length || 0,
        false: (specialPriceData?.length || 0) - (responseData?.length || 0),
      });
      setCustomerCompanyState({
        data,
        specialPrice: specialPriceData,
        specialPriceCount: responseData,
      });
      console.log({
        responseData,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const PageTitle = () => {
    return (
      <Row align='middle' gutter={16}>
        <Col className='gutter-row' xl={12} sm={6}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              รายการสินค้าเฉพาะร้าน
            </span>
          </div>
        </Col>
        <Col className='gutter-row' xl={4} sm={6}>
          <div style={style}>
            <Input
              placeholder='ค้นหาร้านค้า...'
              prefix={<SearchOutlined style={{ color: "grey" }} />}
              defaultValue={keyword}
              onPressEnter={(e) => {
                const value = (e.target as HTMLTextAreaElement).value;
                setKeyword(value);
                // resetPage();
              }}
              onChange={(e) => {
                const value = (e.target as HTMLInputElement).value;
                if (!value) {
                  setKeyword("");
                  // resetPage();
                }
              }}
            />
          </div>
        </Col>
        <Col className='gutter-row' xl={4} sm={6}>
          <Select
            data={[
              { label: "ทั้งหมด", key: "" },
              ...zones.map((z) => ({ label: z.zoneName, key: z.zoneName })),
            ]}
            placeholder='เขตร้านค้า : ทั้งหมด'
            style={{ width: "100%" }}
            onChange={(val) => setZoneFilter(val)}
            value={zoneFilter}
          />
        </Col>
        <Col className='gutter-row' xl={4} sm={6}>
          <Button
            type='primary'
            title='+ เพิ่มราคาเฉพาะร้าน'
            height={40}
            onClick={() => navigate(`/price/create`)}
          />
        </Col>
      </Row>
    );
  };

  const tabsItems = [
    {
      label: `ทั้งหมด (${statusCount.ALL})`,
      key: "ALL",
    },
    {
      label: `ราคาเฉพาะร้าน (${statusCount.true})`,
      key: "true",
    },
    {
      label: `ราคาปกติ (${statusCount.false})`,
      key: "false",
    },
  ];

  const columns = [
    {
      title: "No. Member",
      dataIndex: "customerCompanyId",
      key: "customerCompanyId",
      width: "20%",
    },
    {
      title: "ชื่อร้านค้า",
      dataIndex: "customerName",
      key: "customerName",
      width: "30%",
    },
    // {
    //   title: "รายชื่อสมาชิก",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   width: "25%",
    //   render: (value: string) => {
    //     return moment(value).format(SLASH_DMY);
    //   },
    // },
    {
      title: "เขต",
      dataIndex: "zone",
      key: "zone",
      width: "20%",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: "20%",
      align: "center" as AlignType,
      render: (value: any, row: any, index: number) => {
        return {
          children: value ? <Tag color={color.primary}>ราคาเฉพาะร้าน</Tag> : <Tag>ราคาปกติ</Tag>,
        };
      },
    },
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      width: "15%",
      render: (value: any, row: any, index: number) => {
        return {
          children: row.status ? (
            <>
              <div className='d-flex flex-row justify-content-between'>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() => navigate("/price/detail/" + row.customerCompanyId)}
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
          <Tabs
            items={tabsItems}
            onChange={(key: string) => {
              setStatusFilter(key === "ALL" ? undefined : key);
              resetPage();
            }}
          />
          <Table
            className='rounded-lg'
            columns={columns}
            dataSource={dataState.filteredData}
            pagination={{
              pageSize,
              current: page,
              showSizeChanger: false,
              onChange: (p) => setPage(p),
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
