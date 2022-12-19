import React, { useEffect, useState, memo, useMemo } from "react";
import { Table, Tabs, Row, Col, Select, Avatar, Tag, Switch } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { UnorderedListOutlined, SearchOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import {
  getProductBrand,
  getProductCategory,
  getProductGroup,
  getProductList,
} from "../../datasource/ProductDatasource";
import { nameFormatter, priceFormatter } from "../../utility/Formatter";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import Text from "../../components/Text/Text";
import { BrandEntity } from "../../entities/BrandEntity";
import { LOCATION_FULLNAME_MAPPING } from "../../definitions/location";
import { STATUS_COLOR_MAPPING } from "../../definitions/product";
import { useRecoilValue } from "recoil";
import { profileAtom } from "../../store/ProfileAtom";
import { ProductGroupEntity } from "../../entities/ProductGroupEntity";
import color from "../../resource/color";
import * as _ from "lodash";
import Button from "../../components/Button/Button";
import moment from "moment";
import Input from "../../components/Input/Input";
import { RangePicker } from "../../components/DatePicker/DatePicker";

type FixedType = "left" | "right" | boolean;
const SLASH_DMY = "DD/MM/YYYY";

export const PromotionListPage: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };

  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const [keyword, setKeyword] = useState<string>();
  const [prodGroup, setProdGroup] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState({
    count: 0,
    count_location: [],
    data: [],
    groups: [],
    categories: [],
    brands: [],
  });

  useEffect(() => {
    if (!loading) fetchProduct();
  }, [keyword, prodGroup, location, page]);

  const resetPage = () => setPage(1);

  const fetchProduct = async () => {
    try {
      setLoading(true);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const PageTitle = () => {
    return (
      <Row align='middle' gutter={16}>
        <Col className='gutter-row' xl={10} sm={6}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              รายการโปรโมชั่น
            </span>
          </div>
        </Col>
        <Col className='gutter-row' xl={4} sm={6}>
          <div style={style}>
            <Input
              placeholder='ค้นหาโปรโมชั่น'
              prefix={<SearchOutlined style={{ color: "grey" }} />}
              defaultValue={keyword}
              onPressEnter={(e) => {
                const value = (e.target as HTMLTextAreaElement).value;
                setKeyword(value);
                resetPage();
              }}
            />
          </div>
        </Col>
        <Col className='gutter-row' xl={6} sm={6}>
          <RangePicker
            
          />
        </Col>
        <Col className='gutter-row' xl={4} sm={6}>
          <Button
            type='primary'
            title='+ สร้างโปรโมชัน'
            height={40}
            onClick={() => window.location.pathname = '/PromotionPage/promotion/create'}
          />
        </Col>
      </Row>
    );
  };

  const tabsItems = [
        { label: "ทั้งหมด", key: "ALL" },
        { label: "Active", key: "active" },
        { label: "Inactive", key: "inactive" },
    ]

  const columns = [
    {
      title: "ชื่อโปรโมชัน",
      dataIndex: "promotionName",
      key: "promotionName",
      // width: "12%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexRow align='center'>
              <div style={{ marginRight: 16 }}>
                <Avatar src={row.promotionImage} size={50} shape='square' />
              </div>
              <FlexCol>
                <Text level={5}>{value}</Text>
                <Text level={6} color='Text3'>
                  {row.memo}
                </Text>
              </FlexCol>
            </FlexRow>
          ),
        };
      },
    },
    {
      title: "ประเภทส่วนลด",
      dataIndex: "promotionType",
      key: "promotionType",
      // width: "18%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{value}</Text>
              <Text level={6} color='Text3'>
                {row.numOfStore}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "เลขที่อ้างอิง",
      dataIndex: "refNo",
      key: "refNo",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{value}</Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "ระยะเวลา",
      dataIndex: "startDate",
      key: "startDate",
      // width: "15%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{moment(row.startDate).format(SLASH_DMY)}-{moment(row.endDate).format(SLASH_DMY)}</Text>
            </FlexCol>
          ),
        };
      },
    },
    {
        title: "อัปเดทโดย",
        dataIndex: "updateBy",
        key: "updateBy",
        // width: "15%",
        render: (value: any, row: any, index: number) => {
          return {
            children: (
              <FlexCol>
                <Text level={5}>{value}</Text>
                <Text level={6} color='Text3'>
                    {moment(row.updateDate).format(SLASH_DMY)}
                </Text>
              </FlexCol>
            ),
          };
        },
    },
    {
        title: "การอนุมัติ",
        dataIndex: "approveStatus",
        key: "approveStatus",
        render: (value: any, row: any, index: number) => {
          return {
            children: <Tag color={STATUS_COLOR_MAPPING[value]}>{nameFormatter(value)}</Tag>,
          };
        }
    },
    {
        title: "สถานะ",
        dataIndex: "status",
        key: "status",
        // width: "15%",
        render: (value: any, row: any, index: number) => {
          return {
            children: (
              <Switch 
                defaultChecked={value} 
                onChange={(checked: boolean) => {console.log('onToggleSwitch', checked)}}
              />
            ),
          };
        },
    },
    {
        title: "จัดการ",
        dataIndex: "action",
        key: "action",
        width: "10%",
        fixed: "right" as FixedType | undefined,
        render: (value: any, row: any, index: number) => {
          return {
            children: (
              <>
                <div className='d-flex flex-row justify-content-between'>
                <div
                    className='btn btn-icon btn-light btn-hover-primary btn-sm'
                    onClick={() =>
                      (window.location.href = "/PriceListPage/DistributionPage/" + row.productId)
                    }
                  >
                    <span className='svg-icon svg-icon-primary svg-icon-2x'>
                      <CopyOutlined style={{ color: color["primary"] }} />
                    </span>
                  </div>
                  <div
                    className='btn btn-icon btn-light btn-hover-primary btn-sm'
                    onClick={() =>
                      (window.location.href = "/PriceListPage/DistributionPage/" + row.productId)
                    }
                  >
                    <span className='svg-icon svg-icon-primary svg-icon-2x'>
                      <EditOutlined style={{ color: color["primary"] }} />
                    </span>
                  </div>
                  <div
                    className='btn btn-icon btn-light btn-hover-primary btn-sm'
                    onClick={() =>
                      (window.location.href = "/PriceListPage/DistributionPage/" + row.productId)
                    }
                  >
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

  return (
    <>
      <div className='container '>
        <CardContainer>
          <PageTitle />
          <br />
          <Tabs
            items={tabsItems}
            onChange={(key: string) => {
              setLocation(key === "ALL" ? undefined : key);
              resetPage();
            }}
          />
          <Table
            className='rounded-lg'
            columns={columns}
            scroll={{ x: "max-content" }}
            dataSource={dataState?.data?.map((d: object, i) => ({ ...d, key: i }))}
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
    </>
  );
};
