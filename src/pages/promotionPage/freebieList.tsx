import React, { useEffect, useState, memo, useMemo } from "react";
import { Table, Tabs, Row, Col, Input, Select, Avatar, Tag, Switch } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import {
  getProductBrand,
  getProductCategory,
  getProductGroup,
} from "../../datasource/ProductDatasource";
import { nameFormatter, priceFormatter } from "../../utility/Formatter";
import { FlexCol, FlexRow } from "../../components/Container/Container";
import Text from "../../components/Text/Text";
import { BrandEntity } from "../../entities/BrandEntity";
import { STATUS_COLOR_MAPPING } from "../../definitions/product";
import { useRecoilValue } from "recoil";
import { profileAtom } from "../../store/ProfileAtom";
import { ProductGroupEntity } from "../../entities/ProductGroupEntity";
import color from "../../resource/color";

type FixedType = "left" | "right" | boolean;
import * as _ from "lodash";
import { getProductFreebieGroup, getProductFreebies } from "../../datasource/PromotionDatasource";
import { useNavigate } from "react-router-dom";
const SLASH_DMY = "DD/MM/YYYY";

export const FreebieListPage: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };

  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState<string>();
  const [prodGroup, setProdGroup] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [dataState, setDataState] = useState({
    count: 0,
    count_status: [],
    data: [],
    groups: [],
  });

  useEffect(() => {
    if (!loading) fetchProduct();
  }, [keyword, prodGroup, statusFilter, page]);

  const resetPage = () => setPage(1);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, count, count_status } = await getProductFreebies({
        company,
        take: pageSize,
        productGroup: prodGroup,
        searchText: keyword,
        productFreebiesStatus: statusFilter,
        page,
      });

      const { responseData } = await getProductFreebieGroup(company);
      setDataState({
        data,
        count,
        count_status,
        groups: responseData,
      });
      console.log({
        company,
        prodGroup,
        keyword,
        statusFilter,
        page,
        data,
        count_status,
        count,
        responseData,
        userProfile,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const PageTitle = () => {
    return (
      <Row gutter={16}>
        <Col className='gutter-row' xl={16} sm={12}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              รายการของแถม
            </span>
          </div>
        </Col>
        <Col className='gutter-row' xl={4} sm={6}>
          <div style={style}>
            <Input
              placeholder='ค้นหาชื่อสินค้า'
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
        <Col className='gutter-row' xl={4} sm={6}>
          <Select
            defaultValue={prodGroup}
            style={style}
            allowClear
            onChange={(value: string) => {
              setProdGroup(value);
              resetPage();
            }}
            placeholder='เลือกกลุ่มสินค้า'
            options={dataState.groups.map((group: ProductGroupEntity) => ({
              label: group.product_group,
              value: group.product_group,
            }))}
          />
        </Col>
      </Row>
    );
  };


  const tabsItems = [
    { label: "ทั้งหมด", key: "ALL" },
    ...(dataState?.count_status?.map(({ product_freebies_status, count }) => ({
      label: product_freebies_status + `(${count})`,
      key: product_freebies_status,
    })) || []),
  ];

  const columns = [
    {
      title: "ชื่อสินค้า",
      dataIndex: "commonName",
      key: "commonName",
      // width: "12%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexRow align='center'>
              <div style={{ marginRight: 16 }}>
                <Avatar src={row.productFreebiesImage} size={50} shape='square' />
              </div>
              <FlexCol>
                <Text level={5}>{row.productName}</Text>
                <Text level={6} color='Text3'>
                  {value}
                </Text>
              </FlexCol>
            </FlexRow>
          ),
        };
      },
    },
    {
      title: "รหัสสินค้า",
      dataIndex: "productFreebiesCodeNAV",
      key: "productFreebiesCodeNAV",
      // width: "18%",
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
      title: "กลุ่มสินค้า",
      dataIndex: "productGroup",
      key: "productGroup",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{value}</Text>
              <Text level={6} color='Text3'>
                {row.productStrategy}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "สถานะ",
      dataIndex: "productFreebiesStatus",
      key: "productFreebiesStatus",
      // width: "15%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <Tag color={STATUS_COLOR_MAPPING[value]}>{nameFormatter(value)}</Tag>
          ),
        };
      },
    },
    {
      title: "จัดการ",
      dataIndex: "action",
      key: "action",
      width: "5%",
      fixed: "right" as FixedType | undefined,
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <>
              <div className='d-flex flex-row justify-content-between'>
                <div
                  className='btn btn-icon btn-light btn-hover-primary btn-sm'
                  onClick={() =>
                    navigate("/PromotionPage/freebies/" + row.productFreebiesId)
                  }
                >
                  <span className='svg-icon svg-icon-primary svg-icon-2x'>
                    <EditOutlined style={{ color: color["primary"] }} />
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
              setStatusFilter(key === "ALL" ? undefined : key);
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
              showSizeChanger: false
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
