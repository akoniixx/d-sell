import React, { useEffect, useState, memo, useMemo } from "react";
import { Table, Tabs, Row, Col, Input, Select, Avatar, Tag } from "antd";
import { CardContainer } from "../../components/Card/CardContainer";
import { UnorderedListOutlined, SearchOutlined } from "@ant-design/icons";
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
import image from "../../resource/image";
import { useNavigate } from "react-router-dom";

type FixedType = "left" | "right" | boolean;
const SLASH_DMY = "DD/MM/YYYY";

export const DistributionPage: React.FC = () => {
  const style: React.CSSProperties = {
    width: "180px",
  };

  const pageSize = 8;
  const userProfile = JSON.parse(localStorage.getItem("profile")!);
  const { company } = userProfile;

  const navigate = useNavigate();

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
      const { data, count, count_location } = await getProductList({
        company,
        take: pageSize,
        productGroup: prodGroup,
        searchText: keyword,
        productLocation: location,
        page,
      });

      const { responseData } = await getProductGroup(company);
      const brands = await getProductBrand(company);
      const categories = await getProductCategory(company);
      setDataState({
        data,
        count,
        count_location,
        groups: responseData,
        brands,
        categories,
      });
      console.log({
        company,
        prodGroup,
        keyword,
        location,
        page,
        data,
        count_location,
        count,
        responseData,
        brands,
        categories,
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
      <Row>
        <Col className='gutter-row' xl={16} sm={10}>
          <div>
            <span
              className='card-label font-weight-bolder text-dark'
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              รายการสินค้า
            </span>
          </div>
        </Col>
        <Col className='gutter-row' xl={4} sm={7}>
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
              onChange={(e) => {
                const value = (e.target as HTMLInputElement).value;
                if(!value) {
                  setKeyword('');
                  resetPage();
                }
              }}
            />
          </div>
        </Col>
        <Col className='gutter-row' xl={4} sm={7}>
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
    ...(dataState?.count_location?.map(({ location, count }) => ({
      label: LOCATION_FULLNAME_MAPPING[location] + `(${count})`,
      key: location,
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
                <Avatar src={row.productImage || image.product_no_image} size={50} shape='square' />
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
      title: "ขนาด",
      dataIndex: "packSize",
      key: "packSize",
      // width: "18%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{value}</Text>
              <Text level={6} color='Text3'>
                {row.productCodeNAV}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "หมวดสินค้า",
      dataIndex: "productCategoryId",
      key: "productCategoryId",
      width: '124px',
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{(dataState?.categories?.find((c: any) => c.productCategoryId === value) as any)?.productCategoryName || '-'}</Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "กลุ่มสินค้า",
      dataIndex: "productGroup",
      key: "productGroup",
      width: '132px',
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
      title: "Product Brands",
      dataIndex: "productBrandId",
      key: "productBrandId",
      // width: "15%",
      render: (value: any, row: any, index: number) => {
        const brand: BrandEntity =
          dataState?.brands?.find((d: BrandEntity) => value === d.productBrandId) || null!;
        return {
          children: (
            <FlexCol>
              <Text level={5}>{brand.productBrandName}</Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "โรงงาน",
      dataIndex: "productLocation",
      key: "productLocation",
      // width: "13%",
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{LOCATION_FULLNAME_MAPPING[value] || "-"}</Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "ราคา / หน่วย",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: '132px',
      fixed: "right" as FixedType | undefined,
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5}>{priceFormatter(value)}</Text>
              <Text level={6} color='Text3'>
                {row.saleUOM}
              </Text>
            </FlexCol>
          ),
        };
      },
    },
    {
      title: "สถานะ",
      dataIndex: "productStatus",
      key: "productStatus",
      fixed: "right" as FixedType | undefined,
      render: (value: any, row: any, index: number) => {
        return {
          children: <Tag color={STATUS_COLOR_MAPPING[value]}>{nameFormatter(value)}</Tag>,
        };
      },
    },
    {
      title: "ราคาต่อแพ็ค",
      dataIndex: "marketPrice",
      key: "marketPrice",
      width: '136px',
      fixed: "right" as FixedType | undefined,
      render: (value: any, row: any, index: number) => {
        return {
          children: (
            <FlexCol>
              <Text level={5} color='primary' fontWeight={700}>
                {priceFormatter(value || "")}
              </Text>
              <Text level={6} color='Text3'>
                {row.saleUOM}
              </Text>
            </FlexCol>
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
                    navigate("/PriceListPage/DistributionPage/" + row.productId)
                  }
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
